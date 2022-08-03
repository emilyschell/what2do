import React from 'react';
import { View, Text, SafeAreaView, Platform } from 'react-native';
import { styles, colors } from '../../../assets/styles';
import {
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';

import CustomSmallButton from '../../../components/CustomSmallButton';
import { auth } from '../../firebase/firebase';
import { signOut } from 'firebase/auth';

const CustomDrawerNavigator = (props) => {
    const onSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            alert('Unable to sign out right now');
        }
    };

    return (
        <View style={[styles.container, { padding: 0 }]}>
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={styles.container}>
                <SafeAreaView style={{ backgroundColor: colors.bgMain }} />
                <View
                    style={{
                        alignItems: 'center',
                        backgroundColor: colors.bgMain,
                        flex: 1,
                        justifyContent: 'center',
                        paddingTop: Platform.OS == 'android' ? 20 : 0,
                    }}>
                    <Text style={styles.largeText}>What2Do</Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        width: 280,
                    }}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    marginBottom: 20,
                }}>
                <CustomSmallButton onPress={onSignOut}>
                    <Text style={styles.smallButtonText}>Log Out</Text>
                </CustomSmallButton>
            </View>
        </View>
    );
};

export default CustomDrawerNavigator;
