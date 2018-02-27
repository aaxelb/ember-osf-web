import { inject as service } from '@ember/service';
import Analytics from 'ember-osf-web/mixins/analytics';
import GuidSubroute from '../guid-subroute';

export default class GuidRouteFileVersions extends GuidSubroute.extend(Analytics, {
}) {
    allowedModels = ['file'];

    model(this: GuidRouteFileVersions) {
        return this.modelFor('guid-route');
    }
}
