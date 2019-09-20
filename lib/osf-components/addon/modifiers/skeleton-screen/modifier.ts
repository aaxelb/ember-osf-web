import Modifier from 'ember-oo-modifiers';

import styles from './styles';

class SkeletonScreenModifier extends Modifier {
    didReceiveArguments([isLoading]: [boolean]) {
        const { element } = this;

        if (isLoading) {
            element.classList.add(styles.SkeletonScreen);
            // @ts-ignore
            element.inert = true;
        } else {
            element.classList.remove(styles.SkeletonScreen);
            // @ts-ignore
            element.inert = false;
        }
    }
}

export default Modifier.modifier(SkeletonScreenModifier);

