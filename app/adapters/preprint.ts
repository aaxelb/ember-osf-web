import DS from 'ember-data';
import Preprint from 'ember-osf-web/models/preprint';
import PreprintSerializer from 'ember-osf-web/serializers/preprint';
import RSVP from 'rsvp';
import OsfAdapter from './osf-adapter';

export default class PreprintAdapter extends OsfAdapter<Preprint> {
    updateRecord(
        store: DS.Store,
        type: Preprint,
        snapshot: DS.Snapshot,
    ): RSVP.Promise<any> {
        const data: object = {};
        const modelName = 'preprint';
        const serializer: PreprintSerializer = store.serializerFor(modelName);

        serializer.serializeIntoHash(data, type, snapshot, { includeId: true });

        const { id } = snapshot;
        const url: string = this.buildURL(modelName, id, snapshot, 'updateRecord');

        return this.ajax(url, 'PATCH', { data });
    }
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'preprint': PreprintAdapter;
    }
}
