import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './AuthStack/WelcomeScreen';
import LoginScreen from './AuthStack/LoginScreen';
import SignUpScreen from './AuthStack/SignUpScreen';
import OpenCreateMenu from './AppStack/OpenCreateMenu';
import CreateEditSchedule from './AppStack/CreateEditSchedule';
import ScheduleTypeMenu from './AppStack/ScheduleTypeMenu';
import OpenFileList from './AppStack/OpenFileList';
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';
import { colors } from '../../assets/styles';

const Navigator = () => {
    const { currentUser } = useContext(AuthContext);
    const Stack = createStackNavigator();

    const AuthStack = () => {
        return (
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}>
                <Stack.Screen name='Welcome' component={WelcomeScreen} />
                <Stack.Screen name='LoginScreen' component={LoginScreen} />
                <Stack.Screen name='SignUpScreen' component={SignUpScreen} />
            </Stack.Navigator>
        );
    };

    const AppStack = () => {
        return (
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
                <Stack.Screen name='OpenFileList' component={OpenFileList} />
            </Stack.Navigator>
        );
    };

    return currentUser ? <AppStack /> : <AuthStack />;
};

export default Navigator;
