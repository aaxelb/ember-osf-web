import Collection from 'ember-osf-web/models/citation';
import OsfAdapter from './osf-adapter';

export default class CollectionAdapter extends OsfAdapter<Collection> {
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'collection': CollectionAdapter;
    }
}
