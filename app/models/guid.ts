import DS from 'ember-data';
import OsfModel from './osf-model';

const { attr } = DS;

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for GUIDs
 * @class Guid
 */
export default class Guid extends OsfModel.extend({
    referentType: attr('string'),
    type: attr('string'),
}) {
    getReferent() {
        return this.get('store').findRecord(this.get('referentType'), this.get('id'));
    }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data' {
  interface ModelRegistry {
    'guid': Guid;
  }
}
