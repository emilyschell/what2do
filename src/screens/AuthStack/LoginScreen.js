import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { colors, styles } from '../../../assets/styles';
import CustomSmallButton from '../../../components/CustomSmallButton';
import { auth } from '../../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { DismissKeyboard } from '../../../helpers/dismissKeyboard';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onSignIn = async () => {
        if (email && password) {
            setIsLoading(true);
            try {
                const response = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
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
                        break;
                    case 'auth/wrong-password':
                        alert('Incorrect password');
                        break;
                    default:
                        alert(JSON.stringify(error.message));
                }
            }
        } else {
            alert('Please enter email and password.');
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large' color={colors.iconColor} />
            </View>
        );
    } else {
        return (
            <DismissKeyboard>
                <View style={styles.container}>
                    <View style={styles.container}>
                        <SafeAreaView />
                        <View style={{ padding: 20, marginTop: 50 }}>
                            <Text style={styles.largeText}>Log In</Text>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                            }}>
                            <TextInput
                                style={styles.textInput}
                                placeholder={'enter email'}
                                placeholderTextColor={
                                    colors.textInputPlaceholder
                                }
                                keyboardType='email-address'
                                onChangeText={(emailInput) =>
                                    setEmail(emailInput)
                                }
                            />
                            <TextInput
                                style={styles.textInput}
                                placeholder='enter password'
                                placeholderTextColor={
                                    colors.textInputPlaceholder
                                }
                                secureTextEntry
                                onChangeText={(passwordInput) =>
                                    setPassword(passwordInput)
                                }
                            />
                            <CustomSmallButton onPress={onSignIn}>
                                <Text style={styles.smallButtonText}>
                                    Login
                                </Text>
                            </CustomSmallButton>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={styles.mediumText}>
                                Not registered yet?
                            </Text>
                            <CustomSmallButton
                                onPress={() =>
                                    navigation.navigate('SignUpScreen')
                                }
                                style={{ backgroundColor: colors.bgSuccess }}>
                                <Text style={styles.smallButtonText}>
                                    Sign Up
                                </Text>
                            </CustomSmallButton>
                        </View>
                    </View>
                </View>
            </DismissKeyboard>
        );
    }
};

export default LoginScreen;
