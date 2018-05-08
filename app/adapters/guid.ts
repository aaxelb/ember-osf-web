import DS from 'ember-data';
import Guid from 'ember-osf-web/models/guid';
import OsfAdapter from './osf-adapter';

export default class GuidAdapter extends OsfAdapter<Guid> {
    buildQuery(snapshot: DS.Snapshot): object {
        return {
            ...(this._super(snapshot) || {}),
            resolve: false,
        };
    }
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'guid': GuidAdapter;
    }
}
