import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import {
//     createAppContainer,
//     createSwitchNavigator,
//     createStackNavigator,
//     createDrawerNavigator,
// } from 'react-navigation';
import WelcomeScreen from './src/screens/AppSwitchNavigator/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import OpenCreateMenu from './src/screens/OpenCreateMenu';

// import { decode, encode } from 'base-64';

import { firebaseConfig } from './src/firebase/config';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
initializeApp(firebaseConfig);

// const analytics = getAnalytics(app);

// if (!global.btoa) {
//     global.btoa = encode;
// }
// if (!global.atob) {
//     global.atob = decode;
// }

const Stack = createStackNavigator();

const App = () => {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        async function loadFonts() {
            await Font.loadAsync({
                // Load a font `Montserrat` from a static resource
                Montserrat: require('./assets/fonts/Montserrat.ttf'),
                PermanentMarker: require('./assets/fonts/PermanentMarker.ttf'),
            });
            setFontsLoaded(true);
        }
        loadFonts();
    }, []);

    //     const LoginStackNavigator = createStackNavigator(
    //         {
    //             WelcomeScreen: {
    //                 screen: WelcomeScreen,
    //                 navigationOptions: {
    //                     header: null,
    //                 },
    //             },
    //             LoginScreen,
    //         },
    //         {
    //             mode: 'modal',
    //             defaultNavigationOptions: {
    //                 headerStyle: {
    //                     backgroundColor: colors.bgMain,
    //                 },
    //             },
    //         }
    //     );

    //     const ScheduleStackNavigator = createStackNavigator(
    //         {
    //             OpenCreateMenu: {
    //                 screen: OpenCreateMenu,
    //                 navigationOptions: ({ navigation }) => {
    //                     return {
    //                         headerLeft: (
    //                             <Ionicons
    //                                 name='ios-menu'
    //                                 size={30}
    //                                 color={colors.logoColor}
    //                                 onPress={() => navigation.openDrawer()}
    //                                 style={{ marginLeft: 10 }}
    //                             />
    //                         ),
    //                     };
    //                 },
    //             },
    //             CreateEditSchedule,
    //             OpenFileList,
    //             ReadSchedule,
    //         },
    //         {
    //             defaultNavigationOptions: {
    //                 headerStyle: {
    //                     backgroundColor: colors.bgMain,
    //                 },
    //             },
    //         }
    //     );

    //     const AppDrawerNavigator = createDrawerNavigator(
    //         {
    //             HomeStackNavigator: {
    //                 screen: HomeStackNavigator,
    //                 navigationOptions: {
    //                     title: 'Home',
    //                     drawerIcon: () => <Ionicons name='ios-home' size={24} />,
    //                 },
    //             },
    //             SettingsScreen: {
    //                 screen: SettingsScreen,
    //                 navigationOptions: {
    //                     title: 'Settings',
    //                     drawerIcon: () => (
    //                         <Ionicons name='ios-settings' size={24} />
    //                     ),
    //                 },
    //             },
    //         },
    //         {
    //             contentComponent: CustomDrawerComponent,
    //         }
    //     );

    //     const AppSwitchNavigator = createSwitchNavigator({
    //         LoadingScreen,
    //         LoginStackNavigator,
    //         AppDrawerNavigator,
    // });

    // const AppContainer = createAppContainer(AppSwitchNavigator);

    // const [loading, setLoading] = useState(true);
    // const [user, setUser] = useState(null);

    if (fontsLoaded) {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name='Welcome' component={WelcomeScreen} />
                    <Stack.Screen name='LoginScreen' component={LoginScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    } else {
        return null;
    }

    //     <NavigationContainer>
    //         <LoginStackNavigator.Navigator>
    //             {user ? (
    //                 <LoginStackNavigator.Screen name='Open or Create Schedule'>
    //                     {(props) => (
    //                         <OpenCreateMenu {...props} extraData={user} />
    //                     )}
    //                 </LoginStackNavigator.Screen>
    //             ) : (
    //                 <>
    //                     <LoginStackNavigator.Screen
    //                         name='Login'
    //                         component={LoginScreen}
    //                     />
    //                 </>
    //             )}
    //         </LoginStackNavigator.Navigator>
    //     </NavigationContainer>
    // );
};

export default App;
