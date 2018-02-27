import Route from '@ember/routing/route';

/*
 * Base class for all routes nested under guid-route.
 * Enforces that the nested route will only be rendered for the correct types of guids.
 *
 * Not an ES5 class so it can be extended without screwing up Ember's _super()
 */
export default Route.extend({
    // Override allowedModels with a list of model names, e.g. ['user']
    allowedModels: [],

    beforeModel(this: GuidSubroute) {
        const { guid } = this.modelFor('guid-route');
        if (!this.get('allowedModels').includes(guid.get('referentType'))) {
            this.transitionTo('not-found', window.location.pathname.slice(1));
        }
    },
});
