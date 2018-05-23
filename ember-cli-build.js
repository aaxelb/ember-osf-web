/* eslint-env node */

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const Funnel = require('broccoli-funnel');

const { EMBER_ENV } = process.env;
const useCdn = EMBER_ENV === 'production';

function postProcess(content) {
    return content.trim().replace(/^\s{20}/mg, '');
}

module.exports = function(defaults) {
    const config = defaults.project.config(EMBER_ENV);

    const app = new EmberApp(defaults, {
        ace: {
            modes: ['handlebars'],
        },
        addons: {
            blacklist: [
                'ember-cli-addon-docs',
            ],
        },
        'ember-bootstrap': {
            bootstrapVersion: 3,
            importBootstrapFont: true,
            importBootstrapCSS: false,
        },
        'ember-cli-password-strength': {
            bundleZxcvbn: !useCdn,
        },
        fingerprint: {
            exclude: [
                'zxcvbn.js',
            ],
        },
        sassOptions: {
            includePaths: [
                'node_modules/@centerforopenscience/osf-style/sass',
            ],
        },
        cssModules: {
            headerModules: [
                'ember-osf-web/styles/headers',
            ],
        },
        babel: {
            sourceMaps: 'inline',
        },
        sourcemaps: {
            enabled: true,
            extensions: ['js'],
        },
        inlineContent: {
            raven: {
                enabled: useCdn,
                content: `
                    <script src="https://cdn.ravenjs.com/3.22.1/ember/raven.min.js"></script>
                    <script>
                        var encodedConfig = document.head.querySelector("meta[name$='/config/environment']").content;
                        var config = JSON.parse(unescape(encodedConfig));
                        if (config.sentryDSN) {
                            Raven.config(config.sentryDSN, config.sentryOptions || {}).install();
                        }
                    </script>
                `,
                postProcess,
            },
            zxcvbn: {
                enabled: useCdn,
                /* eslint-disable max-len */
                content: `
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/zxcvbn/4.4.2/zxcvbn.js"
                        integrity="sha256-Znf8FdJF85f1LV0JmPOob5qudSrns8pLPZ6qkd/+F0o=
                                   sha384-jhGcGHNZytnBnH1wbEM3KxJYyRDy9Q0QLKjE65xk+aMqXFCdvFuYIjzMWAAWBBtR
                                   sha512-TZlMGFY9xKj38t/5m2FzJ+RM/aD5alMHDe26p0mYUMoCF5G7ibfHUQILq0qQPV3wlsnCwL+TPRNK4vIWGLOkUQ=="
                        crossorigin="anonymous">
                    </script>
                `,
                postProcess,
                /* eslint-enable max-len */
            },
        },
        'ember-cli-babel': {
            includePolyfill: true,
        },

        // Options for ember-code-snippets options, used in the dev handbook.
        // Included here because ember-code-snippets always looks to the host app.
        // TODO: figure out a way to put these in the engine's index.js
        includeHighlightJS: false,
        includeFileExtensionInSnippetNames: false,
        snippetSearchPaths: ['lib/dev-guide/addon'],
        snippetRegexes: {
            begin: /{{#(?:docs-snippet|demo.example|demo.live-example)\sname=(?:"|')(\S+)(?:"|')/,
            end: /{{\/(?:docs-snippet|demo.example|demo.live-example)}}/,
        },
    });

    app.import('node_modules/dropzone/dist/dropzone.css');
    app.import('node_modules/dropzone/dist/dropzone.js');

    app.import({
        test: 'node_modules/jquery-mockjax/dist/jquery.mockjax.js',
    });
    app.import({
        test: 'vendor/ember/ember-template-compiler.js',
    });

    if (config.engines.devGuide.enabled) {
        app.import('vendor/highlight.pack.js', {
            using: [{ transformation: 'amd', as: 'highlight.js' }],
        });
    }

    const assets = [
        new Funnel('node_modules/@centerforopenscience/osf-style/img', {
            srcDir: '/',
            destDir: 'img',
        }),
    ];

    return app.toTree(assets);
};
