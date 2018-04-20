import Institution from 'ember-osf-web/models/institution';
import OsfAdapter from './osf-adapter';

export default class InstitutionAdapter extends OsfAdapter<Institution> {}

declare module 'ember-data' {
    interface AdapterRegistry {
        'institution': InstitutionAdapter;
    }
}
