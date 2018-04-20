import { service } from '@ember-decorators/service';
import DS, { ModelRegistry } from 'ember-data';
import File from 'ember-osf-web/models/file';
import FileManager from 'ember-osf-web/services/file-manager';
import OsfAdapter, { RequestType } from './osf-adapter';

interface Options {
    url: string;
}

export default class FileAdapter extends OsfAdapter<File> {
    @service fileManager!: FileManager;

    buildURL<K extends keyof ModelRegistry>(
        modelName?: K,
        id?: string | any[] | {} | null,
        snapshot?: DS.Snapshot<K> | any[] | null,
        requestType?: string,
        query?: {},
    ): string {
        const url: string = super.buildURL(modelName, id, snapshot, requestType, query);

        // Water Bulter API does not like trailing slashes.
        return requestType === 'deleteRecord' ? url.replace(/\/$/, '') : url;
    }

    /**
     * This is a hack to resolve a server-side race condition.
     * After creating/modifying/deleting a file through Waterbutler, it can take
     * a fraction of a second for the API's cache to properly update, and
     * trying to reload the file model in that time can return stale data.
     *
     * This adapter mixin appends a nonce to requests that are likely to run into
     * that race condition, forcing a cache miss.
     */
    ajaxOptions(url: string, type: RequestType, options?: { isBulk?: boolean }): object {
        const hash = super.ajaxOptions(url, type, options) as Options;
        const superUrl = hash.url;

        return {
            ...hash,
            url: this.fileManager.isReloadingUrl(superUrl) ?
                // The name of the query parameter doesn't matter, just the nonce
                `${superUrl}${superUrl.includes('?') ? '&' : '?'}cachebypass=${Date.now()}` :
                superUrl,

        };
    }
}

declare module 'ember-data' {
    interface AdapterRegistry {
        file: FileAdapter;
    }
}
