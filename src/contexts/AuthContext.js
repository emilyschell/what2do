import React, { useEffect, useState, createContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { colors, styles } from '../../assets/styles';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large' color={colors.iconColor} />
            </View>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                currentUser,
            }}>
            {children}
        </AuthContext.Provider>
    );
};
