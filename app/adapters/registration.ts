import Registration from 'ember-osf-web/models/registration';
import OsfAdapter from './osf-adapter';

export default class RegistrationAdapter extends OsfAdapter<Registration> {}

declare module 'ember-data' {
    interface AdapterRegistry {
        'registration': RegistrationAdapter;
    }
}
