import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import { task } from 'ember-concurrency';

export default class GuidNodeForks extends Controller {
    @service toast;
    @service i18n;
    @service statusMessages;

    toDelete;
    deleteModal = false;
    newModal = false;
    page = 1;
    forks = [];
    hasPrev = false;
    hasNext = false;

    getForks = task(function* (this: GuidNodeForks) {
        const page = this.get('page');
        const node = yield this.get('model.taskInstance');
        const forks = yield node.queryHasMany('forks', { page });
        this.setProperties({
            forks,
            hasPrev: !!forks.links.prev,
            hasNext: !!forks.links.next,
        });
    });

    @action
    next(this: GuidNodeForks) {
        this.incrementProperty('page');
        this.get('getForks').perform();
    }

    @action
    previous(this: GuidNodeForks) {
        this.decrementProperty('page');
        this.get('getForks').perform();
    }

    @action
    openDeleteModal(this: GuidNodeForks, node) {
        node.get('children').then(children => {
            if (children.toArray().length) {
                const message = this.get('i18n').t('forks.delete_fork_failed');
                this.get('toast').error(message);
            } else {
                this.set('toDelete', node);
                this.set('deleteModal', true);
            }
        });
    }

    @action
    closeDeleteModal(this: GuidNodeForks) {
        this.set('toDelete', null);
        this.set('deleteModal', false);
    }

    @action
    newForkModalToggle() {
        this.toggleProperty('newModal');
    }

    @action
    newFork(this: GuidNodeForks) {
        const node = this.get('model.taskInstance.value');
        node.fork().then(() => {
            const message = this.get('i18n').t('forks.new_fork_info');
            const title = this.get('i18n').t('forks.new_fork_info_title');
            this.get('toast').info(message, title);
        });
    }

    @action
    delete(this: GuidNodeForks) {
        const node = this.get('toDelete');
        node.deleteRecord();
        node.save().then(() => {
            this.get('statusMessages').addStatusMessage({
                id: 'status.project_deleted',
                class: 'success',
                dismiss: true,
            });
            this.transitionToRoute('home');
        });
    }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'guid-node/forks': GuidNodeForks;
  }
}
