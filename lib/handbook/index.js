/* eslint-env node */

const EngineAddon = require('ember-engines/lib/engine-addon');

module.exports = EngineAddon.extend({
    name: 'handbook',

    'ember-cli-addon-docs': {
        docsApp: 'handbook',
        docsAppPath: 'lib/handbook/addon/',
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
