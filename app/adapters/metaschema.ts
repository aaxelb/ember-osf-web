import Metaschema from 'ember-osf-web/models/metaschema';
import OsfAdapter from './osf-adapter';

export default class MetaschemaAdapter extends OsfAdapter<Metaschema> {}

declare module 'ember-data' {
    interface AdapterRegistry {
        'metaschema': MetaschemaAdapter;
    }
}
