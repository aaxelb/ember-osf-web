import Route from '@ember/routing/route';
import config from 'ember-get-config';


const reportNamesURL = `${config.OSF.apiUrl}/_/mw/report/`;


export default class OsfMetrics extends Route {
    async model() {
        const response = await fetch(reportNamesURL);
        const responseBody = await response.json();
        return responseBody.viewable_reports;  // TODO bad implicit any
    }
}
