import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './src/screens/AppSwitchNavigator/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import LoadingScreen from './src/screens/AppSwitchNavigator/LoadingScreen';
import OpenCreateMenu from './src/screens/OpenCreateMenu';
import { colors } from './assets/styles';

// import { decode, encode } from 'base-64';

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
                Roboto: require('./assets/fonts/Roboto.ttf'),
                PermanentMarker: require('./assets/fonts/PermanentMarker.ttf'),
            });
            setFontsLoaded(true);
        }
        loadFonts();
    }, []);

    if (fontsLoaded) {
        return (
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerTitle: '',
                        headerStyle: {
                            backgroundColor: colors.bgMain,
                        },
                    }}>
                    <Stack.Screen name='Welcome' component={WelcomeScreen} />
                    <Stack.Screen name='LoginScreen' component={LoginScreen} />
                    <Stack.Screen
                        name='LoadingScreen'
                        component={LoadingScreen}
                    />

                    <Stack.Screen
                        name='OpenCreateMenu'
                        component={OpenCreateMenu}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        );
    } else {
        return null;
    }
};

export default App;

//     const AppSwitchNavigator = createSwitchNavigator({
//         LoadingScreen,
//         LoginStackNavigator,
//         AppDrawerNavigator,
// });

// const AppContainer = createAppContainer(AppSwitchNavigator);

// const [loading, setLoading] = useState(true);
// const [user, setUser] = useState(null);

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
