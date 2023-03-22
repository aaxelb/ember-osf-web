import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

import { ChartSpec } from 'analytics-page/components/analytics-charts/component';

interface ChartWrapperArgs {
    // Required arguments
    nodeId: string;
    chartSpec: ChartSpec;
    chartEnabled: boolean;
    chartData: unknown;
    apiError: boolean;
}

export default class ChartWrapper extends Component<ChartWrapperArgs> {
    @service intl!: Intl;

    get overlayShown(): boolean {
        const { chartEnabled, chartData, apiError } = this.args;
        return Boolean(!chartEnabled || !chartData || apiError)
    }

    get c3ChartConfig(): unknown {
        return (
            this.overlayShown
            ? this.skeletonChartConfig
            : this.actualChartConfig
        );
    }

    get skeletonChartConfig(): unknown {
        const c3Config: any = {
            data: {
                labels: false,
            },
            keys: {
                value: 'result',
            },
            pie: {
                label: {
                    show: false,
                },
            },
            axis: {
                x: {
                    tick: {
                        format: () => '',
                    },
                },
                y: {
                    tick: {
                        format: () => '',
                    },
                },
            },
        };
        const { chartSpec } = this.args;
        if (chartSpec.fakeData) {
            c3Config.data.json = chartSpec.fakeData();
        }
        return c3Config;
    }

    get actualChartConfig(): unknown {
        const { chartSpec, chartData, nodeId } = this.args;
        const processedData = (
            chartSpec.processData
            ? chartSpec.processData(chartData, this.intl, nodeId)
            : chartData
        );
        return chartSpec.chartConfig(processedData, this.intl);
    }
}
