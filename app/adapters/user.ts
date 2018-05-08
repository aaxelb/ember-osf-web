import User from 'ember-osf-web/models/user';
import OsfAdapter from './osf-adapter';

export default class UserAdapter extends OsfAdapter<User> {}

declare module 'ember-data' {
    interface AdapterRegistry {
        user: UserAdapter;
    }
}
