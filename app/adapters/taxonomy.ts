import Taxonomy from 'ember-osf-web/models/taxonomy';
import OsfAdapter from './osf-adapter';

export default class TaxonomyAdapter extends OsfAdapter<Taxonomy> {}

declare module 'ember-data' {
    interface AdapterRegistry {
        'taxonomy': TaxonomyAdapter;
    }
}
