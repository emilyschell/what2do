import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { styles, colors } from './assets/styles';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import Navigator from './src/screens/Navigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { decode, encode } from 'base-64';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

const App = () => {
    if (!global.btoa) {
        global.btoa = encode;
    }

    if (!global.atob) {
        global.atob = decode;
    }

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
            <ActionSheetProvider>
                <AuthProvider>
                    <NavigationContainer>
                        <Navigator />
                    </NavigationContainer>
                </AuthProvider>
            </ActionSheetProvider>
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
