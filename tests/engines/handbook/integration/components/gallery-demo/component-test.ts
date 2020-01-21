import { render } from '@ember/test-helpers';
import { setupEngineRenderingTest } from 'ember-osf-web/tests/helpers/engines';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | gallery-demo', hooks => {
    setupEngineRenderingTest(hooks, 'handbook');

    test('it renders', async function(assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        await render(hbs`{{gallery-demo}}`);

        assert.dom(this.element).hasText('');

        // Template block usage:
        await render(hbs`
            {{#gallery-demo}}
                template block text
            {{/gallery-demo}}
        `);

        assert.dom(this.element).hasText('template block text');
    });
});
