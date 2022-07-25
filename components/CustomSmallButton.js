import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Proptypes from 'prop-types';
import { styles } from '../assets/styles';

const getPosition = (position) => {
    switch (position) {
        case 'left':
            return { position: 'absolute', left: 20, bottom: 50 };
        case 'right':
            return { position: 'absolute', right: 20, bottom: 50 };
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
    onPress: Proptypes.func.isRequired,
    children: Proptypes.element.isRequired,
    style: Proptypes.oneOfType([Proptypes.object, Proptypes.array]),
};

CustomSmallButton.defaultProps = {
    style: {},
};

export default CustomSmallButton;
