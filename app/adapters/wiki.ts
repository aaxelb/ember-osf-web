import Wiki from 'ember-osf-web/models/wiki';
import OsfAdapter from './osf-adapter';

export default class WikiAdapter extends OsfAdapter<Wiki> {
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'wiki': WikiAdapter;
    }
}
