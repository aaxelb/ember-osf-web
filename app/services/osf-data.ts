import { service } from '@ember-decorators/service';
import { underscore } from '@ember/string';
import Service from '@ember/service';
import { RelationshipsFor } from 'ember-data';
import { pluralize } from 'ember-inflector';
import { Links, PaginationLinks } from 'jsonapi-typescript';

import OsfModel from 'ember-osf-web/models/osf-model';
import CurrentUser from 'ember-osf-web/services/current-user';
import { Fieldset, parseSparseResource, SparseModel, UnwrapField } from 'ember-osf-web/utils/sparse-fieldsets';

import {
    PaginatedMeta,
    ResourceCollectionDocument,
} from 'osf-api';


interface RequestOptions {
    queryParams?: object,
    ajaxOptions?: object,
}

interface SparseHasManyOptions extends RequestOptions {
    loadAll?: boolean,
}

export interface SparseHasManyResult<
    M extends OsfModel,
    FS extends Fieldset<OsfModel>,
> {
    data: Array<SparseModel<OsfModel, M, FS>>;
    meta: PaginatedMeta;
    links?: Links | PaginationLinks;
}

export default class OsfData extends Service {
    @service currentUser!: CurrentUser;

    /*
     * https://developer.osf.io/#tag/Sparse-Fieldsets
     */
    async sparseHasMany<
    M extends OsfModel,
    R extends RelationshipsFor<M>,
    FS extends Fieldset<OsfModel>,
    ResultType extends OsfModel = Extract<UnwrapField<M, R>, OsfModel>,
    >(
        model: M,
        relationshipName: R,
        fieldset: FS,
        options: SparseHasManyOptions = {},
    ): Promise<SparseHasManyResult<ResultType, FS>> {
        const url = model.getHasManyLink(relationshipName);
        if (!url) {
            throw Error();
        }

        const response = await this.sparseFieldsetRequest(url, fieldset, options);

        const { data, meta, links } = response;

        return {
            data: data.map(resource => parseSparseResource<OsfModel, ResultType, FS>(resource)),
            meta,
            links,
        };
    }

    private async sparseFieldsetRequest(
        url: string,
        fieldset: Fieldset<OsfModel>,
        options: RequestOptions,
    ): Promise<ResourceCollectionDocument> {
        // build the fields query params, e.g. `fields[nodes]=title,contributors`
        const fields = Object.entries(fieldset).reduce(
            (acc, [modelName, fields]) => ({
                ...acc,
                [underscore(pluralize(modelName))]: (fields as string[]).map(underscore).join(','),
            }),
            {} as Record<string, string>,
        );

        return this.currentUser.authenticatedAJAX({
            url,
            data: {
                fields,
                ...options.queryParams,
            },
            ...options.ajaxOptions,
        });
    }
}
