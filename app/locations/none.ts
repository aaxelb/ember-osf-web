import NoneLocation from '@ember/routing/none-location';
import CleanUrlLocationMixin from 'ember-osf-web/locations/clean-url-mixin';

// Sadly the `none` location must be overriden, otherwise
// ember-test-helper's helpers will leave --segments left over in the URL
export default class CleanUrlNoneLocation extends NoneLocation.extend(CleanUrlLocationMixin) {
    path!: string;

    // Opt out of URL "cleaning" when in tests.
    // This will allow tests to go to a specific route (Skip resolve-guid) by including
    // the --segment, if desired.
    // Otherwise, routing will work as normal
    setURL(url: string) {
        return this.set('path', url);
    }
}
