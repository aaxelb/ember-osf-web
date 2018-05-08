import ReviewAction from 'ember-osf-web/models/review-action';
import OsfAdapter from './osf-adapter';

export default class ReviewActionAdapter extends OsfAdapter<ReviewAction> {
    pathForType(): string {
        return 'actions/reviews/';
    }
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'review-action': ReviewActionAdapter;
    }
}
