import { attr } from '@ember-decorators/data';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import DS from 'ember-data';
import OsfAdapter from 'ember-osf-web/adapters/osf-adapter';

const { Model } = DS;

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Common properties and behaviors shared by all OSF APIv2 models
 *
 * @class OsfModel
 * @public
 */
export default class OsfModel extends Model {
    @service store!: DS.Store;

    @attr() links: any;

    @alias('links.relationships') relationshipLinks: any;

    /*
     * Query a hasMany relationship with query params
     *
     * @method queryHasMany
     * @param {String} propertyName Name of a hasMany relationship on the model
     * @param {Object} queryParams A hash to be serialized into the query string of the request
     * @param {Object} [ajaxOptions] A hash of options to be passed to jQuery.ajax
     * @returns {TaskInstance} Running task instance, resolves to the records fetched
     */
    queryHasMany<M extends OsfModel>(
        this: M,
        propertyName: string,
        queryParams?: object,
        ajaxOptions?: object,
    ) {
        // @ts-ignore: `modelName` is a static property on the class
        const adapter = this.store.adapterFor(this.constructor.modelName);
        if (!(adapter instanceof OsfAdapter)) {
            throw Error(`Adapter for ${this.modelName} must be a subclass of OsfAdapter`);
        }
        return adapter.get('queryHasManyTask').perform(this, propertyName, queryParams, ajaxOptions);
    }
}
