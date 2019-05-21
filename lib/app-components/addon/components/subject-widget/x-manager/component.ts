import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { task } from 'ember-concurrency';
import DS from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';
import OsfModel from 'ember-osf-web/models/osf-model';
import SubjectModel from 'ember-osf-web/models/subject';

import styles from './styles';
import template from './template';

interface ModelWithSubjects extends OsfModel {
    subjects: DS.PromiseManyArray<SubjectModel>;
}

@layout(template, styles)
@tagName('')
export default class SubjectManager extends Component.extend({
    initializeSubjects: task(function *(this: SubjectManager) {
        const subjects: SubjectModel[] = yield this.model.loadAll('subjects');
        this.setProperties({
            subjects,
            initialSubjects: [...subjects],
        });
    }).on('didReceiveAttrs').restartable(),

    save: task(function *(this: SubjectManager) {
        this.model.set('subjects', this.subjects);

        yield this.model.save();

        this.setProperties({
            initialSubjects: [...this.subjects],
            hasChanged: false,
        });
    }).drop(),
}) {
    // Required
    model!: ModelWithSubjects;

    // Private
    initialSubjects?: SubjectModel[];
    subjects: SubjectModel[] = [];
    hasChanged: boolean = false; // TODO sort subjects, hasChanged -> CP comparing them

    @alias('save.isRunning')
    isSaving!: boolean;

    @action
    add(subject: SubjectModel) {
        assert('Cannot add while saving', !this.isSaving);
        // TODO dedup?
        this.subjects.pushObject(subject);
        this.set('hasChanged', true);
    }

    @action
    remove(subject: SubjectModel) {
        assert('Cannot remove while saving', !this.isSaving);
        this.subjects.removeObject(subject);
        this.set('hasChanged', true);
    }

    @action
    discardChanges() {
        assert('Cannot discard changes while saving', !this.isSaving);
        this.setProperties({
            subjects: this.initialSubjects,
            hasChanged: false,
        });
    }
}
