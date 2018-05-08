import CommentReport from 'ember-osf-web/models/comment-report';
import OsfAdapter from './osf-adapter';

export default class CommentReportAdapter extends OsfAdapter<CommentReport> {
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'comment-report': CommentReportAdapter;
    }
}
