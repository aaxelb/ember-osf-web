/* eslint-env node */

'use strict';

module.exports = {
    name: 'dev-handbook',

    isDevelopingAddon() {
        return true;
    },

    setupPreprocessorRegistry(type, registry) {
        // ember-cli-markdown-templates doesn't work in addons, but all we need
        // is to register the markdown template compiler
        const MarkdownTemplateCompiler = require('ember-cli-markdown-templates/lib/markdown-template-compiler');

        registry.add('template', new MarkdownTemplateCompiler({
            // options go here
        }));
    },
};
