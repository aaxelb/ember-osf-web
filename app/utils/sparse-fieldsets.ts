import EmberArray from '@ember/array';
import DS from 'ember-data';
import ModelRegistry from 'ember-data/types/registries/model';
import { Links } from 'jsonapi-typescript';

/* eslint-disable space-infix-ops */
/* eslint-disable no-use-before-define */

type ArrayLike<T> = Array<T> | EmberArray<T>;
type ElementOf<T> = T extends ArrayLike<infer E> ? E : T;

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
export type ModelFields<B, M extends B> = {
    [K in keyof M]:
        K extends keyof B ? never :
        M[K] extends (...args: any) => unknown ? never :
        K
}[keyof M];

// Valid field names for all models in the ModelRegistry which extend B
export type ModelFieldRegistry<B> = {
    [K in keyof ModelRegistry]:
        ModelRegistry[K] extends B ? Array<ModelFields<B, ModelRegistry[K]>> : never;
};

// Sparse data for a model instance
export type SparseModel<
    B,
    M extends B,
    SparseFields extends Partial<ModelFieldRegistry<B>>,
    MFields extends keyof M = Keys<M, ElementOf<SparseFields[ModelName<M>]>>,
    > = {
    id: string | number;
    model: string;
    links?: Links;
} & {
    [F in MFields]:
        M[F] extends ModelBelongsTo<infer N> ? (
            N extends B ? SparseModel<B, N, SparseFields> : never
        ) :
        M[F] extends ModelHasMany<infer N> ? (
            N extends B ? Array<SparseModel<B, N, SparseFields>> : never
        ) :
        M[F];
};

/* eslint-enable space-infix-ops */
/* eslint-enable no-use-before-define */
