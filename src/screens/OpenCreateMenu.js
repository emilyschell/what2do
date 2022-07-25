import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../assets/styles';
import CustomBigButton from '../../components/CustomBigButton';

const OpenCreateMenu = ({ route, navigation }) => {
    const { user } = route.params;
    return (
        <View style={styles.container}>
            <Text style={styles.largeText}>Schedules</Text>
            <Text style={styles.smallButtonText}>Welcome {user.email}</Text>

            <CustomBigButton>
                <Text style={styles.largeText}>Open</Text>
            </CustomBigButton>
            <CustomBigButton>
                <Text style={styles.largeText}>Make</Text>
            </CustomBigButton>
        </View>
    );
};

export default OpenCreateMenu;
