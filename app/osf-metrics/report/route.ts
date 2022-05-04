import Route from '@ember/routing/route';
import config from 'ember-get-config';

type Report = {
  [k: string]: number | string | undefined;
}

interface ModelParams {
    report_name: string;
    days_back: string;
}

interface ReportProperties {
  keyword: string[],
  numerical: string[],
}

const RESERVED_KEYS = ['report_date', 'timestamp'];

function categorizeReportProperties(report: Report): ReportProperties {
    const keys = Object.keys(report).filter(k => !RESERVED_KEYS.includes(k));
    return {
        keyword: keys.filter(k => (typeof report[k] === 'string')),
        numerical: keys.filter(k => (typeof report[k] === 'number')),
    };
}

function recentReportsURL(reportName: string, daysBack: string): string {
    return `${config.OSF.apiUrl}/_/mw/report/${reportName}/recent/?days_back=${daysBack}`
}

export default class OsfMetricsReport extends Route {
    async model(params: ModelParams) {
        const response = await fetch(recentReportsURL(params.report_name, params.days_back));
        const responseBody = await response.json();
        const reports: Report[] = responseBody.reports;
        return {
          reportName: params.report_name,
          reports,
          properties: reports.length ? categorizeReportProperties(reports[0]) : [],
        };
    }
}

