import Comment from 'ember-osf-web/models/comment';
import OsfAdapter from './osf-adapter';

export default class CommentAdapter extends OsfAdapter<Comment> {
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'comment': CommentAdapter;
    }
}
