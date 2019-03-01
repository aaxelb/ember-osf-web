import ModelRegistry from 'ember-data/types/registries/model';

type FieldKeys<BaseModel, M extends BaseModel> = {
    // TODO: exclude methods
    [K in keyof M]: K extends keyof BaseModel ? never : K
}[keyof M];

type FieldRegistry<BaseModel> = {
    [K in keyof ModelRegistry]: ModelRegistry[K] extends BaseModel ?
        Array<FieldKeys<BaseModel, ModelRegistry[K]>> :
        never;
};

export type SparseFieldSet<BaseModel, Models extends keyof ModelRegistry> = {
    [K in Models]: FieldRegistry<BaseModel>[K];
};

type ElementOf<T> = T extends (infer E)[] ? E : T;

type ModelName<M> = {
    [K in keyof ModelRegistry]: ModelRegistry[K] extends M ? K : never
}[keyof ModelRegistry];

export type RelationshipKeys<B, M extends B, MF = Subtract<M, B>> = {
    [K in keyof MF]: ElementOf<MF[K]> extends B ? K : never
}[keyof MF];

export type SparseResult<
    BaseModel,
    M,
    SparseFields extends SparseFieldSet<BaseModel>,
    MName = ModelName<M>,
    ResultFields extends keyof any = MName extends keyof SparseFields ? SparseFields[MName] : keyof {}
    > = {
        [F in ResultFields]: F extends keyof M ? (
            M[F] extends BaseModel ? SparseResult<BaseModel, M[F], SparseFields> :
            M[F] extends BaseModel[] ? Array<SparseResult<BaseModel, ElementOf<M[F]>, SparseFields>> :
            M[F]
        ) : never
};
