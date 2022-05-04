import Modifier from 'ember-modifier';
import c3 from 'c3';


export default class ReportChartModifier extends Modifier {
    chart: any = null;

    didInstall() {
        console.log(`!!!charting ${this.args.named.propertyName}`);
        this.generateTimeseriesChart();
    }

    generateTimeseriesChart() {
        this.chart = c3.generate({
            bindto: this.element,
            data: {
                x: 'report_date',
                json: this.args.named.reports,
                keys: {
                    value: ['report_date', this.args.named.propertyName],
                },
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%Y-%m-%d',
                    },
                },
            },
        });
    }
}
