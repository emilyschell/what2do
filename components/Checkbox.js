import React, { useState } from 'react';
import { Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons';
import { styles, colors } from '../assets/styles';

const Checkbox = ({ setComplete }) => {
    const [checked, toggleChecked] = useState(false);

    return (
        <Pressable
            style={styles.checkboxBase}
            onPress={() => {
                setComplete(!checked);
                toggleChecked(!checked);
            }}>
            {checked && (
                <Ionicons name='checkmark' size={30} color={colors.bgSuccess} />
            )}
        </Pressable>
    );
};

export default Checkbox;
