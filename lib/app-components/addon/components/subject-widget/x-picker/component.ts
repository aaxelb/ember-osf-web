import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import EmberObject, { setProperties } from '@ember/object';
import { task } from 'ember-concurrency';
import DS from 'ember-data';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import OsfModel, { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import Provider from 'ember-osf-web/models/provider';
import SubjectModel from 'ember-osf-web/models/subject';
import defaultTo from 'ember-osf-web/utils/default-to';

import styles from './styles';
import template from './template';

interface Column extends EmberObject {
    subjects: SubjectModel[];
    selection: SubjectModel | null;
}

@layout(template, styles)
export default class SubjectPicker extends Component.extend({
    querySubjects: task(function *(this: SubjectPicker, parent = 'null', tier = 0) {
        const column: Column = this.columns.objectAt(tier)!;

        const subjects: QueryHasManyResult<SubjectModel> = yield this.provider.queryHasMany('subjects', {
            filter: {
                parent,
            },
            page: {
                size: 150, // Law category has 117 (Jan 2018)
            },
        });

        column.setProperties({ subjects });
    }),
}) {
    // Required
    provider!: Provider;
    selectedSubjects!: SubjectModel[];
    @requiredAction add!: (subject: SubjectModel) => void;
    @requiredAction remove!: (subject: SubjectModel) => void;

    // Private
    columns: Column[] = Array
        .from({ length: 3 })
        .map(() => EmberObject.create({
            subjects: [],
            selection: null,
        }));

    didReceiveAttrs() {
        super.didReceiveAttrs();

        assert('<SubjectPicker> requires @provider', Boolean(this.provider));

        this.querySubjects.perform();
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
    deselect(this: SubjectPicker, subject: SubjectModel) {
        this.resetColumnSelections();
        this.remove(subject);
    }

    @action
    select(this: SubjectPicker, tier: number, subject: SubjectModel) {
        const column = this.columns[tier];

        // Bail out if the subject is already selected
        if (column.selection === subject) {
            return;
        }

        column.set('selection', subject);

        const totalColumns = this.columns.length;
        const nextTier = tier + 1;

        const currentSelection: SubjectModel[] = this.columns
            .slice(0, nextTier)
            .mapBy('selection');

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
}
