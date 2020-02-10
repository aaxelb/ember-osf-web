import RouterDSL from '@ember/routing/-private/router-dsl';

export default function handbookRoutes(this: RouterDSL) {
    this.route('docs', function() {
        this.route('intro');
        this.route('assumptions');
        this.route('contributing');

        // Dev
        this.route('quickstart');
        this.route('how-to');
        this.route('git');
        this.route('dev-env');
        this.route('conventions');
        this.route('testing');
        this.route('analytics');
        this.route('community');
        this.route('resources');
        this.route('troubleshooting');

        // Style guide
        this.route('visual-style');
        this.route('written-style');
    });

    this.route('gallery', function() {
        this.route('components', function() {
            this.route('ancestry-display');
            this.route('bs-alert');
            this.route('contributor-list');
            this.route('copyable-text');
            this.route('delete-button');
            this.route('editable-field');
            this.route('files-widget');
            this.route('form-controls');
            this.route('institutions-widget');
            this.route('loading-indicator');
            this.route('new-project-modal');
            this.route('new-project-navigation-modal');
            this.route('osf-button');
            this.route('osf-dialog');
            this.route('osf-layout');
            this.route('osf-link');
            this.route('panel');
            this.route('osf-placeholder');
            this.route('schema-chunk');
            this.route('subject-widget');
            this.route('schema-block-group-renderer');
            this.route('tags-widget');
            this.route('validated-model-form');
        });

        this.route('helpers', function() {
            this.route('has-validation-error');
        });

        this.route('validators', function() {
            this.route('validate-list');
        });
    });
}