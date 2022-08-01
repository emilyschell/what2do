import React, { useContext, useState } from 'react';
import {
    View,
    FlatList,
    Text,
    TextInput,
    SafeAreaView,
    TouchableOpacity,
    Keyboard,
    Image,
    ActivityIndicator,
} from 'react-native';
import { styles, colors } from '../../../assets/styles';
import { ScheduleContext } from '../../contexts/ScheduleContext';
import CustomSmallButton from '../../../components/CustomSmallButton';
import CreateTask from '../../../components/CreateTask';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, setDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { AuthContext } from '../../contexts/AuthContext';
import { DismissKeyboard } from '../../../helpers/dismissKeyboard';

const CreateSchedule = ({ navigation }) => {
    const { currentUser } = useContext(AuthContext);
    const { type, setSid } = useContext(ScheduleContext);
    const uid = currentUser.uid;
    const [title, setTitle] = useState('');
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    const addTask = (text, imageUrl) => {
        if (text || imageUrl) {
            const newTask = {
                text: text,
                image: imageUrl,
            };
            setTasks([...tasks, newTask]);
        } else {
            alert('Please create a task to add');
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
        if (tasks.length && title) {
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

                    // Assign tasks to newly created schedule, in loops with setTimeout due to rate limits
                    const tasksColl = collection(
                        db,
                        'users',
                        uid,
                        'schedules',
                        schedResponse.id,
                        'tasks'
                    );

                    const timeouts = [];
                    for (const task of tasks) {
                        timeouts.push(
                            setTimeout(addDoc(tasksColl, task), 1000)
                        );
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
                    setLoading(false);
                    navigation.navigate('ReadSchedule');
                }
            } catch (error) {
                console.log('error: ', error);
            }
        } else {
            alert('Please enter a title and at least 1 task.');
        }
    };

    const renderTask = ({ item }, index) => {
        switch (type) {
            case 'text':
                return (
                    <View key={index} style={styles.taskContainer}>
                        <Text style={styles.taskText}>{item.text}</Text>
                        <TouchableOpacity
                            onPress={() => deleteTask(item.text)}
                            style={{ marginLeft: 15 }}>
                            <Ionicons
                                name='ios-trash-outline'
                                size={24}
                                color='red'
                            />
                        </TouchableOpacity>
                    </View>
                );
            case 'picture':
                return (
                    <View key={index} style={styles.taskContainer}>
                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.image}
                                source={{ uri: item.image }}
                                resizeMode='contain'
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => deleteTask(item.image)}>
                            <Ionicons
                                name='ios-trash-outline'
                                size={24}
                                color='red'
                            />
                        </TouchableOpacity>
                    </View>
                );
            case 'hybrid':
                return (
                    <View
                        key={index}
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
                        <TouchableOpacity
                            onPress={() => deleteTask(item.image)}>
                            <Ionicons
                                name='ios-trash-outline'
                                size={24}
                                color='red'
                            />
                        </TouchableOpacity>
                    </View>
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
                                        { marginRight: 0, textAlign: 'center' },
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
                        {tasks.length > 0 ? (
                            <FlatList
                                data={tasks}
                                renderItem={renderTask}
                                onScrollBeginDrag={Keyboard.dismiss}
                            />
                        ) : null}
                    </View>
                </View>

                {/* Small Bottom Buttons */}
                <CustomSmallButton
                    position='left'
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Text style={styles.smallButtonText}>Back</Text>
                </CustomSmallButton>
                <CustomSmallButton
                    position='right'
                    onPress={() => {
                        makeSchedule();
                    }}>
                    <Text style={styles.smallButtonText}>Save</Text>
                </CustomSmallButton>
            </View>
        );
    }
};

export default CreateSchedule;
