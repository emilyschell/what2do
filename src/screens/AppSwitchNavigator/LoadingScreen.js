import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { styles, colors } from '../../../assets/styles';
import { onAuthStateChanged } from 'firebase/auth';

const LoadingScreen = ({ navigation }) => {
    // useEffect(checkIfLoggedIn, []);

    // const checkIfLoggedIn = () => {
    //     const unsubscribe = onAuthStateChanged((user) => {
    //         if (user) {
    //             //navigate to home screen
    //             navigation.navigate('OpenCreateMenu', { user });
    //         } else {
    //             //login screen
    //             navigation.navigate('LoginScreen');
    //         }
    //     });
    //     return unsubscribe;
    // };

    return (
        <View style={styles.container}>
            {/* <ActivityIndicator size='large' color={colors.iconColor} /> */}
            <Text style={styles.largeText}>Loading Screen</Text>
        </View>
    );
};

export default LoadingScreen;
