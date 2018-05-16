/* eslint-env node */

module.exports = function(environment) {
    const ENV = {
        modulePrefix: 'dev-guide',
        rootURL: 'badurl',
        environment,
    };

    return ENV;
};
