import Component from '@ember/component';
import layout from './template';

export default Component.extend({
    layout,

    // TODO get OSF palette dynamically
    colorPalette: Object.freeze({
        primary: {
            name: 'cyan',
            base: '#00bcd4',
        },
        accent: {
            name: 'amber',
            base: '#ffc107',
        },
        secondary: {
            name: 'greyish',
            base: '#b6b6b6',
        },
        foreground: {
            name: 'blackish',
            base: '#212121',
        },
        background: {
            name: 'bright',
            base: '#ffffff',
        },
    }),
});
