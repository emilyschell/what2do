import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../assets/styles';

const OpenCreateMenu = ({ navigation }) => {
    const user = navigation.getParam('user');
    return (
        <View style={styles.container}>
            <Text style={styles.smallButtonText}>Open Create Menu here</Text>;
            <Text style={styles.smallButtonText}>Welcome, {user.email}</Text>;
        </View>
    );
};

export default OpenCreateMenu;
