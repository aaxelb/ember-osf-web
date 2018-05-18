/* eslint-env node */

const EngineAddon = require('ember-engines/lib/engine-addon');

module.exports = EngineAddon.extend({
    name: 'dev-guide',

    'ember-cli-addon-docs': {
        docsApp: 'dev-guide',
        docsAppPath: 'lib/dev-guide/addon/',
        documentedAddons: [
            'osf-components',
        ],
    },

    lazyLoading: {
        enabled: true,
    },

    isDevelopingAddon() {
        return true;
    },
});
