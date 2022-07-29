import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './AuthStack/WelcomeScreen';
import LoginScreen from './AuthStack/LoginScreen';
import SignUpScreen from './AuthStack/SignUpScreen';
import OpenCreateMenu from './AppStack/OpenCreateMenu';
import CreateSchedule from './AppStack/CreateSchedule';
import ScheduleTypeMenu from './AppStack/ScheduleTypeMenu';
import OpenFileList from './AppStack/OpenFileList';
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';
import { ScheduleProvider } from '../contexts/ScheduleContext';
import ReadSchedule from './AppStack/ReadSchedule';
import EditSchedule from './AppStack/EditSchedule';

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
            <ScheduleProvider>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                    }}>
                    <Stack.Screen
                        name='OpenCreateMenu'
                        component={OpenCreateMenu}
                    />
                    <Stack.Screen
                        name='CreateSchedule'
                        component={CreateSchedule}
                    />
                    <Stack.Screen
                        name='ScheduleTypeMenu'
                        component={ScheduleTypeMenu}
                    />
                    <Stack.Screen
                        name='OpenFileList'
                        component={OpenFileList}
                    />
                    <Stack.Screen
                        name='ReadSchedule'
                        component={ReadSchedule}
                    />
                    <Stack.Screen
                        name='EditSchedule'
                        component={EditSchedule}
                    />
                </Stack.Navigator>
            </ScheduleProvider>
        );
    };

    return currentUser ? <AppStack /> : <AuthStack />;
};

export default Navigator;
