import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Service from '@ember/service';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import Features from 'ember-feature-flags';
import config from 'ember-get-config';
import User from 'ember-osf-web/models/user';
import Session from 'ember-simple-auth/services/session';
import RSVP from 'rsvp';

const {
    OSF: {
        url: osfUrl,
        apiHeaders,
        apiUrl,
    },
} = config;

enum AuthRoute {
    Login = 'login',
    Logout = 'logout',
}

/**
 * @module ember-osf-web
 * @submodule services
 */

/**
 * Access information about the currently logged in user
 *
 * @class current-user
 * @extends Ember.Service
 */

export default class CurrentUserService extends Service {
    @service store!: DS.Store;
    @service session!: Session;
    @service features!: Features;

    waffleLoaded = false;

    /**
     * If logged in, return the ID of the current user, else return undefined.
     */
    @alias('session.data.authenticated.id') currentUserId: string | undefined;

    /**
     * Return an observable promise proxy for the currently logged in user. If no user is logged in, resolves to null.
     */
    @computed('currentUserId')
    get user(this: CurrentUserService): User | null {
        if (this.currentUserId) {
            // The authenticator should have pushed the user into the store
            return this.store.peekRecord('user', this.currentUserId);
        }
        return null;
    }

    /**
     * Fetch waffle flags for the current user and set the corresponding feature flags.
     */
    setWaffle = task(function *(this: CurrentUserService) {
        const { data } = yield this.authenticatedAJAX({
            url: `${apiUrl}/v2/_waffle/`,
        });

        // eslint-disable-next-line no-restricted-globals
        interface Feature { attributes: { name: string; active: boolean; }; }

        this.features.setup(
            data.reduce((acc: object, { attributes: { name, active } }: Feature) => ({ ...acc, [name]: active }), {}),
        );

        this.set('waffleLoaded', true);
    }).drop();

    constructor() {
        super();

        function performSetWaffle(this: CurrentUserService) {
            this.get('setWaffle').perform();
        }

        this.session.on('authenticationSucceeded', this, performSetWaffle);
        this.session.on('invalidationSucceeded', this, this.logout);
    }

    /**
     * Check whether the given waffle/feature flag is enabled.
     */
    async getWaffle(this: CurrentUserService, feature: string): Promise<boolean> {
        const setWaffleTask = this.get('setWaffle');
        if (setWaffleTask.isRunning) {
            await setWaffleTask.last;
        } else if (!this.waffleLoaded) {
            await setWaffleTask.perform();
        }

        return this.features.isEnabled(feature);
    }

    /**
     * Modify a given XMLHttpRequest to add the current user's authorization.
     */
    authorizeXHR(xhr: XMLHttpRequest, addApiHeaders: boolean = true): void {
        if (addApiHeaders) {
            Object.entries(apiHeaders).forEach(foo => {
                xhr.setRequestHeader(foo[0], foo[1]);
            });
        }
        xhr.withCredentials = true; // eslint-disable-line no-param-reassign
    }

    /**
     * Performs an AJAX request with any additional authorization config as needed
     * for the configured authorization type.
     */
    authenticatedAJAX(this: CurrentUserService, options: any, addApiHeaders: boolean = true): RSVP.Promise<any> {
        const opts = { ...options };
        if (addApiHeaders) {
            opts.headers = {
                ...apiHeaders,
                ...opts.headers,
            };
        }
        opts.xhrFields = {
            ...opts.xhrFields,
            withCredentials: true,
        };

        // Return RSVP.Promise so the callbacks are run within the current runloop
        return new RSVP.Promise((resolve, reject) => $.ajax(opts).then(resolve).catch(reject));
    }

    /**
     * Send the user to a login page, which will redirect to the given URL (or back to the current page)
     * when successfully logged in.
     * Returns a promise that never resolves.
     */
    async login(nextUrl?: string) {
        return this._authRedirect(AuthRoute.Login, nextUrl);
    }

    /**
     * Invalidate the current session and cookie, then redirect to the given URL (or back to the current page).
     * Returns a promise that never resolves.
     */
    async logout(this: CurrentUserService, nextUrl?: string) {
        if (this.session.isAuthenticated) {
            await this.session.invalidate();
        }
        return this._authRedirect(AuthRoute.Logout, nextUrl);
    }

    _authRedirect(authRoute: AuthRoute, nextUrl?: string) {
        const next = encodeURIComponent(nextUrl || window.location.href);
        window.location.href = `${osfUrl}${authRoute}/?next=${next}`;
        return new RSVP.Promise(() => { /* never resolve, just wait for the redirect */ });
    }
}

declare module '@ember/service' {
    interface Registry {
        'current-user': CurrentUserService;
    }
}
