import Application from '@ember/application';
import config from 'ember-get-config';
import loadInitializers from 'ember-load-initializers';
import Resolver from './resolver';

const { modulePrefix } = config;

const App = Application.extend({
    modulePrefix,
    Resolver,

    engines: {
        collections: {
            dependencies: {
                services: [
                    'i18n',
                    'session',
                    'store',
                    'router',
                ],
            },
        },
        devGuide: {
            dependencies: {
                services: [
                    'router',
                ],
            },
        },
    },
});

loadInitializers(App, modulePrefix);

export default App;
