import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { styles, colors } from '../../../assets/styles';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import colors from '../../assets/colors';

const LoadingScreen = ({ navigation }) => {
    useEffect(checkIfLoggedIn, []);

    checkIfLoggedIn = () => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                //navigate to home screen
                navigation.navigate('OpenCreateMenu', { user });
            } else {
                //login screen
                navigation.navigate('LoginStackNavigator');
            }
        });
        return unsubscribe;
    };

    return (
        <View style={styles.container}>
            <ActivityIndicator size='large' color={colors.iconColor} />
        </View>
    );
};

export default LoadingScreen;
