import { module, test } from 'qunit';

import {
    addPathSegment,
    addQueryParam,
    filterQueryParams,
    joinUrl,
    splitUrl,
} from 'ember-osf-web/utils/url-parts';

module('Unit | Utility | url-parts', () => {
    test('splitUrl and joinUrl', assert => {
        const testCases = [
            {
                input: 'https://osf.io/',
                expected: {
                    path: 'https://osf.io/',
                    queryString: undefined,
                    fragment: undefined,
                },
            },
            {
                input: 'https://osf.io/?blah=blee',
                expected: {
                    path: 'https://osf.io/',
                    queryString: 'blah=blee',
                    fragment: undefined,
                },
            },
            {
                input: 'https://osf.io/?aoeu=aoeu&blah=blee#hahafragment',
                expected: {
                    path: 'https://osf.io/',
                    queryString: 'aoeu=aoeu&blah=blee',
                    fragment: 'hahafragment',
                },
            },
            {
                input: 'https://osf.io/#hahafragment',
                expected: {
                    path: 'https://osf.io/',
                    queryString: undefined,
                    fragment: 'hahafragment',
                },
            },
            {
                input: '/?aoeu=aoeu&blah=blee#hahafragment',
                expected: {
                    path: '/',
                    queryString: 'aoeu=aoeu&blah=blee',
                    fragment: 'hahafragment',
                },
            },
            {
                input: '/some/path/#hahafragment',
                expected: {
                    path: '/some/path/',
                    queryString: undefined,
                    fragment: 'hahafragment',
                },
            },
            {
                input: '/#hahafragment',
                expected: {
                    path: '/',
                    queryString: undefined,
                    fragment: 'hahafragment',
                },
            },
        ];

        for (const testCase of testCases) {
            const actual = splitUrl(testCase.input);
            assert.deepEqual(actual, testCase.expected, 'splitUrl split the URL');
            const rejoined = joinUrl(actual);
            assert.equal(rejoined, testCase.input, 'joinUrl rejoins to the same URL');
        }
    });

    test('addQueryParam', assert => {
        const testCases = [
            {
                initial: 'https://osf.io/',
                key: 'foo',
                val: 'bar',
                expected: 'https://osf.io/?foo=bar',
            },
            {
                initial: 'https://osf.io/?blah=blee',
                key: 'foo',
                val: 'bar',
                expected: 'https://osf.io/?blah=blee&foo=bar',
            },
            {
                initial: 'https://osf.io/?aoeu=aoeu&blah=blee#hahafragment',
                key: 'foo',
                val: 'bar',
                expected: 'https://osf.io/?aoeu=aoeu&blah=blee&foo=bar#hahafragment',
            },
            {
                initial: 'https://osf.io/#hahafragment',
                key: 'foo',
                val: 'bar',
                expected: 'https://osf.io/?foo=bar#hahafragment',
            },
        ];

        for (const testCase of testCases) {
            const actual = addQueryParam(
                testCase.initial,
                testCase.key,
                testCase.val,
            );
            assert.equal(actual, testCase.expected, 'addQueryParam added query param');
        }
    });

    test('addPathSegment', assert => {
        const testCases = [
            {
                initial: 'https://osf.io/',
                segment: 'foo',
                expected: 'https://osf.io/foo',
            },
            {
                initial: 'https://osf.io/?blah=blee',
                segment: 'foo',
                expected: 'https://osf.io/foo?blah=blee',
            },
            {
                initial: 'https://osf.io/woo/?aoeu=aoeu&blah=blee#hahafragment',
                segment: 'foo',
                expected: 'https://osf.io/woo/foo?aoeu=aoeu&blah=blee#hahafragment',
            },
            {
                initial: 'https://osf.io/#hahafragment',
                segment: 'foo/blah/boo',
                expected: 'https://osf.io/foo/blah/boo#hahafragment',
            },
        ];

        for (const testCase of testCases) {
            const actual = addPathSegment(
                testCase.initial,
                testCase.segment,
            );
            assert.equal(actual, testCase.expected, 'addPathSegment added a path segment');
        }
    });

    test('filterQueryParams', assert => {
        const testCases: Array<{
            initial: string,
            filterFn: (k: string, v: string) => boolean,
            expected: string,
        }> = [
            {
                initial: 'https://osf.io/',
                filterFn: () => true,
                expected: 'https://osf.io/',
            },
            {
                initial: 'https://osf.io/?blah=blee&bloo=blah&blee=blee',
                filterFn: () => true,
                expected: 'https://osf.io/?blah=blee&bloo=blah&blee=blee',
            },
            {
                initial: 'https://osf.io/?blah=blee&bloo=blah&blee=blee',
                filterFn: () => false,
                expected: 'https://osf.io/',
            },
            {
                initial: 'https://osf.io/?blah=blee&bloo=blah&blee=blee',
                filterFn: (k, v) => k === v,
                expected: 'https://osf.io/?blah=blee&bloo=blah',
            },
            {
                initial: 'https://osf.io/?blah=blah&bloo=blah&blee=blee',
                filterFn: (k, v) => k !== v,
                expected: 'https://osf.io/?bloo=blah',
            },
            {
                initial: 'https://osf.io/?blah=blah&bloo=blah&blee=blee#plus-fragment',
                filterFn: (k, v) => k !== v,
                expected: 'https://osf.io/?bloo=blah#plus-fragment',
            },
            {
                initial: '/just/a/path?blah=blee&bloo=blah&blee=blee',
                filterFn: () => true,
                expected: '/just/a/path?blah=blee&bloo=blah&blee=blee',
            },
            {
                initial: '/just/a/path?blah=blee&bloo=blah&blee=blee',
                filterFn: () => false,
                expected: '/just/a/path',
            },
            {
                initial: '/just/a/path?blah=blee&bloo=blah&blee=blee',
                filterFn: (k, v) => k === v,
                expected: '/just/a/path?blah=blee&bloo=blah',
            },
            {
                initial: '/just/a/path?blah=blee&bloo=blah&blee=blee#plus-fragment',
                filterFn: () => false,
                expected: '/just/a/path#plus-fragment',
            },
            {
                initial: '/just/a/path?blah=blee&bloo=blah&blee=blee#plus-fragment',
                filterFn: (k, v) => k === v,
                expected: '/just/a/path?blah=blee&bloo=blah#plus-fragment',
            },
        ];

        for (const testCase of testCases) {
            const actual = filterQueryParams(
                testCase.initial,
                testCase.filterFn,
            );
            assert.equal(actual, testCase.expected, 'filterQueryParams filtered query params');
        }
    });
});
