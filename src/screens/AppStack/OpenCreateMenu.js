import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../../assets/styles';
import CustomBigButton from '../../../components/CustomBigButton';
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

const OpenCreateMenu = ({ route, navigation }) => {
    const { user } = route.params;
    return (
        <View style={styles.container}>
            <Text style={styles.largeText}>Schedules</Text>
            <Text style={styles.smallButtonText}>
                Welcome {JSON.parse(user).displayName}
            </Text>

            <CustomBigButton
                style={[styles.bigButtons, { flexDirection: 'row' }]}>
                <FontAwesome name='folder-open' size={40} color='black' />
                <Text style={styles.largeText}>Open</Text>
            </CustomBigButton>
            <CustomBigButton
                style={[styles.bigButtons, { flexDirection: 'row' }]}>
                <Entypo name='edit' size={40} color='black' />
                <Text style={styles.largeText}>Make</Text>
            </CustomBigButton>
        </View>
    );
};

export default OpenCreateMenu;
