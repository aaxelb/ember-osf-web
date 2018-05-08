import Contributor from 'ember-osf-web/models/contributor';
import OsfAdapter from './osf-adapter';

export default class ContributorAdapter extends OsfAdapter<Contributor> {
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'contributor': ContributorAdapter;
    }
}
