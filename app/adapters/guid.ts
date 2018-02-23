import OsfAdapter from './osf-adapter';

export default class Guid extends OsfAdapter.extend({
    urlForFindRecord(this: Guid) {
        const url = this._super(...arguments);
        return `${url}?resolve=false`;
    },
}) {
  // normal class body
}

// DO NOT DELETE: this is how TypeScript knows how to look up your adapters.
declare module 'ember-data' {
  interface AdapterRegistry {
    'guid': Guid;
  }
}
