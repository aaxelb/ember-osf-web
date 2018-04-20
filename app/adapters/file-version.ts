import FileVersion from 'ember-osf-web/models/file-version';
import OsfAdapter from './osf-adapter';

export default class FileVersionAdapter extends OsfAdapter<FileVersion> {}

declare module 'ember-data' {
    interface AdapterRegistry {
        'file-version': FileVersionAdapter;
    }
}
