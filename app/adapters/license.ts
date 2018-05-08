import License from 'ember-osf-web/models/license';
import OsfAdapter from './osf-adapter';

export default class LicenseAdapter extends OsfAdapter<License> {}

declare module 'ember-data' {
    interface AdapterRegistry {
        'license': LicenseAdapter;
    }
}
