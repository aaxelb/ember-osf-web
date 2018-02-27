import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default class GuidRoute extends Route.extend({
}) {
    store = service('store');

    resolveModel = task(function* (guid) {
        return yield guid.resolve();
    });

    async model(this: GuidRoute, params: { guid: string }) {
        const store = this.get('store');
        try {
            // Wait until the guid's referent type is known
            const guid = await store.findRecord('guid', params.guid);
            return {
                guid,
                taskInstance: this.get('resolveModel').perform(guid),
            };
        } catch {
            this.transitionTo('not-found', window.location.pathname.slice(1));
        }
    }
}
