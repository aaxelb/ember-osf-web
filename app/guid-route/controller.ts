import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default class GuidController extends Controller {
    componentViewName = computed('model.modelType', function(this: GuidController) {
        return `guid-root/${this.get('model.modelType')}`;
    });
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'guid': GuidController;
  }
}
