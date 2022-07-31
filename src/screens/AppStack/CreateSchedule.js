import React, { useContext, useState } from 'react';
import {
    View,
    FlatList,
    Text,
    TextInput,
    SafeAreaView,
    TouchableOpacity,
    Keyboard,
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
    const [newTitle, setNewTitle] = useState('');
    const [newTasks, setNewTasks] = useState([]);

    const addTask = (text, imageUrl) => {
        if (text.length) {
            const newTask = {
                text: text,
                image: imageUrl,
            };
            setNewTasks([...newTasks, newTask]);
        } else {
            alert('Please enter a task');
        }
    };

    const deleteTask = (str) => {
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

    const makeSchedule = async () => {
        const newSchedule = {
            title: newTitle,
            type,
        };
        if (newTasks.length && newTitle) {
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
                    for (const task of newTasks) {
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
                    navigation.navigate('ReadSchedule');
                }
            } catch (error) {
                console.log('error: ', error);
            }
        } else {
            alert('Please enter a title and at least 1 task.');
        }
    };

    const renderTask = ({ item, index }) => {
        return (
            <View key={index} style={styles.taskContainer}>
                <Text
                    style={[
                        styles.taskText,
                        { marginLeft: 0, paddingLeft: 0, flex: 4 },
                    ]}>
                    {item.text}
                </Text>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => deleteTask(item.text)}>
                    <Ionicons name='ios-trash-outline' size={24} color='red' />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: 0 }]}>
            <SafeAreaView />

            {/* Schedule View */}
            <View style={styles.editScheduleView}>
                <DismissKeyboard>
                    <View style={styles.editScheduleHeader}>
                        {/* Title Field */}
                        <TextInput
                            style={[
                                styles.taskTextInput,
                                { marginRight: 0, textAlign: 'center' },
                            ]}
                            placeholder='enter title'
                            placeholderTextColor={colors.textInputPlaceholder}
                            value={newTitle}
                            onChangeText={(val) => setNewTitle(val)}
                        />

                        {/* New Task Input */}
                        <CreateTask addTask={addTask} />
                    </View>
                </DismissKeyboard>
                <View style={{ flex: 2 }}>
                    {/* Task List */}
                    {newTasks.length > 0 ? (
                        <FlatList
                            data={newTasks}
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
};

export default CreateSchedule;
