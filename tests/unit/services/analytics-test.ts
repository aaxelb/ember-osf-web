import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Service | analytics', hooks => {
    setupTest(hooks);
    setupMirage(hooks);

    test('trackPage', async function(assert) {
        const service = this.owner.lookup('service:analytics');
        assert.ok(server.schema.countedUsages.all().length === 0);
        await service.trackPage();
        assert.ok(server.schema.countedUsages.all().length === 1);
        const savedCountedUsage = server.schema.countedUsages.first();
        assert.ok(savedCountedUsage.pageviewInfo.page_url === document.URL);
    });
});
