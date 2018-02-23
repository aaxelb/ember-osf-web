import Route from '@ember/routing/route';

// Base class for all routes nested under guid-route
export default Route.extend({
    allowedModels: [],

    beforeModel(this: GuidSubroute) {
        const { guid } = this.modelFor('guid-route');
        if (!this.get('allowedModels').includes(guid.get('referentType'))) {
            this.transitionTo('not-found');
        }
    },
});
