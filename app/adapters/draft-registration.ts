import DraftRegistration from 'ember-osf-web/models/draft-registration';
import OsfAdapter from './osf-adapter';

export default class DraftRegistrationAdapter extends OsfAdapter<DraftRegistration> {
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'draft-registration': DraftRegistrationAdapter;
    }
}
