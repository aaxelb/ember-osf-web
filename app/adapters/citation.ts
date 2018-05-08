import Citation from 'ember-osf-web/models/citation';
import OsfAdapter from './osf-adapter';

export default class CitationAdapter extends OsfAdapter<Citation> {
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'citation': CitationAdapter;
    }
}
