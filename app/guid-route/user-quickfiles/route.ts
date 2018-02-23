import { inject as service } from '@ember/service';
import Analytics from 'ember-osf-web/mixins/analytics';
import GuidSubroute from '../guid-subroute';

function preventDrop(e: DragEvent) {
    if ((e.target as HTMLDivElement).id === 'quickfiles-dropzone') {
        return;
    }

    e.preventDefault();
    e.dataTransfer.effectAllowed = 'none';
    e.dataTransfer.dropEffect = 'none';
}

export default class UserQuickfiles extends GuidSubroute.extend(Analytics, {
    actions: {
        didTransition(this: UserQuickfiles) {
            window.addEventListener('dragover', preventDrop);
            window.addEventListener('drop', preventDrop);
        },
    },
}) {
    currentUser = service('currentUser');

    model(this: UserQuickfiles) {
        return this.modelFor('guid-route').resolveTask;
    }
}
