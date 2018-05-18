import Component from '@ember/component';
import styles from './styles';
import layout from './template';

/**
 * Display a loading indicator.
 * @param dark  Set true for use on lighter backgrounds.
 */
export default class LoadingIndicator extends Component {
    layout = layout;
    styles = styles;
}
