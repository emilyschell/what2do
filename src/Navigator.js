import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import WelcomeScreen from './screens/AuthStack/WelcomeScreen';
import LoginScreen from './screens/AuthStack/LoginScreen';
import SignUpScreen from './screens/AuthStack/SignUpScreen';
import OpenCreateMenu from './screens/ScheduleStack/OpenCreateMenu';
import CreateSchedule from './screens/ScheduleStack/CreateSchedule';
import ScheduleTypeMenu from './screens/ScheduleStack/ScheduleTypeMenu';
import OpenFileList from './screens/ScheduleStack/OpenFileList';
import ReadSchedule from './screens/ScheduleStack/ReadSchedule';
import EditSchedule from './screens/ScheduleStack/EditSchedule';
import LinkScheduleMenu from './screens/ScheduleStack/LinkScheduleMenu';
import Home from './screens/DrawerNavigator/Home';
import ChooseToken from './screens/GoalStack/ChooseToken';
import CreateGoal from './screens/GoalStack/CreateGoal';
import EditGoal from './screens/GoalStack/EditGoal';
import OpenCreateGoal from './screens/GoalStack/OpenCreateGoal';
import OpenGoal from './screens/GoalStack/OpenGoal';
import ReadGoal from './screens/GoalStack/ReadGoal';
import SettingsScreen from './screens/DrawerNavigator/SettingsScreen';
import CustomDrawerNavigator from './screens/DrawerNavigator/CustomDrawerComponent';
import { AuthContext } from './contexts/AuthContext';
import { useContext } from 'react';
import { ScheduleProvider } from './contexts/ScheduleContext';
import { styles, colors } from './assets/styles';
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

    const GoalStack = () => {
        return (
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}>
                <Stack.Screen
                    name='OpenCreateGoal'
                    component={OpenCreateGoal}
                />
                <Stack.Screen name='CreateGoal' component={CreateGoal} />
                <Stack.Screen name='ChooseToken' component={ChooseToken} />
                <Stack.Screen name='OpenGoal' component={OpenGoal} />
                <Stack.Screen name='ReadGoal' component={ReadGoal} />
                <Stack.Screen name='EditGoal' component={EditGoal} />
            </Stack.Navigator>
        );
    };

    const DrawerStack = () => {
        return (
            <Drawer.Navigator
                useLegacyImplementation={true}
                initialRouteName='Home'
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
                    name='Home'
                    component={Home}
                    options={{
                        drawerIcon: () => <Ionicons name='home' size={24} />,
                    }}
                />
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
                    name='Goals'
                    component={GoalStack}
                    options={{
                        drawerIcon: () => <Octicons name='star' size={24} />,
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
