import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Proptypes from 'prop-types';
import { styles } from '../assets/styles';

const CustomBigButton = ({ children, onPress, style }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[styles.bigButtons, style]}>{children}</View>
        </TouchableOpacity>
    );
};

CustomBigButton.propTypes = {
    onPress: Proptypes.func.isRequired,
    children: Proptypes.oneOfType([Proptypes.element, Proptypes.array])
        .isRequired,
    style: Proptypes.oneOfType([Proptypes.object, Proptypes.array]),
};

CustomBigButton.defaultProps = {
    style: {},
};

export default CustomBigButton;
