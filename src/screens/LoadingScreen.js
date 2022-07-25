import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { styles, colors } from '../../assets/styles';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const LoadingScreen = ({ navigation }) => {
    useEffect(() => checkIfLoggedIn(), []);

    const checkIfLoggedIn = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                //navigate to home screen
                navigation.navigate('OpenCreateMenu', { user });
            } else {
                //login screen
                navigation.navigate('LoginScreen');
            }
        });
    };

    return (
        <View style={styles.container}>
            <ActivityIndicator size='large' color={colors.iconColor} />
        </View>
    );
};

export default LoadingScreen;
