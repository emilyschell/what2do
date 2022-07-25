import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomBigButton from '../../components/CustomBigButton';
import { styles } from '../../assets/styles';
import { auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';

const SettingScreen = ({ navigation }) => {
    const onSignOut = async () => {
        try {
            await signOut(auth);
            navigation.navigate('WelcomeScreen');
        } catch (error) {
            alert('Unable to sign out right now');
        }
    };

    return (
        <View style={styles.container}>
            <CustomBigButton
                style={styles.bigButtons}
                title='Sign Out'
                onPress={onSignOut}>
                <Text style={styles.largeText}>Logout</Text>
            </CustomBigButton>
        </View>
    );
};
export default SettingScreen;
