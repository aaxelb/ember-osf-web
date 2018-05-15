/* eslint-env node */

const EngineAddon = require('ember-engines/lib/engine-addon');

module.exports = EngineAddon.extend({
    name: 'dev-guide',

    'ember-cli-addon-docs': {
        docsAppPath: 'lib/dev-guide/addon/',
        documentedAddons: [
            'pure-components',
        ],
    },

    lazyLoading: {
        enabled: false,
    },

    isDevelopingAddon() {
        return true;
    },
});
