import Route from '@ember/routing/route';

export default class OsfComponentsRoute extends Route {
    model() {
        debugger;
        // @ts-ignore
        return this.store.findRecord('project', 'osf-components');
    }
}
