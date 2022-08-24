import BaseAdapter from 'ember-metrics/metrics-adapters/base';

export default class OsfMetrics extends BaseAdapter {
  toStringExtension() {
    return 'osf-metrics';
  }

  init() {}

  identify() {}

  trackEvent() {}

  trackPage() {}

  alias() {}

  willDestroy() {}
}
