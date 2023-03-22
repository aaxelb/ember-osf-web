import Component from '@glimmer/component';
import { TaskInstance } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';
import moment from 'moment';

type ChartKey = 'unique_visits' | 'time_of_day' | 'referer_domain' | 'popular_pages';

type ChartsData = Record<ChartKey, unknown>;

export interface ChartSpec {
    chartKey: ChartKey;
    titleKey: string; // intl translation key
    processData?: (data: any, intl: Intl, nodeId: string) => any;
    fakeData?: () => any;
    chartConfig(processedData: any, intl: Intl): unknown;
}

function excludeNonIntegers(d: any) {
    return parseInt(d, 10) === d ? d : null;
}

interface AnalyticsChartArgs {
    nodeId: string;
    chartsDataTaskInstance: TaskInstance<ChartsData>;
    chartsEnabled: boolean;
}

const COLOR_PATTERN = [
    '#00bbde', '#fe6672', '#eeb058', '#8a8ad6', '#ff855c', '#00cfbb',
    '#5a9eed', '#73d483', '#c879bb', '#0099b6', '#d74d58', '#cb9141',
    '#6b6bb6', '#d86945', '#00aa99', '#4281c9', '#57b566', '#ac5c9e',
    '#27cceb', '#ff818b', '#f6bf71', '#9b9be1', '#ff9b79', '#26dfcd',
    '#73aff4', '#87e096', '#d88bcb',
];

export default class AnalyticsChart extends Component<AnalyticsChartArgs> {
    charts: ChartSpec[] = [
        {
            chartKey: 'unique_visits',
            titleKey: 'analytics.uniqueVisits',
            chartConfig(processedData: any, intl: Intl) {
                return {
                    data: {
                        json: processedData,
                        type: 'line',
                        keys: {
                            x: 'date',
                            value: ['count'],
                        },
                    },
                    point: {
                        sensitivity: 15,
                    },
                    tooltip: {
                        format: {
                            title: (x: Date) => x.toDateString(),
                            name: () => intl.t('analytics.visits'),
                        },
                    },
                    legend: {
                        show: false,
                    },
                    axis: {
                        x: {
                            type: 'timeseries',
                            tick: {
                                format: '%b %d',
                            },
                        },
                        y: {
                            tick: {
                                format: excludeNonIntegers,
                            },
                        },
                    },
                };
            },
            fakeData() {
                const data = [];
                for (let i = 10; i; i--) {
                    data.push({
                        count: Math.floor(Math.random() * 1000),
                        date: moment().subtract(i, 'days').format(),
                    });
                }
                return data;
            },
        },
        {
            chartKey: 'time_of_day',
            titleKey: 'analytics.visitTimes',
            chartConfig(processedData: any, intl: Intl) {
                return {
                    data: {
                        json: processedData,
                        type: 'bar',
                        keys: {
                            x: 'hour',
                            value: ['count'],
                        },
                    },
                    color: {
                        pattern: COLOR_PATTERN,
                    },
                    tooltip: {
                        format: {
                            name: () => intl.t('analytics.visits'),
                        },
                    },
                    legend: {
                        show: false,
                    },
                    bar: {
                        width: 10,
                    },
                    axis: {
                        x: {
                            label: {
                                text: intl.t('analytics.hourOfDay'),
                                position: 'outer-center',
                            },
                            tick: {
                                centered: true,
                                multiline: false,
                                values: [0, 4, 8, 12, 16, 20],
                            },
                        },
                        y: {
                            tick: {
                                format: excludeNonIntegers,
                            },
                        },
                    },
                };
            },
            processData(data: any) {
                interface VisitTimeResult {
                    hour: number;
                    count: number;
                }

                interface ResultMap {
                    [k: number]: VisitTimeResult;
                }

                // Fill in the missing hours
                const resultMap: ResultMap = {};
                data.forEach((r: VisitTimeResult) => {
                    resultMap[r.hour] = r;
                });
                const newResult = [...Array(24).keys()].map(
                    (k: number) => (resultMap[k] || {
                        hour: k,
                        count: 0,
                    }),
                );
                return newResult;
            },
            fakeData() {
                const data = [...Array(24).keys()].map(
                    (k: number) => ({
                        result: Math.floor(Math.random() * 1000),
                        x: k,
                    }),
                );
                return data;
            },
        },
        {
            chartKey: 'referer_domain',
            titleKey: 'analytics.topReferrers',
            chartConfig(processedData: any) {
                return {
                    data: {
                        columns: processedData,
                        type: 'pie',
                        keys: {
                            value: ['referer_domain', 'count'],
                        },
                    },
                    color: {
                        pattern: COLOR_PATTERN,
                    },
                    legend: {
                        show: true,
                        position: 'right',
                    },
                };
            },
            processData(data: any, intl: Intl) {
                return data.map((result: any) => [
                    result.referer_domain ?? intl.t('analytics.directLink'),
                    result.count,
                ]);
            },
            fakeData() {
                const data = [];
                for (let i = 5; i; i--) {
                    data.push([
                        ' '.repeat(i),
                        Math.floor(Math.random() * 1000),
                    ]);
                }
                return data.sortBy('1').reverse();
            },
        },
        {
            chartKey: 'popular_pages',
            titleKey: 'analytics.popularPages',
            chartConfig(processedData: any, intl: Intl) {
                return {
                    data: {
                        json: processedData,
                        type: 'bar',
                        keys: {
                            x: 'title',
                            value: ['count'],
                        },
                    },
                    color: {
                        pattern: COLOR_PATTERN,
                    },
                    tooltip: {
                        format: {
                            name: () => intl.t('analytics.visits'),
                        },
                    },
                    legend: {
                        show: false,
                    },
                    axis: {
                        rotated: true,
                        x: {
                            type: 'category',
                            tick: {
                                multilineMax: 3,
                            },
                        },
                        y: {
                            tick: {
                                format: excludeNonIntegers,
                            },
                        },
                    },
                };
            },
            processData(data: any[], intl: Intl, nodeId: string) {
                interface PopularPageResult {
                    path: string;
                    title: string;
                    count: number;
                }

                const aggregatedResults: { [path: string]: PopularPageResult } = {};

                data.forEach((result: PopularPageResult) => {
                    const path = result.path;
                    const [, guid, subPath] = path.split('/');

                    // if path begins with our node id: it's a project page.  Lookup the title using
                    // the second part of the path. All wiki pages are consolidated under 'Wiki'.
                    // If path begins with a guid-ish that is not the current node id, assume it's a
                    // file and use the title provided.
                    let pageTitle;
                    let pagePath;
                    if (guid === nodeId) {
                        if (subPath && subPath.length) {
                            pageTitle = intl.t(`analytics.popularPageNames.${subPath}`);
                        } else {
                            pageTitle = intl.t('analytics.popularPageNames.home');
                        }
                        pagePath = `/${guid}/${subPath || ''}`;
                    } else if (/^\/[a-z0-9]{5}\/$/.test(path)) {
                        pageTitle = intl.t('analytics.popularPageNames.fileDetail', {
                            fileName: result.title.replace(/^OSF \| /, ''),
                        });
                        pagePath = path;
                    } else {
                        // Didn't recognize the path, exclude the entry from the popular pages list.
                        return;
                    }

                    if (!aggregatedResults[pagePath]) {
                        aggregatedResults[pagePath] = {
                            path: pagePath,
                            title: pageTitle,
                            count: 0,
                        };
                    }
                    aggregatedResults[pagePath].count += result.count;
                });

                return Object.values(aggregatedResults).sortBy('count').reverse().slice(0, 10);
            },
            fakeData() {
                const data = [];
                for (let i = 10; i; i--) {
                    data.push({
                        result: Math.floor(Math.random() * 1000),
                        label: ' '.repeat(i),
                    });
                }
                return data.sortBy('result').reverse();
            },
        },
    ];
}
