import { useContext, useState, useEffect } from 'react';
import { Text, View, ActivityIndicator, FlatList } from 'react-native';
import { styles, colors } from '../../../assets/styles';
import { ScheduleContext } from '../../contexts/ScheduleContext';
import CustomSmallButton from '../../../components/CustomSmallButton';
import { AuthContext } from '../../contexts/AuthContext';
import { db } from '../../firebase/firebase';
import {
    doc,
    collection,
    getDocs,
    setDoc,
    query,
    where,
} from 'firebase/firestore';
import FileItem from '../../../components/FileItem';

const LinkScheduleMenu = ({ navigation }) => {
    const { tid, parentSid } = useContext(ScheduleContext);
    const { currentUser } = useContext(AuthContext);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSchedules = async () => {
            const userRef = doc(db, 'users', currentUser.uid);
            try {
                const scheduleColl = collection(userRef, 'schedules');
                const scheduleSnap = await getDocs(
                    query(scheduleColl, where('sid', '!=', parentSid))
                );
                const newSchedules = [];
                scheduleSnap.forEach((schedule) =>
                    newSchedules.push(schedule.data())
                );
                setSchedules(newSchedules);
                setLoading(false);
            } catch (error) {
                console.log('Error in getting schedules: ', { error });
            }
        };
        getSchedules();
    }, []);

    const linkSchedule = async (sid) => {
        console.log('sid from LSM: ', sid);
        console.log('parentSid from LSM: ', parentSid);
        console.log('tid from LSM: ', tid);
        try {
            const parentTaskRef = doc(
                db,
                'users',
                currentUser.uid,
                'schedules',
                parentSid,
                'tasks',
                tid
            );
            await setDoc(parentTaskRef, { subSchedule: sid }, { merge: true });
            alert('Schedules successfully linked!');
            navigation.navigate('EditSchedule');
        } catch (error) {
            console.log('Error adding linked schedule: ', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large' color={colors.iconColor} />
            </View>
        );
    } else if (!schedules.length) {
        return (
            <View style={[styles.container, { justifyContent: 'flex-start' }]}>
                <Text style={styles.largeText}>Link Schedule</Text>
                <Text style={styles.mediumText}>
                    You have no schedules to show.
                </Text>
                <CustomSmallButton
                    position='left'
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Text style={styles.smallButtonText}>Back</Text>
                </CustomSmallButton>
            </View>
        );
    } else {
        return (
            <View style={[styles.container, { justifyContent: 'flex-start' }]}>
                <Text style={styles.largeText}>Link Sub-Schedule</Text>
                <View style={styles.fileList}>
                    <FlatList
                        data={schedules}
                        renderItem={({ item }) => {
                            return (
                                <FileItem
                                    sid={item.sid}
                                    title={item.title}
                                    onPressCallback={linkSchedule}
                                    showDelete={false}
                                    showEdit={false}
                                />
                            );
                        }}
                    />
                </View>
                <CustomSmallButton
                    position='left'
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Text style={styles.smallButtonText}>Back</Text>
                </CustomSmallButton>
            </View>
        );
    }
};

export default LinkScheduleMenu;
