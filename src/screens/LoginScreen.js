import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ActivityIndicator,
} from 'react-native';

import { colors, styles } from '../../assets/styles';
import CustomSmallButton from '../../components/CustomSmallButton';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onSignIn = async () => {
        if (email && password) {
            setIsLoading(true);
            try {
                const response = await firebase
                    .auth()
                    .signInWithEmailAndPassword(email, password);
                if (response) {
                    setIsLoading(false);
                    navigation.navigate('LoadingScreen');
                }
            } catch (error) {
                setIsLoading(false);
                switch (error.code) {
                    case 'auth/user-not-found':
                        alert(
                            'A user with that email does not exist. Try signing Up'
                        );
                        break;
                    case 'auth/invalid-email':
                        alert('Please enter a valid email address');
                }
            }
        }
    };
    const onSignUp = async () => {
        if (email && password) {
            setIsLoading(true);
            try {
                const response = await firebase
                    .auth()
                    .createUserWithEmailAndPassword(email, password);
                if (response) {
                    setIsLoading(false);
                    const user = await firebase
                        .database()
                        .ref('users')
                        .child(response.user.uid)
                        .set({
                            email: response.user.email,
                            uid: response.user.uid,
                        });

                    navigation.navigate('LoadingScreen');
                    //automatically signs in the user
                }
            } catch (error) {
                setIsLoading(false);
                if (error.code == 'auth/email-already-in-use') {
                    alert('User already exists. Try loggin in');
                }
                console.log(error);
            }
        } else {
            alert('Please enter email and password');
        }
    };

    return (
        <View style={styles.container}>
            {isLoading ? (
                <View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            elevation: 1000,
                        },
                    ]}>
                    <ActivityIndicator size='large' color={colors.logoColor} />
                </View>
            ) : null}
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <TextInput
                    style={styles.textInput}
                    placeholder={'enter email'}
                    placeholderTextColor={colors.bgTextInputDark}
                    keyboardType='email-address'
                    onChangeText={(emailInput) => setEmail(emailInput)}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder='enter password'
                    placeholderTextColor={colors.bgTextInputDark}
                    secureTextEntry
                    onChangeText={(passwordInput) => setPassword(passwordInput)}
                />
                <View style={{ alignItems: 'center' }}>
                    <CustomSmallButton
                        onPress={onSignIn}
                        style={[
                            styles.smallButtons,
                            { backgroundColor: colors.bgPrimary },
                        ]}>
                        <Text>Login</Text>
                    </CustomSmallButton>
                    <CustomSmallButton
                        onPress={onSignUp}
                        style={[
                            styles.loginButtons,
                            { borderColor: colors.bgPrimary },
                        ]}>
                        <Text>Sign Up</Text>
                    </CustomSmallButton>
                </View>
            </View>
            <View style={{ flex: 1 }}></View>
        </View>
    );
};

export default LoginScreen;
