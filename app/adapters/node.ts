import DS, { ModelRegistry } from 'ember-data';
import Node from 'ember-osf-web/models/node';
import OsfAdapter from './osf-adapter';

export default class NodeAdapter extends OsfAdapter<Node> {
    buildURL<K extends keyof ModelRegistry>(
        this: NodeAdapter,
        modelName?: K,
        id?: string | any[] | {} | null,
        snapshot?: DS.Snapshot<K> | any[] | null,
        requestType?: string,
        query?: {},
    ): string {
        if (requestType !== 'createRecord'
            || !snapshot
            || Array.isArray(snapshot)
            || !(snapshot.record instanceof Node)
        ) {
            return super.buildURL(modelName, id, snapshot, requestType, query);
        }

        // @ts-ignore: temporarily using a private API, should be obviated in EMB-227
        const parent: any = snapshot.record.belongsTo('parent').belongsToRelationship.members.list[0];

        if (parent) {
            return this.buildRelationshipURL(parent.createSnapshot(), 'children');
        }
        return super.buildURL(modelName, id, snapshot, requestType, query);
    }
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'node': NodeAdapter;
    }
}
