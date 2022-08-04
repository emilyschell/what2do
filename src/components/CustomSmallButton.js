import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { styles } from '../assets/styles';

const getPosition = (position) => {
    switch (position) {
        case 'left':
            return { position: 'absolute', left: 20, bottom: 20 };
        case 'right':
            return { position: 'absolute', right: 20, bottom: 20 };
        default:
            return {};
    }
};

const CustomSmallButton = ({ children, onPress, style, position }) => {
    const floatingActionButton = position ? getPosition(position) : [];
    return (
        <TouchableOpacity style={floatingActionButton} onPress={onPress}>
            <View style={[styles.smallButtons, style]}>{children}</View>
        </TouchableOpacity>
    );
};

CustomSmallButton.propTypes = {
    onPress: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default CustomSmallButton;
