import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class GuidRoute extends Route.extend({
}) {
    store = service('store');

    async model(this: GuidRoute, { guid }: { guid: string }): any {
        const store = this.get('store');
        try {
            const guidModel = await store.findRecord('guid', guid);
            debugger;
            return {
                modelType: guidModel.constructor.modelName,
                resolved: store.findRecord(guidModel.constructor.modelName, guidModel.get('id')),
            };
        } catch {
            this.transitionTo('not-found');
        }
    }
}

declare module '@ember/routing/route' {
    interface Registry {
        'guid-route': GuidRoute;
    }
}
