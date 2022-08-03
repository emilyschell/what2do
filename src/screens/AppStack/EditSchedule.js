import React, { useContext, useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    SafeAreaView,
    TouchableOpacity,
    Modal,
    Pressable,
    ActivityIndicator,
    Image,
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { styles, colors } from '../../../assets/styles';
import { ScheduleContext } from '../../contexts/ScheduleContext';
import CustomSmallButton from '../../../components/CustomSmallButton';
import CreateTask from '../../../components/CreateTask';
import { Ionicons } from '@expo/vector-icons';
import {
    collection,
    addDoc,
    doc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
} from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { AuthContext } from '../../contexts/AuthContext';
import { DismissKeyboard } from '../../../helpers/dismissKeyboard';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import CustomModal from '../../../components/CustomModal';

const EditSchedule = ({ navigation }) => {
    const { currentUser } = useContext(AuthContext);
    const { setType, type, sid } = useContext(ScheduleContext);

    const [title, setTitle] = useState('');
    const [tasks, setTasks] = useState([]);
    const [deleteModalShown, setDeleteModalShown] = useState(false);
    const [discardModalShown, setDiscardModalShown] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);
    const [deleteType, setDeleteType] = useState(null);
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
                        const tasksSnap = await getDocs(
                            query(tasksColl, orderBy('order'))
                        );
                        const newTasks = [];
                        tasksSnap.forEach((task) =>
                            newTasks.push({ ...task.data(), tid: task.id })
                        );
                        setTasks(newTasks);
                        setLoading(false);
                    } catch (error) {
                        console.log('Error in getting tasks: ', error);
                    }
                } else {
                    console.log('No such schedule!');
                }
            } catch (error) {
                console.log('Error in getting schedule: ', error);
            }
        };
        getSchedule();
    }, []);

    const addTask = (text, imageUrl) => {
        if (text || imageUrl) {
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
                    alert('Please add text and a photo to add');
            }
        }
    };

    const linkTask = (tid, ssid) => {
        const newTasks = tasks.map((task) => {
            if (task.tid === tid) {
                return { ...task, subSchedule: ssid };
            } else {
                return task;
            }
        });
        setTasks(newTasks);
    };

    const updateSchedule = async () => {
        setLoading(true);

        // assign order to task objects
        tasks.forEach((task) => {
            task.order = tasks.indexOf(task);
        });

        if (title) {
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

                //delete all tasks from firebase, in loops with timeouts due to rate limits
                try {
                    const tasksColl = collection(
                        db,
                        'users',
                        currentUser.uid,
                        'schedules',
                        sid,
                        'tasks'
                    );
                    const timeouts = [];
                    const taskSnap = await getDocs(tasksColl);
                    taskSnap.forEach((task) => {
                        timeouts.push(
                            setTimeout(deleteDoc(doc(tasksColl, task.id)), 1000)
                        );
                    });
                    timeouts.forEach((to) => clearTimeout(to));

                    //send all new tasks to firebase, in loops with setTimeout due to rate limits
                    if (tasks.length) {
                        const tasksColl = collection(
                            db,
                            'users',
                            currentUser.uid,
                            'schedules',
                            sid,
                            'tasks'
                        );

                        const timeouts2 = [];
                        for (const task of tasks) {
                            timeouts2.push(
                                setTimeout(addDoc(tasksColl, task), 1000)
                            );
                        }
                        for (const to2 of timeouts2) {
                            clearTimeout(to2);
                        }

                        setLoading(false);
                        navigation.navigate('ReadSchedule');
                    }
                } catch (error) {
                    console.log('error deleting tasks from firestore: ', error);
                }
            } catch (error) {
                console.log('Error in updating schedule: ', error);
            }
        } else {
            alert('Please enter a title.');
        }
    };

    const deleteTask = () => {
        if (deleteItem.hasOwnProperty('tid')) {
            const newTasks = tasks.filter(
                (task) => task.tid !== deleteItem.tid
            );
            setTasks(newTasks);
        } else if (type === 'text') {
            const newTasks = tasks.filter(
                (task) => task.text !== deleteItem.text
            );
            setTasks(newTasks);
        } else {
            const newTasks = tasks.filter(
                (task) => task.image !== deleteItem.image
            );
            setTasks(newTasks);
        }
    };

    const onPressDelete = (toDelete) => {
        setDeleteItem(toDelete);
        setDeleteModalShown(true);
    };

    const ConfirmDeleteModal = (
        <CustomModal
            modalShown={deleteModalShown}
            msg={`Cannot undo delete, do you want to delete ${deleteType}?`}
            lCallback={() => setDeleteModalShown(false)}
            lText='Cancel'
            rCallback={
                deleteType === 'task'
                    ? () => {
                          deleteTask();
                          setDeleteModalShown(false);
                      }
                    : () => {
                          deleteSchedule();
                          setDeleteModalShown(false);
                      }
            }
            rText='Delete'
        />
    );

    const ConfirmDiscardModal = (
        <CustomModal
            modalShown={discardModalShown}
            msg='Are you sure you want to discard changes?'
            rCallback={() => navigation.goBack()}
            rText='Discard Changes'
            lCallback={() => setDiscardModalShown(false)}
            lText='Cancel'
        />
    );

    const deleteSchedule = async () => {
        await deleteDoc(doc(db, 'users', currentUser.uid, 'schedules', sid));
        navigation.navigate('OpenCreateMenu');
    };

    const openLinkedScheduleMenu = (tid, ss) => {
        navigation.navigate('LinkScheduleMenu', {
            currentSubschedule: ss,
            tid,
            parentSid: sid,
            linkTask,
        });
    };

    const renderTask = ({ item, drag, isActive }) => {
        switch (type) {
            case 'text':
                return (
                    <TouchableOpacity
                        onLongPress={drag}
                        style={isActive ? styles.activeDragItem : null}>
                        <View style={styles.taskContainer}>
                            <Text style={[styles.taskText, { marginLeft: 10 }]}>
                                {item.text}
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setDeleteType('task');
                                        onPressDelete(item);
                                    }}>
                                    <Ionicons
                                        name='ios-trash-outline'
                                        size={24}
                                        color='red'
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() =>
                                        openLinkedScheduleMenu(
                                            item.tid,
                                            item.subSchedule
                                        )
                                    }>
                                    <Entypo
                                        name='link'
                                        size={24}
                                        color={
                                            item.subSchedule
                                                ? colors.bgSuccess
                                                : 'black'
                                        }
                                    />
                                </TouchableOpacity>
                                <FontAwesome
                                    name='hand-paper-o'
                                    size={24}
                                    style={{ marginLeft: 20 }}
                                />
                                <Text style={styles.smallButtonText}>
                                    {tasks.indexOf(item) + 1}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            case 'picture':
                return (
                    <TouchableOpacity
                        onLongPress={drag}
                        style={isActive ? styles.activeDragItem : null}>
                        <View style={styles.photoTaskContainer}>
                            <View style={[styles.imageContainer]}>
                                <Image
                                    style={styles.image}
                                    source={{ uri: item.image }}
                                    resizeMode='contain'
                                />
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setDeleteType('task');
                                        onPressDelete(item);
                                    }}>
                                    <Ionicons
                                        name='ios-trash-outline'
                                        size={24}
                                        color='red'
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() =>
                                        openLinkedScheduleMenu(
                                            item.tid,
                                            item.subSchedule
                                        )
                                    }>
                                    <Entypo
                                        name='link'
                                        size={24}
                                        color={
                                            item.subSchedule
                                                ? colors.bgSuccess
                                                : 'black'
                                        }
                                    />
                                </TouchableOpacity>
                                <FontAwesome
                                    name='hand-paper-o'
                                    size={24}
                                    style={{ marginLeft: 20 }}
                                />
                                <Text style={styles.smallButtonText}>
                                    {tasks.indexOf(item) + 1}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            case 'hybrid':
                return (
                    <TouchableOpacity
                        onLongPress={drag}
                        style={isActive ? styles.activeDragItem : null}>
                        <View
                            style={[
                                styles.taskContainer,
                                { justifyContent: 'center' },
                            ]}>
                            <View
                                style={{
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}>
                                <View style={styles.imageContainer}>
                                    <Image
                                        style={styles.image}
                                        source={{ uri: item.image }}
                                        resizeMode='contain'
                                    />
                                </View>
                                <Text style={styles.taskText}>{item.text}</Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setDeleteType('task');
                                        onPressDelete(item);
                                    }}>
                                    <Ionicons
                                        name='ios-trash-outline'
                                        size={24}
                                        color='red'
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() =>
                                        openLinkedScheduleMenu(
                                            item.tid,
                                            item.subSchedule
                                        )
                                    }>
                                    <Entypo
                                        name='link'
                                        size={24}
                                        color={
                                            item.subSchedule
                                                ? colors.bgSuccess
                                                : 'black'
                                        }
                                    />
                                </TouchableOpacity>
                                <FontAwesome
                                    name='hand-paper-o'
                                    size={24}
                                    style={{ marginLeft: 20 }}
                                />
                                <Text style={styles.smallButtonText}>
                                    {tasks.indexOf(item) + 1}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
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

                {/* Schedule View */}
                <View style={styles.editScheduleView}>
                    <DismissKeyboard>
                        <>
                            <View style={styles.editScheduleHeader}>
                                {/* Delete Button */}
                                <TouchableOpacity
                                    style={{ margin: 10 }}
                                    onPress={() => {
                                        setDeleteType('schedule');
                                        onPressDelete(sid);
                                    }}>
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
                                    placeholderTextColor={
                                        colors.textInputPlaceholder
                                    }
                                    value={title}
                                    onChangeText={(val) => setTitle(val)}
                                />
                            </View>

                            {ConfirmDeleteModal}
                            {ConfirmDiscardModal}

                            {/* New Task Input */}
                            <View
                                style={[
                                    type === 'text'
                                        ? {
                                              flex: 1,
                                              margin: 0,
                                              width: '100%',
                                          }
                                        : { flex: 2 },
                                    type === 'picture' ? { flex: 1 } : null,
                                ]}>
                                <CreateTask addTask={addTask} />
                            </View>
                        </>
                    </DismissKeyboard>

                    {/* Task List */}

                    <View
                        style={
                            type === 'text'
                                ? {
                                      flex: 3,
                                  }
                                : { flex: 2 }
                        }>
                        {tasks.length ? (
                            <DraggableFlatList
                                data={tasks}
                                renderItem={renderTask}
                                onDragEnd={({ data }) => setTasks(data)}
                                keyExtractor={(item) => tasks.indexOf(item)}
                            />
                        ) : null}
                    </View>
                </View>

                {/* Small Bottom Buttons */}
                <CustomSmallButton
                    position='left'
                    onPress={() => setDiscardModalShown(true)}>
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
        );
    }
};

export default EditSchedule;
