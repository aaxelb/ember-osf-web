import EmberRouter from '@ember/routing/router';
import { scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';

const Router = EmberRouter.extend({
    metrics: service('metrics'),

    location: config.locationType,
    rootURL: config.rootURL,

    didTransition() {
        this._super(...arguments);
        this._trackPage();
    },

    _trackPage() {
        scheduleOnce('afterRender', this, () => {
            const page = this.get('url');
            const title = this.getWithDefault('currentRouteName', 'unknown');

            this.get('metrics').trackPage({ page, title });
        });
    },
});

/* eslint-disable array-callback-return */

Router.map(function() {
    this.route('dashboard', { path: '/' });
    this.route('quickfiles', { path: '/quickfiles' });
    this.route('guid-route', { path: '/:guid/' }, function() {
        this.route('user-quickfiles', { path: '/quickfiles/' });
    });
    this.route('not-found', { path: '*path' });
});

/* eslint-enable array-callback-return */

export default Router;
