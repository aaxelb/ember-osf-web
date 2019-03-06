import EmberArray from '@ember/array';
import { camelize } from '@ember/string';
import DS from 'ember-data';
import ModelRegistry from 'ember-data/types/registries/model';
import { singularize } from 'ember-inflector';
import { Links } from 'jsonapi-typescript';

import { Resource } from 'osf-api';

/* eslint-disable space-infix-ops */
/* eslint-disable no-use-before-define */

type ArrayLike<T> = Array<T> | EmberArray<T>;
type ElementOf<T> = T extends ArrayLike<infer E> ? E : never;

// Extract from K values which are keys on T
export type Keys<T, K> = Extract<K, string & keyof T>;

// Types for recognizing model relationships -- assumes we've given them the correct types
export type ModelBelongsTo<M extends DS.Model = DS.Model> = DS.PromiseObject<M> & M;
export type ModelHasMany<M extends DS.Model = DS.Model> = DS.PromiseManyArray<M>;

// Get the name of a given model
export type ModelName<M> = {
    [K in keyof ModelRegistry]: ModelRegistry[K] extends M ? K : never
}[keyof ModelRegistry];

// All field names for a given model M. Ignores fields on the base class B.
export type ModelFields<B, M extends B> = Keys<M, {
    [K in keyof M]:
        K extends keyof B ? never :
        M[K] extends (...args: any) => unknown ? never :
        K
}[keyof M]>;

// Valid field names for all models in the ModelRegistry which extend B
export type Fieldset<B> = {
    [K in keyof ModelRegistry]?:
        ModelRegistry[K] extends B ? Array<ModelFields<B, ModelRegistry[K]>> : never;
};

export type UnwrapField<T, R extends keyof T> =
    T[R] extends ModelBelongsTo<infer E> ? E :
    T[R] extends ModelHasMany<infer E> ? E :
    T[R];


// Sparse data for a model instance
type SparseModelFields<
    B,
    M extends B,
    FS extends Fieldset<B>,
    MFields extends keyof M = Keys<M, ElementOf<FS[ModelName<M>]>>,
    > = {
    [F in MFields]:
        M[F] extends ModelBelongsTo<infer N> ? (
            N extends B ? SparseModel<B, N, FS> : never
        ) :
        M[F] extends ModelHasMany<infer N> ? (
            N extends B ? Array<SparseModel<B, N, FS>> : never
        ) :
        M[F];
};

export type SparseModel<B, M extends B, FS extends Fieldset<B>> = {
    id: string | number;
    modelName: string;
    links?: Links;
} & SparseModelFields<B, M, FS>;

function camelizeKeys(responseData: object): Record<string, unknown> {
    return Object.entries(responseData).reduce(
        (acc, [k, v]) => ({
            ...acc,
            [camelize(k)]: v,
        }),
        {} as Record<string, unknown>,
    );
}

export function parseSparseResource<B, M extends B, FS extends Fieldset<B>>(
    resource: Resource,
): SparseModel<B, M, FS> {
    const embeds: Record<string, unknown> = {};
    if (resource.embeds) {
        Object.entries(resource.embeds).forEach(([k, embedded]) => {
            if (embedded.data instanceof Array) {
                embeds[k] = embedded.data.map(e => parseSparseResource<B, M, FS>(e));
            } else {
                embeds[k] = parseSparseResource<B, M, FS>(embedded.data);
            }
        });
    }

    return {
        id: resource.id,
        modelName: singularize(camelize(resource.type)),
        links: resource.links,
        ...camelizeKeys(resource.attributes || {}),
        ...camelizeKeys(embeds),
    } as SparseModel<B, M, FS>;
}

/* eslint-enable no-use-before-define */
/* eslint-enable space-infix-ops */
