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

type PartialFieldRegistry<BaseModel, Models extends keyof ModelRegistry> = {
    [K in Models]: FieldRegistry<BaseModel>[K];
};

type ElementOf<T> = T extends (infer E)[] ? E : T;

type ModelName<M> = {
    [K in keyof ModelRegistry]: ModelRegistry[K] extends M ? K : never
}[keyof ModelRegistry];

type SparseResult<
    BaseModel,
    M,
    SparseFields extends SparseFieldSet<BaseModel>,
    PFNR
    MName = ModelName<M>,
    ResultFields extends keyof any = MName extends keyof SparseFields ? SparseFields[MName] : keyof {}
    > = {
        [F in ResultFields]: F extends keyof M ? (
            M[F] extends BaseModel ? SparseResult<BaseModel, M[F], SparseFields> :
            M[F] extends BaseModel[] ? Array<SparseResult<BaseModel, ElementOf<M[F]>, SparseFields>> :
            M[F]
        ) : never
};

declare function sfs<F extends PartialFieldRegistry<BaseModel
