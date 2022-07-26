import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { styles, colors } from './assets/styles';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './src/screens/AuthStack/WelcomeScreen';
import LoginScreen from './src/screens/AuthStack/LoginScreen';
import SignUpScreen from './src/screens/AuthStack/SignUpScreen';
import OpenCreateMenu from './src/screens/AppStack/OpenCreateMenu';
import CreateEditSchedule from './src/screens/AppStack/CreateEditSchedule';
import ScheduleTypeMenu from './src/screens/AppStack/ScheduleTypeMenu';
import OpenFileList from './src/screens/AppStack/OpenFileList';
import { auth } from './src/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Stack = createStackNavigator();

const App = () => {
    const [userLoading, setUserLoading] = useState(true);
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => checkIfLoggedIn(), []);

    const checkIfLoggedIn = () => {
        const subscriber = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                setUserLoading(false);
            } else {
                setUserLoading(false);
            }
        });
        return subscriber;
    };

    useEffect(() => {
        async function loadFonts() {
            await Font.loadAsync({
                Roboto: require('./assets/fonts/Roboto.ttf'),
                PermanentMarker: require('./assets/fonts/PermanentMarker.ttf'),
            });
            setFontsLoaded(true);
        }
        loadFonts();
    }, []);

    if (fontsLoaded && !userLoading) {
        return (
            <NavigationContainer>
                {user ? (
                    <Stack.Navigator
                        screenOptions={{
                            headerTitle: '',
                            headerStyle: { backgroundColor: colors.bgMain },
                        }}>
                        <Stack.Screen
                            name='OpenCreateMenu'
                            component={OpenCreateMenu}
                        />
                        <Stack.Screen
                            name='CreateEditSchedule'
                            component={CreateEditSchedule}
                        />
                        <Stack.Screen
                            name='ScheduleTypeMenu'
                            component={ScheduleTypeMenu}
                        />
                        <Stack.Screen
                            name='OpenFileList'
                            component={OpenFileList}
                        />
                    </Stack.Navigator>
                ) : (
                    <Stack.Navigator
                        screenOptions={{
                            headerShown: false,
                        }}>
                        <Stack.Screen
                            name='Welcome'
                            component={WelcomeScreen}
                        />
                        <Stack.Screen
                            name='LoginScreen'
                            component={LoginScreen}
                        />
                        <Stack.Screen
                            name='SignUpScreen'
                            component={SignUpScreen}
                        />
                    </Stack.Navigator>
                )}
            </NavigationContainer>
        );
    } else {
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large' color={colors.iconColor} />
            </View>
        );
    }
};

export default App;
