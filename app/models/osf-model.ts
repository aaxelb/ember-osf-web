import { attr } from '@ember-decorators/data';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import { task } from 'ember-concurrency';
import DS, { ModelRegistry } from 'ember-data';
import CurrentUser from 'ember-osf-web/services/current-user';

const { Model } = DS;

/**
 * @module ember-osf-web
 * @submodule models
 */

interface QueryHasManyResult extends Array<any> {
    meta?: any;
    links?: any;
}

/**
 * Common properties and behaviors shared by all OSF APIv2 models
 *
 * @class OsfModel
 * @public
 */
export default class OsfModel extends Model {
    @service store!: DS.Store;
    @service currentUser!: CurrentUser;

    @attr() links: any;

    @alias('links.relationships') relationshipLinks: any;

    queryHasManyTask = task(function *(
        this: OsfModel,
        propertyName: string,
        queryParams: object | undefined,
        ajaxOptions: object | undefined,
    ) {
        const reference = this.hasMany(propertyName as any);

        // HACK: ember-data discards/ignores the link if an object on the belongsTo side
        // came first. In that case, grab the link where we expect it from OSF's API
        const url: string = reference.link() || this.links.relationships.get(propertyName).links.related.href;
        if (!url) {
            throw new Error(`Could not find a link for '${propertyName}' relationship`);
        }

        const options: object = {
            url,
            data: queryParams,
            ...ajaxOptions,
        };

        const payload = yield this.currentUser.authenticatedAJAX(options);

        this.store.pushPayload(payload);
        const records: QueryHasManyResult = payload.data.map(
            (datum: { type: keyof ModelRegistry, id: string }) => this.store.peekRecord(datum.type, datum.id),
        );
        records.meta = payload.meta;
        records.links = payload.links;
        return records;
    });

    /*
     * Query a hasMany relationship with query params
     *
     * @method queryHasMany
     * @param {String} propertyName Name of a hasMany relationship on the model
     * @param {Object} queryParams A hash to be serialized into the query string of the request
     * @param {Object} [ajaxOptions] A hash of options to be passed to jQuery.ajax
     * @returns {TaskInstance} Running task instance, resolves to the records fetched
     */
    queryHasMany(
        this: OsfModel,
        propertyName: string,
        queryParams?: object,
        ajaxOptions?: object,
    ) {
        return this.get('queryHasManyTask').perform(propertyName, queryParams, ajaxOptions);
    }
}
