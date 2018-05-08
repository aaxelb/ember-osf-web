import { service } from '@ember-decorators/service';
import { warn } from '@ember/debug';
import DS from 'ember-data';
import config from 'ember-get-config';
import Base from 'ember-simple-auth/authenticators/base';
import Session from 'ember-simple-auth/services/session';

import CurrentUser from 'ember-osf-web/services/current-user';

const {
    OSF: {
        apiUrl,
        apiNamespace,
        apiVersion,
        devMode,
    },
} = config;

interface ApiRootResponse {
    meta: {
        version: string,
        current_user: { data: { id: string } } | null, // eslint-disable-line camelcase
    };
}

export default class OsfCookie extends Base {
    @service currentUser!: CurrentUser;
    @service session!: Session;
    @service store!: DS.Store;

    /**
     * @method authenticate
     * @return {Promise}
     */
    async authenticate(this: OsfCookie): Promise<object> {
        if (devMode) {
            // Don't need the result, so don't await.
            this._checkApiVersion();
        }

        const res: ApiRootResponse = await this.currentUser.authenticatedAJAX({
            url: `${apiUrl}/${apiNamespace}/`,
        });

        const userData = res.meta.current_user;
        if (!userData) {
            throw Error('Not logged in.');
        }

        const userId = userData.data.id;

        // Push the user into the store for later use
        this.get('store').pushPayload(userData);
        return { id: userId };
    }

    async restore(this: OsfCookie): Promise<any> {
        // Check for a valid auth cookie.
        // If it fails, the session will be invalidated.
        return this.authenticate();
    }

    async _checkApiVersion(this: OsfCookie) {
        const res: ApiRootResponse = await this.currentUser.authenticatedAJAX(
            {
                url: `${apiUrl}/${apiNamespace}/`,
                data: {
                    version: 'latest',
                },
            },
            false, // Don't add API version headers
        );

        warn(
            `Using an old version of the API! Current: ${res.meta.version}. Using: ${apiVersion}`,
            res.meta.version === apiVersion,
            { id: 'ember-osf-web.api-version-check' },
        );
    }
}
