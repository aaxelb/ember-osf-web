import DS from 'ember-data';
import OsfModel from './osf-model';

const { attr } = DS;

export default class BrandAssetsModel extends OsfModel {
    @attr('string') primaryColor!: string;
    @attr('string') secondaryColor!: string;
    @attr('string') navbarLogoImage!: string;
    @attr('string') heroLogoImage!: string;
    @attr('string') heroBackgroundImage!: string;
}
