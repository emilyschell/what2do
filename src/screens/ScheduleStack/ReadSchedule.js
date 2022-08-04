import { useEffect, useState } from 'react';
import { styles, colors } from '../../assets/styles';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import { ScheduleContext } from '../../contexts/ScheduleContext';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import { db } from '../../firebase/firebase';
import {
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    orderBy,
} from 'firebase/firestore';
import ScheduleTask from '../../components/ScheduleTask';

const ReadSchedule = ({ navigation }) => {
    const {
        sid,
        setType,
        setScheduleInfo,
        parentSidStack,
        parentTypeStack,
        setLinkedScheduleInfo,
    } = useContext(ScheduleContext);
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const getSchedule = async () => {
            const scheduleRef = doc(
                db,
                'users',
                currentUser.uid,
                'schedules',
                sid
            );
            try {
                const schedule = await getDoc(scheduleRef);
                if (schedule.exists()) {
                    const scheduleData = schedule.data();
                    setType(scheduleData.type);
                    setTitle(scheduleData.title);
                    try {
                        const tasksColl = collection(
                            db,
                            'users',
                            currentUser.uid,
                            'schedules',
                            sid,
                            'tasks'
                        );
                        const tasksSnap = await getDocs(
                            query(tasksColl, orderBy('order'))
                        );
                        const newTasks = [];
                        tasksSnap.forEach((task) => newTasks.push(task.data()));
                        setTasks(newTasks);
                        setLoading(false);
                    } catch (error) {
                        console.log('Error in getting tasks: ', error);
                    }
                } else {
                    console.log('No such schedule!');
                }
            } catch (error) {
                console.log('Error in getting schedule: ', { error });
            }
        };
        getSchedule();
    }, []);

    const closeSchedule = () => {
        if (parentSidStack.length && parentTypeStack.length) {
            setScheduleInfo({
                type: parentTypeStack[parentTypeStack.length - 1],
                sid: parentSidStack[parentSidStack.length - 1],
            });
            const newParentSidStack = [...parentSidStack];
            newParentSidStack.pop();
            const newParentTypeStack = [...parentTypeStack];
            newParentTypeStack.pop();
            setLinkedScheduleInfo({
                parentSidStack: newParentSidStack,
                parentTypeStack: newParentTypeStack,
            });
            navigation.pop();
        } else {
            navigation.navigate('OpenCreateMenu');
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large' color={colors.iconColor} />
            </View>
        );
    } else {
        return (
            <View style={[styles.container, { paddingTop: 0 }]}>
                <SafeAreaView />
                <View style={styles.scheduleView}>
                    <View
                        style={{
                            alignSelf: 'flex-end',
                            position: 'absolute',
                            right: 10,
                            top: 10,
                            width: 20,
                            zIndex: 1000,
                        }}>
                        <TouchableOpacity onPress={closeSchedule}>
                            <FontAwesome name='close' size={24} />
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            width: '100%',
                            alignItems: 'center',
                            justifySelf: 'flex-start',
                        }}>
                        <Text style={[styles.largeText, { margin: 0 }]}>
                            {title}
                        </Text>
                    </View>
                    <FlatList
                        data={tasks}
                        renderItem={({ item }) => <ScheduleTask task={item} />}
                    />
                </View>
            </View>
        );
    }
};

export default ReadSchedule;
