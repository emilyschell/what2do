import React, { useContext, useState, useEffect } from 'react';
import {
    View,
    FlatList,
    Text,
    TextInput,
    SafeAreaView,
    TouchableOpacity,
    Modal,
    Pressable,
    ActivityIndicator,
} from 'react-native';
import { styles, colors } from '../../../assets/styles';
import { ScheduleContext } from '../../contexts/ScheduleContext';
import CustomSmallButton from '../../../components/CustomSmallButton';
import CreateEditTask from '../../../components/CreateEditTask';
import { Ionicons } from '@expo/vector-icons';
import {
    collection,
    addDoc,
    setDoc,
    doc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
} from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { AuthContext } from '../../contexts/AuthContext';
import { DismissKeyboard } from '../../../helpers/dismissKeyboard';

const EditSchedule = ({ navigation }) => {
    const { currentUser } = useContext(AuthContext);
    const { setType, type, sid } = useContext(ScheduleContext);

    const [title, setTitle] = useState('');
    const [tasks, setTasks] = useState([]);
    const [modalShown, setModalShown] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const addTask = (text, imageUrl) => {
        if (text.length || imageUrl.length) {
            const newTask = {
                text: text,
                image: imageUrl,
            };
            setTasks([...tasks, newTask]);
        } else {
            switch (type) {
                case 'text':
                    alert('Please enter a task to add');
                    break;
                case 'photo':
                    alert('Please select a photo to add');
                    break;
                case 'hybrid':
                    alert('Please add text or a photo to add');
            }
        }
    };

    const updateSchedule = async () => {
        const newSchedule = {
            title,
            type,
        };
        if (tasks.length && title) {
            // Update title
            try {
                const scheduleRef = doc(
                    db,
                    'users',
                    currentUser.uid,
                    'schedules',
                    sid
                );
                await updateDoc(scheduleRef, { title });

                // Add new tasks, in loops with setTimeout due to rate limits
                const tasksColl = collection(
                    db,
                    'users',
                    currentUser.uid,
                    'schedules',
                    sid,
                    'tasks'
                );

                const timeouts = [];
                for (const task of tasks) {
                    timeouts.push(setTimeout(addDoc(tasksColl, task), 1000));
                }
                for (const to of timeouts) {
                    clearTimeout(to);
                }

                // Assign task IDs to newly created tasks
                const tasksSnap = await getDocs(tasksColl);
                const taskIds = [];
                tasksSnap.forEach((task) => taskIds.push(task.id));
                const timeouts2 = [];
                for (const taskId of taskIds) {
                    timeouts2.push(
                        setTimeout(
                            setDoc(
                                doc(tasksColl, taskId),
                                { tid: taskId },
                                { merge: true }
                            ),
                            1000
                        )
                    );
                }
                for (const to2 of timeouts2) {
                    clearTimeout(to2);
                }

                navigation.navigate('ReadSchedule');
            } catch (error) {
                console.log('Error in updating schedule: ', error);
            }
        } else {
            alert('Please enter a title and at least 1 task.');
        }
    };

    const deleteFirebaseTask = async (tid) => {
        const taskRef = doc(
            db,
            'users',
            currentUser.uid,
            'schedules',
            sid,
            'tasks',
            tid
        );
        await deleteDoc(taskRef);
        const newTasks = tasks.filter((task) => {
            task.tid !== tid || !task.hasOwnProperty('tid');
        });
        setTasks(newTasks);
    };

    const deleteLocalTask = (str) => {
        if (type === 'text') {
            const newTasks = tasks.filter((task) => {
                task.text !== str;
            });
            setTasks(newTasks);
        } else {
            const newTasks = tasks.filter((task) => {
                task.image !== str;
            });
            setTasks(newTasks);
        }
    };

    const onPressDelete = (item) => {
        setDeleteItem(item);
        setModalShown(true);
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
                    style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <View style={styles.modal}>
                        <Text style={styles.mediumText}>
                            Cannot undo delete, do you want to delete task?
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
                                    item.hasOwnProperty('tid')
                                        ? deleteFirebaseTask(deleteItem.tid)
                                        : deleteLocalTask(
                                              deleteItem.text ||
                                                  deleteItem.image
                                          );
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

    const deleteSchedule = async () => {
        await deleteDoc(doc(db, 'users', currentUser.uid, 'schedules', sid));
        navigation.navigate('OpenCreateMenu');
    };

    const renderTask = ({ item, index }) => {
        return (
            <View key={index} style={styles.taskContainer}>
                <Text style={styles.taskText}>{item.text}</Text>
                <TouchableOpacity
                    style={{ marginLeft: 20 }}
                    onPress={() => onPressDelete(item)}>
                    <Ionicons name='ios-trash-outline' size={24} color='red' />
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large' color={colors.iconColor} />
            </View>
        );
    } else {
        return (
            <DismissKeyboard>
                <View style={[styles.container, { paddingTop: 0 }]}>
                    <SafeAreaView />

                    {/* Schedule View */}
                    <View style={styles.editScheduleView}>
                        {/* Delete Button */}
                        <TouchableOpacity
                            style={{ margin: 10 }}
                            onPress={() => deleteSchedule()}>
                            <Ionicons
                                name='ios-trash-outline'
                                size={24}
                                color='red'
                            />
                        </TouchableOpacity>

                        {/* Title Field */}
                        <TextInput
                            style={[
                                styles.taskTextInput,
                                { marginRight: 0, textAlign: 'center' },
                            ]}
                            placeholder={title}
                            placeholderTextColor={colors.textInputPlaceholder}
                            value={title}
                            onChangeText={(val) => setTitle(val)}
                        />

                        {ConfirmDeleteModal}

                        {/* Task List */}
                        <View style={styles.taskList}>
                            {tasks.length > 0 ? (
                                <FlatList
                                    data={tasks}
                                    renderItem={renderTask}
                                />
                            ) : null}
                        </View>
                        {/* New Task Input */}
                        <CreateEditTask addTask={addTask} />
                    </View>

                    {/* Small Bottom Buttons */}
                    <CustomSmallButton
                        position='left'
                        onPress={() => {
                            navigation.goBack();
                        }}>
                        <Text style={styles.smallButtonText}>Cancel</Text>
                    </CustomSmallButton>
                    <CustomSmallButton
                        position='right'
                        onPress={() => {
                            updateSchedule();
                        }}>
                        <Text style={styles.smallButtonText}>Save</Text>
                    </CustomSmallButton>
                </View>
            </DismissKeyboard>
        );
    }
};

export default EditSchedule;