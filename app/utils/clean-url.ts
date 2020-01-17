import { assert } from '@ember/debug';
import { filterQueryParams } from './url-parts';

/**
 * Given a URL, remove cruft that should not be visible to the user:
 *   - `/--foo/` path segments (only used for guid/engine routing)
 *   - trailing slash at the end of the path
 *   - query params with empty values (workaround for a bug in ember:
 *     https://github.com/emberjs/ember.js/issues/18683)
 *     NOTE: this may cause problems if a query param has a non-empty default
 *           value but may be set to an empty value.
 *
 */
export default function cleanURL(url: string) {
    assert(`cleanURL expects a path starting with '/', got '${url}'`, url.startsWith('/'));

    const cleanedURL = filterQueryParams(url, (_, value) => Boolean(value))
        .replace(/(?:^|\/)--[^/?]+/g, '') // remove '--foo' segments
        .replace(/\/(?=$|[?#])/, ''); // remove trailing slash

    return cleanedURL.startsWith('/') ? cleanedURL : `/${cleanedURL}`;
}

/**
 * Return a path suitable for passing to one of the various `not-found` routes.
 */
export function notFoundURL(url: string) {
    return cleanURL(url)
        .slice(1) // remove leading '/'
        .replace(/\?[^#]*/, ''); // remove query string to avoid duplicated query params
}
