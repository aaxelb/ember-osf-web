import NodeLink from 'ember-osf-web/models/node-link';
import OsfAdapter from './osf-adapter';

export default class NodeLinkAdapter extends OsfAdapter<NodeLink> {}

declare module 'ember-data' {
    interface AdapterRegistry {
        'node-link': NodeLinkAdapter;
    }
}
