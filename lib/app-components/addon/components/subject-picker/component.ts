import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import EmberObject, { setProperties } from '@ember/object';
import { task } from 'ember-concurrency';
import DS from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';
import OsfModel, { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import Provider from 'ember-osf-web/models/provider';
import Subject from 'ember-osf-web/models/subject';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

interface ObjectWithId {
    [i: string]: any;
    id: string;
}

function arrayEquals(arr1: ObjectWithId[], arr2: ObjectWithId[]) {
    return arr1.length === arr2.length && arr1.every((val, i) => val.id === arr2[i].id);
}

function arrayStartsWith(arr: Taxonomy[], prefix: Taxonomy[]) {
    return prefix.reduce((acc, val, i) => acc && val && arr[i] && val.id === arr[i].id, true);
}

interface Column extends EmberObject {
    subjects: Subject[];
    selection: Subject | null;
}

interface ModelWithSubjects extends OsfModel {
    subjects: DS.PromiseManyArray<Subject>;
}

interface SparseSubject {
    id: string;
    text: string;
    parent: SparseSubject | null;
}

@layout(template, styles)
export default class SubjectPicker extends Component.extend({
    initializeSubjects: task(function *(this: SubjectPicker) {
        const subjects: SparseSubject[] = yield this.model.sparseLoadAll('subjects', {
            subject: ['text'],
        });
        this.initialSubjects = [...subjects];
        this.querySubjects.perform();
    }),

    querySubjects: task(
        function *(
            this: SubjectPicker,
            parent: string = 'null',
            tier: number = 0,
        ): IterableIterator<any> {
            const column: Column = this.columns.objectAt(tier)!;

            const subjects: QueryHasManyResult<Subject> = yield this.provider.queryHasMany('subjects', {
                filter: {
                    parent,
                },
                page: {
                    size: 150, // Law category has 117 (Jan 2018)
                },
            });

            column.setProperties({ subjects });
        },
    ),
}) {
    // Required
    model!: ModelWithSubjects;
    provider!: Provider;

    // Optional
    editMode: boolean = defaultTo(this.editMode, false);

    // Private
    @service analytics!: Analytics;
    @service store!: DS.Store;

    initialSubjects?: SparseSubject[];
    hasChanged: boolean = false;
    columns!: Column[];

    constructor() {
        super();

        this.columns = Array.from({ length: 3 })
            .map((): Column => EmberObject.create({
                subjects: [],
                selection: null,
            }));
    }

    didReceiveAttrs() {
        super.didReceiveAttrs();

        assert('<SubjectPicker> requires @model', Boolean(this.model));
        assert('<SubjectPicker> requires @provider', Boolean(this.provider));

        this.initializeSubjects.perform();
    }

    resetColumnSelections() {
        this.columns.forEach((column, i) => {
            setProperties(column, {
                subjects: i < 1 ? column.subjects : [],
                selection: null,
            });
        });
    }

    @action
    deselect(this: SubjectPicker, index: number) {
        this.set('hasChanged', true);
        this.resetColumnSelections();

        const tempSubjects: Subject[][] = this.currentSubjects.slice();
        tempSubjects.removeAt(index);
        this.set('currentSubjects', tempSubjects);
    }

    @action
    select(this: SubjectPicker, tier: number, selected: Taxonomy) {
        // All new selected subjects are first added to `tempSubjects` before saving back to `this.currentSubjects`.
        // This is because Ember does not recognize an array model attribute as dirty
        // if we directly push objects to the array.
        const tempSubjects: Taxonomy[][] = [...this.currentSubjects];
        this.set('hasChanged', true);
        const column = this.columns[tier];

        // Bail out if the subject is already selected
        if (column.selection === selected) {
            return;
        }

        column.set('selection', selected);

        const totalColumns = this.columns.length;
        const nextTier = tier + 1;

        const currentSelection: Taxonomy[] = this.columns
            .slice(0, nextTier)
            .map(({ selection }) => selection!);

        // An existing tag has this prefix, and this is the lowest level of the taxonomy, so no need to fetch child
        // results
        if (nextTier === totalColumns || !tempSubjects.some(item => arrayStartsWith(item, currentSelection))) {
            let existingParent;

            for (let i = 1; i <= currentSelection.length; i++) {
                const sub = currentSelection.slice(0, i);
                existingParent = tempSubjects.find(item => arrayEquals(item, sub));

                // The parent exists, append the subject to it
                if (existingParent) {
                    existingParent.pushObjects(currentSelection.slice(i));
                    break;
                }
            }

            if (!existingParent) {
                tempSubjects.pushObject(currentSelection);
            }
            this.set('currentSubjects', tempSubjects);
        }

        // Bail out if we're at the last column.
        if (nextTier === totalColumns) {
            return;
        }

        for (let i = nextTier; i < totalColumns; i++) {
            this.columns.objectAt(i)!.set('subjects', []);
        }

        if (selected.childCount) {
            this.get('querySubjects').perform(selected.id, nextTier);
        }
    }

    @action
    discard(this: SubjectPicker) {
        this.analytics.track(
            'button',
            'click',
            `Collections - ${this.editMode ? 'Edit' : 'Submit'} - Discard Discipline Changes`,
        );

        this.resetColumnSelections();

        this.setProperties({
            currentSubjects: [...this.initialSubjects],
            hasChanged: false,
        });
    }
}
