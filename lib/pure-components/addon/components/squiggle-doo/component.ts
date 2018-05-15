import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import layout from './template';

/**
 * A component that does a squiggle.
 */
export default class SquiggleDoo extends Component {
    layout = layout;

    /**
     * A randomly generated number.
     */
    randomNumber = 4;
}
