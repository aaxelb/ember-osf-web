import AutoLocation from '@ember/routing/auto-location';
import CleanUrlLocationMixin from 'ember-osf-web/locations/clean-url-mixin';

// Sadly the `auto` location must be overriden, otherwise
// ember-cli's server doesn't allow visiting specific URLs
export default class CleanUrlAutoLocation extends AutoLocation.extend(CleanUrlLocationMixin) {
}
