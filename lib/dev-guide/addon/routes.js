import buildRoutes from 'ember-engines/routes';
import { docsRoute } from 'ember-cli-addon-docs/router';

export default buildRoutes(function() {
    docsRoute(this, function() {
        this.route('intro');
        this.route('not-found', { path: '/*path' });
    });
});
