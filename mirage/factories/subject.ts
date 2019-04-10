import { Factory, faker } from 'ember-cli-mirage';

import SubjectModel from 'ember-osf-web/models/subject';

export default Factory.extend<SubjectModel>({
    text() {
        return faker.lorem.word();
    },
});
