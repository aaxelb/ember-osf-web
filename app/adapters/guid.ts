import OsfAdapter from './osf-adapter';

export default class Guid extends OsfAdapter.extend({
  // anything which *must* be merged on the prototype
}) {
  // normal class body
}

// DO NOT DELETE: this is how TypeScript knows how to look up your adapters.
declare module 'ember-data' {
  interface AdapterRegistry {
    'guid': Guid;
  }
}
