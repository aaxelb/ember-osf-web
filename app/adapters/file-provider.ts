import FileProvider from 'ember-osf-web/models/file-provider';
import OsfAdapter from './osf-adapter';

export default class FileProviderAdapter extends OsfAdapter<FileProvider> {
    pathForType(): string {
        return 'files';
    }
}

declare module 'ember-data' {
    interface AdapterRegistry {
      'file-provider': FileProviderAdapter;
    }
}
