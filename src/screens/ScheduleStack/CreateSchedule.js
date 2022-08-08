import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    SafeAreaView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { styles, colors } from '../../assets/styles';
import { ScheduleContext } from '../../contexts/ScheduleContext';
import CustomSmallButton from '../../components/CustomSmallButton';
import CreateTask from '../../components/CreateTask';
import { Ionicons } from '@expo/vector-icons';
import {
    collection,
    addDoc,
    setDoc,
    doc,
    writeBatch,
} from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { AuthContext } from '../../contexts/AuthContext';
import { DismissKeyboard } from '../../helpers/dismissKeyboard';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import CustomModal from '../../components/CustomModal';

const CreateSchedule = ({ navigation }) => {
    const { currentUser } = useContext(AuthContext);
    const { type, setSid } = useContext(ScheduleContext);
    const uid = currentUser.uid;
    const [title, setTitle] = useState('');
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [changesMade, setChangesMade] = useState(false);
    const [discardModalShown, setDiscardModalShown] = useState(false);
    const [pendingTask, setPendingTask] = useState(false);
    const [unaddedTaskModalShown, setUnaddedTaskModalShown] = useState(false);
    const [hideCreateTask, setHideCreateTask] = useState(false);

    const addTask = (text, imageUrl) => {
        if (
            (type === 'text' && text) ||
            (type === 'picture' && imageUrl != '../assets/BlankImage.png') ||
            (type === 'hybrid' &&
                text &&
                imageUrl != '../assets/BlankImage.png')
        ) {
            const newTask = {
                text: text,
                image: imageUrl,
                subSchedule: null,
            };
            setTasks([...tasks, newTask]);
            setChangesMade(true);
            setPendingTask(false);
        } else {
            switch (type) {
                case 'text':
                    alert('Please enter a task to add');
                    break;
                case 'picture':
                    alert('Please select a photo to add');
                    break;
                case 'hybrid':
                    alert('Please add text and a photo to add');
            }
        }
    };

    const deleteTask = (str) => {
        if (type === 'text') {
            const newTasks = tasks.filter((task) => task.text !== str);
            setTasks(newTasks);
        } else {
            const newTasks = tasks.filter((task) => task.image !== str);
            setTasks(newTasks);
        }
    };

    const makeSchedule = async () => {
        setLoading(true);

        const newSchedule = {
            title,
            type,
        };

        // assign order to task objects
        tasks.forEach((task) => {
            task.order = tasks.indexOf(task);
        });

        // Add schedule to user's Firestore collection
        try {
            const schedulesColl = collection(db, 'users', uid, 'schedules');
            const schedResponse = await addDoc(schedulesColl, newSchedule);
            if (schedResponse) {
                // Add schedule ID to newly created schedule
                await setDoc(
                    doc(schedulesColl, schedResponse.id),
                    {
                        sid: schedResponse.id,
                    },
                    { merge: true }
                );
                // Set schedule id in app context
                setSid(schedResponse.id);

                // Assign tasks to newly created schedule in batch write
                const batch = writeBatch(db);

                const tasksColl = collection(
                    db,
                    'users',
                    uid,
                    'schedules',
                    schedResponse.id,
                    'tasks'
                );

                for (const task of tasks) {
                    const taskRef = doc(tasksColl);
                    batch.set(taskRef, task);
                }
                batch.commit();
                setLoading(false);
                navigation.navigate('ReadSchedule');
            }
        } catch (error) {
            console.log('error: ', error);
        }
    };

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

    const confirmUnaddedTaskModal = (
        <CustomModal
            modalShown={unaddedTaskModalShown}
            msg='Did you mean to add task first?'
            rCallback={() => {
                makeSchedule();
                setUnaddedTaskModalShown(false);
            }}
            rText='Discard task'
            lCallback={() => setUnaddedTaskModalShown(false)}
            lText='Go back'
        />
    );

    const renderTask = ({ item, drag, isActive }) => {
        switch (type) {
            case 'text':
                return (
                    <TouchableOpacity
                        onLongPress={drag}
                        style={isActive ? styles.activeDragItem : null}>
                        <View style={styles.taskContainer}>
                            <Text style={styles.taskText}>{item.text}</Text>
                            <View style={styles.centeredView}>
                                <TouchableOpacity
                                    onPress={() => deleteTask(item.text)}
                                    style={{ marginLeft: 15 }}>
                                    <Ionicons
                                        name='ios-trash-outline'
                                        size={24}
                                        color='red'
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
                        <View style={styles.taskContainer}>
                            <Image
                                style={[styles.image, { margin: 0 }]}
                                source={{ uri: item.image }}
                                resizeMode='contain'
                            />
                            <TouchableOpacity
                                onPress={() => deleteTask(item.image)}>
                                <Ionicons
                                    name='ios-trash-outline'
                                    size={24}
                                    color='red'
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
                                { marginBottom: 0, justifyContent: 'center' },
                            ]}>
                            <View
                                style={{
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}>
                                <Image
                                    style={styles.image}
                                    source={{ uri: item.image }}
                                    resizeMode='contain'
                                />
                                <Text style={styles.taskText}>{item.text}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => deleteTask(item.image)}>
                                <Ionicons
                                    name='ios-trash-outline'
                                    size={24}
                                    color='red'
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
                                {/* Title Field */}
                                <TextInput
                                    style={[
                                        styles.taskTextInput,
                                        {
                                            height: 50,
                                            marginRight: 0,
                                            textAlign: 'center',
                                        },
                                    ]}
                                    placeholder='enter title'
                                    placeholderTextColor={
                                        colors.textInputPlaceholder
                                    }
                                    value={title}
                                    onChangeText={(val) => setTitle(val)}
                                />
                            </View>

                            {/* New Task Input */}
                            {type !== 'text' && (
                                <TouchableOpacity
                                    style={styles.toggleButton}
                                    onPress={() => {
                                        setHideCreateTask(!hideCreateTask);
                                    }}>
                                    {hideCreateTask ? (
                                        <Ionicons name='add' size={24} />
                                    ) : (
                                        <AntDesign name='close' size={20} />
                                    )}
                                </TouchableOpacity>
                            )}

                            {!hideCreateTask && (
                                <View
                                    style={
                                        type === 'text'
                                            ? {
                                                  flex: 1,
                                                  margin: 0,
                                                  width: '100%',
                                              }
                                            : { flex: 2 }
                                    }>
                                    <CreateTask
                                        addTask={addTask}
                                        onChange={() => setPendingTask(true)}
                                    />
                                </View>
                            )}
                        </>
                    </DismissKeyboard>

                    {/* Task List */}
                    <View
                        style={
                            type === 'hybrid'
                                ? { flex: 4, marginTop: 10 }
                                : { flex: 5 }
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

                {ConfirmDiscardModal}

                {confirmUnaddedTaskModal}

                {/* Small Bottom Buttons */}
                <CustomSmallButton
                    position='left'
                    onPress={() => {
                        if (changesMade || pendingTask) {
                            setDiscardModalShown(true);
                        } else {
                            navigation.goBack();
                        }
                    }}>
                    <Text style={styles.smallButtonText}>Back</Text>
                </CustomSmallButton>
                <CustomSmallButton
                    position='right'
                    onPress={() => {
                        if (title && tasks.length) {
                            if (pendingTask) {
                                setUnaddedTaskModalShown(true);
                            } else {
                                makeSchedule();
                            }
                        } else {
                            alert('Please enter a title and at least 1 task.');
                        }
                    }}>
                    <Text style={styles.smallButtonText}>Create</Text>
                </CustomSmallButton>
            </View>
        );
    }
};

export default CreateSchedule;
