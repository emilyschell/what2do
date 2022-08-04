import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { styles } from '../assets/styles';

const CustomBigButton = ({ children, onPress, style }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[styles.bigButtons, style]}>{children}</View>
        </TouchableOpacity>
    );
};

CustomBigButton.propTypes = {
    onPress: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array])
        .isRequired,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default CustomBigButton;
