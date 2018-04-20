import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import I18N from 'ember-i18n/services/i18n';

import authRoute from 'ember-osf-web/mixins/auth-route';

@authRoute
export default class Application extends Route {
    @service i18n!: I18N;

    afterModel(this: Application) {
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

        if (locale) {
            this.i18n.setProperties({ locale });
        }
    }
}
