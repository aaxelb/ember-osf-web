import Log from 'ember-osf-web/models/log';
import OsfAdapter from './osf-adapter';

export default class LogAdapter extends OsfAdapter<Log> {}

declare module 'ember-data' {
    interface AdapterRegistry {
        'log': LogAdapter;
    }
}
