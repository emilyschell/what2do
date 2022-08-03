import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import WelcomeScreen from './AuthStack/WelcomeScreen';
import LoginScreen from './AuthStack/LoginScreen';
import SignUpScreen from './AuthStack/SignUpScreen';
import OpenCreateMenu from './AppStack/OpenCreateMenu';
import CreateSchedule from './AppStack/CreateSchedule';
import ScheduleTypeMenu from './AppStack/ScheduleTypeMenu';
import OpenFileList from './AppStack/OpenFileList';
import ReadSchedule from './AppStack/ReadSchedule';
import EditSchedule from './AppStack/EditSchedule';
import LinkScheduleMenu from './AppStack/LinkScheduleMenu';
import SettingsScreen from './DrawerNavigator/SettingsScreen';
import CustomDrawerNavigator from './DrawerNavigator/CustomDrawerComponent';
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';
import { ScheduleProvider } from '../contexts/ScheduleContext';
import { styles, colors } from '../../assets/styles';
import { Octicons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const Navigator = () => {
    const { currentUser } = useContext(AuthContext);
    const Stack = createStackNavigator();
    const Drawer = createDrawerNavigator();

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

    const ScheduleStack = () => {
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
                    <Stack.Screen
                        name='LinkScheduleMenu'
                        component={LinkScheduleMenu}
                    />
                </Stack.Navigator>
            </ScheduleProvider>
        );
    };

    const DrawerStack = () => {
        return (
            <Drawer.Navigator
                useLegacyImplementation={true}
                initialRouteName='Schedules'
                drawerContent={(props) => <CustomDrawerNavigator {...props} />}
                screenOptions={{
                    headerShown: false,
                    drawerActiveBackgroundColor: colors.bgMain,
                    drawerActiveTintColor: colors.bgSuccess,
                    drawerInactiveTintColor: colors.textColorDefault,
                    drawerLabelStyle: { fontFamily: 'Roboto', fontSize: 28 },
                    drawerItemStyle: styles.drawerButton,
                }}>
                <Drawer.Screen
                    name='Schedules'
                    component={ScheduleStack}
                    options={{
                        drawerIcon: () => (
                            <Octicons name='checklist' size={24} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name='Settings'
                    component={SettingsScreen}
                    options={{
                        drawerIcon: () => (
                            <Ionicons name='settings-outline' size={24} />
                        ),
                    }}
                />
            </Drawer.Navigator>
        );
    };

    return currentUser ? <DrawerStack /> : <AuthStack />;
};

export default Navigator;
