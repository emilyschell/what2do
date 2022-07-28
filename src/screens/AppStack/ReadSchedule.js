import { useEffect, useState } from 'react';
import { styles, colors } from '../../../assets/styles';
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
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import ScheduleTask from '../../../components/ScheduleTask';

const ReadSchedule = ({ navigation }) => {
    const { sid, setType } = useContext(ScheduleContext);
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const tasks = [];

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
                        const tasksSnap = await getDocs(tasksColl);
                        tasksSnap.forEach((task) => tasks.push(task.data()));
                        if (tasks.length) {
                            setLoading(false);
                            console.log(tasks);
                        }
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

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large' color={colors.iconColor} />
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <SafeAreaView />
                <View style={styles.scheduleView}>
                    <TouchableOpacity
                        style={{ display: 'absolute', right: 10, top: 20 }}
                        onPress={() => navigation.navigate('OpenCreateMenu')}>
                        <FontAwesome name='close' size={24} />
                    </TouchableOpacity>
                    <Text style={styles.largeText}>{title}</Text>
                    <FlatList
                        data={tasks}
                        renderItem={({ item }) => {
                            return <Text>{item.text}</Text>;
                        }}
                    />
                </View>
            </View>
        );
    }
};

export default ReadSchedule;
