import React, { useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { colors, styles } from '../../../assets/styles';
import CustomSmallButton from '../../../components/CustomSmallButton';
import { auth, db } from '../../firebase/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';

const SignUpScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onSignUp = async () => {
        if (email && password) {
            if (confirmPass !== password) {
                alert('Passwords do not match, please try again.');
                setPassword('');
                setConfirmPass('');
            } else {
                setIsLoading(true);
                try {
                    const response = await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );
                    if (response) {
                        setIsLoading(false);
                        const user = auth.currentUser;
                        await updateProfile(user, {
                            displayName: name,
                        });
                        await addDoc(collection(db, 'users'), {
                            email: response.user.email,
                            uid: response.user.uid,
                            displayName: name,
                        });
                        // adds displayName to user profile
                        // adds user to Firestore database
                        //automatically signs in the user
                        navigation.navigate('OpenCreateMenu', {
                            user: JSON.stringify(user),
                        });
                    }
                } catch (error) {
                    setIsLoading(false);
                    if (error.code == 'auth/email-already-in-use') {
                        alert('User already exists. Try logging in.');
                    }
                    console.log(error);
                }
            }
        } else {
            alert('Please enter email and password.');
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
                    <ActivityIndicator size='large' color={colors.iconColor} />
                </View>
            ) : null}

            <ScrollView contentContainerStyle={styles.container}>
                <SafeAreaView />
                <View style={{ padding: 20, marginTop: 50 }}>
                    <Text style={styles.largeText}>Sign Up</Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                    }}>
                    <Text style={styles.smallButtonText}>Email</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder={'enter email'}
                        placeholderTextColor={colors.textInputPlaceholder}
                        keyboardType='email-address'
                        onChangeText={(emailInput) => setEmail(emailInput)}
                        value={email}
                    />
                    <Text style={styles.smallButtonText}>Name</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder='enter name'
                        placeholderTextColor={colors.textInputPlaceholder}
                        onChangeText={(nameInput) => setName(nameInput)}
                        value={name}
                    />
                    <Text style={styles.smallButtonText}>Password</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder='enter password'
                        placeholderTextColor={colors.textInputPlaceholder}
                        secureTextEntry
                        onChangeText={(passwordInput) =>
                            setPassword(passwordInput)
                        }
                        value={password}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder='confirm password'
                        placeholderTextColor={colors.textInputPlaceholder}
                        secureTextEntry
                        onChangeText={(confirmPassInput) => {
                            setConfirmPass(confirmPassInput);
                        }}
                        value={confirmPass}
                    />
                    <CustomSmallButton onPress={onSignUp}>
                        <Text style={styles.smallButtonText}>Sign Up</Text>
                    </CustomSmallButton>
                </View>
            </ScrollView>
        </View>
    );
};

export default SignUpScreen;
