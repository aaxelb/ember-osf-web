import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import RouterService from '@ember/routing/router-service';
import { task } from 'ember-concurrency';
import config from 'ember-get-config';
import moment from 'moment';

import Contributor from 'ember-osf-web/models/contributor';
import Institution from 'ember-osf-web/models/institution';
import Registration from 'ember-osf-web/models/registration';
import GuidRoute, { GuidRouteModel } from 'ember-osf-web/resolve-guid/guid-route';
import Analytics from 'ember-osf-web/services/analytics';
import MetaTags, { HeadTagDef } from 'ember-osf-web/services/meta-tags';
import Ready from 'ember-osf-web/services/ready';
import OsfData, { SparseHasManyResult } from 'ember-osf-web/services/osf-data';
import pathJoin from 'ember-osf-web/utils/path-join';
import tuple from 'ember-osf-web/utils/tuple';

export default class Overview extends GuidRoute {
    @service analytics!: Analytics;
    @service router!: RouterService;
    @service metaTags!: MetaTags;
    @service ready!: Ready;
    @service osfData!: OsfData;

    headTags?: HeadTagDef[];

    setHeadTags = task(function *(this: Overview, model: any) {
        const blocker = this.ready.getBlocker();

        const registration: Registration = yield model.taskInstance;

        if (registration) {
            const contribFields = {
                contributor: tuple('users', 'index'),
                user: tuple('fullName'),
            };

            const contributors: SparseHasManyResult<Contributor, typeof contribFields> =
                yield this.osfData.sparseHasMany(registration, 'contributors', contribFields);

            const institutionFields = {
                institution: tuple('name'),
            };
            const institutions: SparseHasManyResult<Institution, typeof institutionFields> =
                yield this.osfData.sparseHasMany(registration, 'affiliatedInstitutions', institutionFields);
            const license = yield registration.license;

            const image = '/engines-dist/registries/assets/img/osf-sharing.png';

            const metaTagsData = {
                title: registration.title,
                description: registration.description,
                publishedDate: moment(registration.dateRegistered).format('YYYY-MM-DD'),
                modifiedDate: moment(registration.dateModified).format('YYYY-MM-DD'),
                identifier: registration.id,
                url: pathJoin(config.OSF.url, registration.id),
                image,
                keywords: registration.tags,
                siteName: 'OSF',
                license: license && license.name,
                author: contributors.data.map(contrib => contrib.users.fullName),
                institution: institutions.data.map(institution => institution.name),
            };

            this.set('headTags', this.metaTags.getHeadTags(metaTagsData));
            this.metaTags.updateHeadTags();
        }

        blocker.done();
    });

    modelName(): 'registration' {
        return 'registration';
    }

    include() {
        return ['registration_schema', 'contributors', 'identifiers', 'root'];
    }

    adapterOptions() {
        return {
            query: {
                related_counts: 'forks,comments,linked_nodes,linked_registrations,children',
            },
        };
    }

    afterModel(this: Overview, model: GuidRouteModel<Registration>) {
        // Do not return model.taskInstance
        // as it would block rendering until model.taskInstance resolves and `setHeadTags` task terminates.
        this.get('setHeadTags').perform(model);
    }

    @action
    async didTransition() {
        const { taskInstance } = this.controller.model as GuidRouteModel<Registration>;
        await taskInstance;
        const registration = taskInstance.value;
        this.analytics.trackPage(registration ? registration.public : undefined, 'registrations');
    }

    @action
    error() {
        this.replaceWith('page-not-found', this.router.currentURL.slice(1));
    }
}
