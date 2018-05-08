import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import config from 'ember-get-config';
import I18N from 'ember-i18n/services/i18n';
import authRoute from 'ember-osf-web/mixins/auth-route';

const {
    i18n: {
        enabledLocales,
    },
} = config;

@authRoute
export default class ApplicationRoute extends Route.extend({
    /*
     * If this doesn't use `.extend()`, `ApplicationRoute.reopen(...)`
     * will affect all routes.
     *
     * Extend with an empty block to prevent `session.restore()` from being
     * called several times on every transition by this injected `beforeModel`:
     * https://github.com/simplabs/ember-simple-auth/blob/1.6.0/addon/initializers/setup-session-restoration.js#L8
     */
}) {
    @service i18n!: I18N;

    afterModel(this: ApplicationRoute) {
        const availableLocales: [string] = this.i18n.get('locales').toArray();
        let locale: string | undefined;

        // Works in Chrome and Firefox (editable in settings)
        if (navigator.languages && navigator.languages.length) {
            for (const lang of navigator.languages) {
                if (availableLocales.includes(lang)) {
                    locale = lang;
                    break;
                }
            }
            // Backup for Safari (uses system settings)
        } else if (navigator.language && availableLocales.includes(navigator.language)) {
            locale = navigator.language;
        }

        if (locale && enabledLocales.includes(locale)) {
            this.i18n.setProperties({ locale });
        }
    }
}
