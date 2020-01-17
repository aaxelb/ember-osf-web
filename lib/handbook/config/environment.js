/* eslint-env node */

module.exports = function(environment) {
    const ENV = {
        modulePrefix: 'handbook',
        rootURL: '/',
        environment,
    };

    return ENV;
};
