import { service } from '@ember-decorators/service';
import { underscore } from '@ember/string';
import DS, { ModelRegistry } from 'ember-data';
import config from 'ember-get-config';
import { pluralize } from 'ember-inflector';
import Session from 'ember-simple-auth/services/session';

import OsfModel from 'ember-osf-web/models/osf-model';
import CurrentUser from 'ember-osf-web/services/current-user';

const { JSONAPIAdapter } = DS;
const {
    OSF: {
        apiHeaders,
        apiNamespace,
        apiUrl,
    },
} = config;

interface AdapterOptions {
    query?: string;
    url?: string;
}

export enum RequestType {
    DELETE = 'DELETE',
    GET = 'GET',
    PATCH = 'PATCH',
    POST = 'POST',
    PUT = 'PUT',
}

/**
 * @module ember-osf-web
 * @submodule adapters
 */
/**
 * Base adapter class for all OSF APIv2 endpoints
 *
 * @class OsfAdapter
 * @extends DS.JSONAPIAdapter
 * @uses GenericDataAdapterMixin
 */
export default class OsfAdapter<M extends OsfModel> extends JSONAPIAdapter {
    @service currentUser!: CurrentUser;
    @service session!: Session;

    host: string = apiUrl;
    namespace: string = apiNamespace;
    headers = apiHeaders;

    /**
     * Overrides buildQuery method - Allows users to embed resources with findRecord
     * OSF APIv2 does not have "include" functionality, instead we use 'embed'.
     * Usage: findRecord(type, id, {include: 'resource'}) or findRecord(type, id, {include: ['resource1', resource2]})
     * Swaps included resources with embedded resources
     *
     * @method buildQuery
     */
    buildQuery(this: OsfAdapter<M>, snapshot: DS.Snapshot): object {
        const { query: adapterOptionsQuery = {} } = (snapshot.adapterOptions || {}) as AdapterOptions;

        const query: { include?: any, embed?: any } = {
            ...super.buildQuery(snapshot),
            ...adapterOptionsQuery,
        };

        return {
            ...query,
            embed: query.include,
            include: undefined,
        };
    }

    buildURL<K extends keyof ModelRegistry>(
        modelName?: K,
        id?: string | any[] | {} | null,
        snapshot?: DS.Snapshot<K> | any[] | null,
        requestType?: string,
        query?: {},
    ): string {
        let url = super.buildURL(modelName, id, snapshot, requestType, query);
        if (!snapshot || Array.isArray(snapshot) || !(snapshot.record instanceof OsfModel)) {
            return url;
        }
        const { record, adapterOptions } = snapshot;
        const opts: AdapterOptions = adapterOptions || {};

        if (record.links && requestType === 'deleteRecord') {
            if (record.links.delete) {
                url = record.links.delete;
            } else if (record.links.self) {
                url = record.links.self;
            }
        } else if (record.links && (requestType === 'updateRecord' || requestType === 'findRecord')) {
            if (record.links.self) {
                url = record.links.self;
            }
        } else if (opts.url) {
            url = opts.url; // eslint-disable-line prefer-destructuring
        }

        // Fix issue where CORS request failed on 301s: Ember does not seem to append trailing
        // slash to URLs for single documents, but DRF redirects to force a trailing slash
        if (url.lastIndexOf('/') !== url.length - 1) {
            url += '/';
        }
        return url;
    }

    handleResponse(
        status: number,
        headers: object,
        payload: object,
        requestData: object,
    ): object {
        if (status === 401 && this.session.isAuthenticated) {
            this.session.invalidate();
        }
        return super.handleResponse(status, headers, payload, requestData);
    }

    ajaxOptions(this: OsfAdapter<M>, url: string, type: RequestType, options?: { isBulk?: boolean }): object {
        const hash = super.ajaxOptions(url, type, options) as any;

        hash.xhrFields = {
            withCredentials: true,
        };

        if (options && options.isBulk) {
            hash.contentType = 'application/vnd.api+json; ext=bulk';
        }

        return hash;
    }

    buildRelationshipURL(snapshot: DS.Snapshot, relationship: string): string {
        const links = !!relationship && snapshot.record.get(`relationshipLinks.${underscore(relationship)}.links`);

        if (links && (links.self || links.related)) {
            return links.self ? links.self.href : links.related.href;
        }

        return '';
    }

    pathForType(modelName: string): string {
        const underscored: string = underscore(modelName);
        return pluralize(underscored);
    }
}
