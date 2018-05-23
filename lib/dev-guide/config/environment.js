/* eslint-env node */

module.exports = function(environment) {
    const ENV = {
        modulePrefix: 'dev-guide',
        rootURL: '/',
        environment,

        'ember-cli-addon-docs': {
            docsApp: 'dev-guide',
            docsAppPath: 'lib/dev-guide/addon/',
            assetsUrlPath: '/engines-dist/dev-guide/',
            editDocPath: '/edit/develop/lib/dev-guide/addon/',
            editSourcePath: '/edit/develop/something/',
            documentedAddons: [
                'osf-components',
            ],
        },
    };

    if (environment === 'production') {
        // Allow ember-cli-addon-docs to update the rootURL in compiled assets
        ENV.rootURL = 'ADDON_DOCS_ROOT_URL';
    }

    return ENV;
};
