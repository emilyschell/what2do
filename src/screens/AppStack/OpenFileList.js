import { useContext, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import { styles, colors } from '../../../assets/styles';
import CustomSmallButton from '../../../components/CustomSmallButton';
import { AuthContext } from '../../contexts/AuthContext';
import { db } from '../../firebase/firebase';
import { doc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import FileItem from '../../../components/FileItem';

const OpenFileList = ({ navigation }) => {
    const { currentUser } = useContext(AuthContext);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSchedules = async () => {
            const userRef = doc(db, 'users', currentUser.uid);
            try {
                const scheduleColl = collection(userRef, 'schedules');
                const scheduleSnap = await getDocs(scheduleColl);
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

    const deleteSchedule = async (sid) => {
        await deleteDoc(doc(db, 'users', currentUser.uid, 'schedules', sid));
        const newSchedules = schedules.filter(
            (schedule) => schedule.sid !== sid
        );
        setSchedules(newSchedules);
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
                <Text style={styles.largeText}>Schedules</Text>
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
                <Text style={styles.largeText}>Schedules</Text>
                <View style={styles.fileList}>
                    <FlatList
                        data={schedules}
                        renderItem={({ item }) => {
                            return (
                                <FileItem
                                    sid={item.sid}
                                    title={item.title}
                                    deleteSched={deleteSchedule}
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

export default OpenFileList;
