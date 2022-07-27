import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { styles, colors } from '../../../assets/styles';
import { ScheduleContext } from '../../contexts/ScheduleContext';
import CustomSmallButton from '../../../components/CustomSmallButton';
import CreateEditTask from '../../../components/CreateEditTask';
import { Ionicons } from '@expo/vector-icons';

const CreateEditSchedule = ({ navigation }) => {
    const { type, title, tasks } = useContext(ScheduleContext);
    const [newTitle, setNewTitle] = useState(title);
    const [newTasks, setNewTasks] = useState(tasks);

    const addTask = () => {
        // construct task object
        // append to tasks list in state
        // set tasks in context to this list
        // add createedittask field to view
    };

    const addSchedule = () => {
        // set title in context
        // set tasks in context
        // add schedule document to firebase
        // open readSchedule pulled down from db
    };

    return (
        <View style={styles.container}>
            <SafeAreaView id='task-container' />
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={{ justifyContent: 'flex-end' }}>
                    <TouchableOpacity
                        style={{ margin: 10 }}
                        onPress={() => alert('delete schedule!')}>
                        <Ionicons
                            name='ios-trash-outline'
                            size={24}
                            color='red'
                        />
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={styles.taskTextInput}
                    placeholder='enter title'
                    placeholderTextColor={colors.textInputPlaceholder}
                    value={newTitle}
                    onChangeText={(val) => setNewTitle(val)}
                />
                <CreateEditTask addTask={addTask} />
            </ScrollView>
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
    );
};

export default CreateEditSchedule;
