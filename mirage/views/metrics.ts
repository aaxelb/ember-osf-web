import { Response } from 'ember-cli-mirage';

export function postPageview() {
    // no need to actually store metrics in mirage
    return new Response(201);
}
