import React, { useContext, useState } from 'react';
import {
    View,
    FlatList,
    Text,
    TextInput,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import { styles, colors } from '../../../assets/styles';
import { ScheduleContext } from '../../contexts/ScheduleContext';
import CustomSmallButton from '../../../components/CustomSmallButton';
import CreateEditTask from '../../../components/CreateEditTask';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { AuthContext } from '../../contexts/AuthContext';
import { DismissKeyboard } from '../../../helpers/dismissKeyboard';

const CreateEditSchedule = ({ navigation }) => {
    const { type, title, tasks, setScheduleInfo } = useContext(ScheduleContext);
    const [newTitle, setNewTitle] = useState(title);
    const [newTasks, setNewTasks] = useState(tasks);
    const { currentUser } = useContext(AuthContext);
    const uid = currentUser.uid;

    const addTask = (text, imageUrl) => {
        const newTask = {
            completed: false,
            text: text,
            image: imageUrl,
        };
        setNewTasks([...newTasks, newTask]);
    };

    const addSchedule = async () => {
        const newSchedule = {
            title: newTitle,
            type,
        };
        if (newTasks.length > 0 && newTitle) {
            try {
                const schedulesColl = collection(db, 'users', uid, 'schedules');
                const schedResponse = await addDoc(schedulesColl, newSchedule);
                if (schedResponse) {
                    const tasksColl = collection(
                        db,
                        'users',
                        uid,
                        'schedules',
                        schedResponse.id,
                        'tasks'
                    );
                    for (const task of newTasks) {
                        setTimeout(() => addDoc(tasksColl, task), 1000);
                    }
                }

                setScheduleInfo({
                    title: newTitle,
                    type,
                    tasks: newTasks,
                    sid: schedResponse.id,
                });
                navigation.navigate('ReadSchedule');
            } catch (error) {
                console.log(error);
            }
        } else {
            alert('Please enter a title and at least 1 task.');
        }
    };

    return (
        <DismissKeyboard>
            <View style={[styles.container, { paddingTop: 0 }]}>
                <SafeAreaView />

                {/* Schedule View */}
                <View style={styles.scheduleView}>
                    {/* Delete Button */}
                    <TouchableOpacity
                        style={{ margin: 10 }}
                        onPress={() => alert('delete schedule!')}>
                        <Ionicons
                            name='ios-trash-outline'
                            size={24}
                            color='red'
                        />
                    </TouchableOpacity>

                    {/* Title Field */}
                    <TextInput
                        style={styles.taskTextInput}
                        placeholder='enter title'
                        placeholderTextColor={colors.textInputPlaceholder}
                        value={newTitle}
                        onChangeText={(val) => setNewTitle(val)}
                    />

                    {/* Task List */}
                    {newTasks.length > 0 ? (
                        <FlatList
                            data={newTasks}
                            renderItem={({ item }) => {
                                return (
                                    <View style={styles.taskContainer}>
                                        <Text style={styles.taskText}>
                                            {item.text}
                                        </Text>
                                        <TouchableOpacity
                                            style={{ marginLeft: 20 }}
                                            onPress={() =>
                                                alert('delete task!')
                                            }>
                                            <Ionicons
                                                name='ios-trash-outline'
                                                size={24}
                                                color='red'
                                            />
                                        </TouchableOpacity>
                                    </View>
                                );
                            }}
                        />
                    ) : null}

                    {/* New Task Input */}
                    <CreateEditTask addTask={addTask} />
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
                        addSchedule();
                    }}>
                    <Text style={styles.smallButtonText}>Save</Text>
                </CustomSmallButton>
            </View>
        </DismissKeyboard>
    );
};

export default CreateEditSchedule;
