import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DS from 'ember-data';

import Analytics from 'ember-osf-web/services/analytics';
import Brand from 'registries/services/brand';

import RegistrationProvider from 'ember-osf-web/models/registration-provider';

export default class BrandedRegistriesRoute extends Route {
    @service analytics!: Analytics;
    @service store!: DS.Store;
    @service brand!: Brand;

    model(params: { providerId: string }) {
        return this.store.findRecord('registration-provider', params.providerId, { include: 'brand' });
    }

    afterModel(model: RegistrationProvider) {
        this.brand.setBrand(model.brand);
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
