import { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
} from 'react-native';
import { styles, colors } from '../../../assets/styles';
import CustomSmallButton from '../../../components/CustomSmallButton';
import { AuthContext } from '../../contexts/AuthContext';
import { db } from '../../firebase/firebase';
import { doc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import FileItem from '../../../components/FileItem';
import { ScheduleContext } from '../../contexts/ScheduleContext';

const OpenFileList = ({ navigation }) => {
    const { currentUser } = useContext(AuthContext);
    const { setSid } = useContext(ScheduleContext);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalShown, setModalShown] = useState(false);
    const [sidToDelete, setSidToDelete] = useState(null);

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

    const onPressDelete = (sid) => {
        setSidToDelete(sid);
        setModalShown(true);
    };

    const deleteSchedule = async () => {
        await deleteDoc(
            doc(db, 'users', currentUser.uid, 'schedules', sidToDelete)
        );
        const newSchedules = schedules.filter(
            (schedule) => schedule.sid !== sidToDelete
        );
        setSchedules(newSchedules);
    };

    const selectSchedule = (sid) => {
        setSid(sid);
        navigation.navigate('ReadSchedule');
    };

    const ConfirmDeleteModal = (
        <Modal visible={modalShown} transparent={true}>
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <View style={styles.modal}>
                        <Text style={styles.mediumText}>
                            Cannot undo delete, do you want to delete schedule?
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                width: '100%',
                            }}>
                            <Pressable
                                style={[styles.smallButtons, { margin: 10 }]}
                                onPress={() => setModalShown(false)}
                                title='Cancel'>
                                <Text style={styles.smallButtonText}>
                                    Cancel
                                </Text>
                            </Pressable>
                            <Pressable
                                style={[styles.smallButtons, { margin: 10 }]}
                                onPress={() => {
                                    deleteSchedule(sidToDelete);
                                    setModalShown(false);
                                }}>
                                <Text style={styles.smallButtonText}>
                                    Delete
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );

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
                {ConfirmDeleteModal}
                <View style={styles.fileList}>
                    <FlatList
                        data={schedules}
                        renderItem={({ item }) => {
                            return (
                                <FileItem
                                    sid={item.sid}
                                    title={item.title}
                                    onPressCallback={selectSchedule}
                                    showDelete={true}
                                    deleteSched={onPressDelete}
                                    showEdit={true}
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
