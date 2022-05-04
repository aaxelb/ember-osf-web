import Modifier from 'ember-modifier';
import c3 from 'c3';


interface Report {
    report_date: string;
    [k: string]: string | number | undefined;
}


interface Args {
    positional: [];
    named: {
        reports: Report[];
        dataProperty: string;
        keyProperty?: string;
    };
}


export default class ReportChartModifier extends Modifier<Args> {
    didReceiveArguments() {
        this.generateTimeseriesChart();
    }

    getKeyedColumns() {
        const { reports, dataProperty, keyProperty } = this.args.named;
        const columnKeys = new Set<string>();
        const rowsByDate: any = {};
        reports.forEach(report => {
            const { report_date } = report;
            const row = rowsByDate[report_date] || { report_date };
            if (keyProperty) {
                const columnKey = report[keyProperty];
                if (columnKey) {
                    columnKeys.add(columnKey as string);
                    row[columnKey] = report[dataProperty];
                }
            }
            rowsByDate[report.report_date] = row;
        });
        return {
            objectRows: Object.values(rowsByDate),
            columnKeys: [...columnKeys],
        };
    }

    generateTimeseriesChart() {
        const { objectRows, columnKeys } = this.getKeyedColumns();

        c3.generate({
            bindto: this.element,
            data: {
                type: 'area',
                x: 'report_date',
                json: objectRows,
                keys: {
                    value: ['report_date', ...columnKeys],
                },
                groups: [columnKeys],
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
