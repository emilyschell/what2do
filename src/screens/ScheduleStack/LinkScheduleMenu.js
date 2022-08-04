import { useContext, useState, useEffect } from 'react';
import { Text, View, ActivityIndicator, FlatList } from 'react-native';
import { styles, colors } from '../../assets/styles';
import CustomSmallButton from '../../components/CustomSmallButton';
import { AuthContext } from '../../contexts/AuthContext';
import { db } from '../../firebase/firebase';
import { doc, collection, getDocs, query, where } from 'firebase/firestore';
import FileItem from '../../components/FileItem';
import { ScheduleContext } from '../../contexts/ScheduleContext';

const LinkScheduleMenu = ({ navigation, route }) => {
    const { currentUser } = useContext(AuthContext);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentSubschedule, parentSid } = route.params;
    const { scheduleLinkingInfo, setScheduleLinkingInfo } =
        useContext(ScheduleContext);

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

    const linkSchedule = (sid) => {
        setScheduleLinkingInfo({ ...scheduleLinkingInfo, schedToLink: sid });
        navigation.navigate('EditSchedule');
    };

    const removeSubschedule = () => {
        setScheduleLinkingInfo({ ...scheduleLinkingInfo, schedToLink: null });
        navigation.navigate('EditSchedule');
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
                <Text style={styles.largeText}>Link Schedule</Text>
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
                                    currentSubschedule={currentSubschedule}
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
                    <Text style={styles.smallButtonText}>Cancel</Text>
                </CustomSmallButton>
                <CustomSmallButton
                    style={{ backgroundColor: colors.bgError }}
                    position='right'
                    onPress={removeSubschedule}>
                    <Text
                        style={[
                            styles.smallButtonText,
                            { textAlign: 'center' },
                        ]}>
                        Remove Link
                    </Text>
                </CustomSmallButton>
            </View>
        );
    }
};

export default LinkScheduleMenu;
