import PreprintProvider from 'ember-osf-web/models/preprint-provider';
import OsfAdapter from './osf-adapter';

export default class PreprintProviderAdapter extends OsfAdapter<PreprintProvider> {}

declare module 'ember-data' {
    interface AdapterRegistry {
        'preprint-provider': PreprintProviderAdapter;
    }
}
