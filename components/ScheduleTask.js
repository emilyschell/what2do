import React, { useContext, useState } from 'react';
import { View, Text, Image } from 'react-native';
import PropTypes from 'prop-types';
import CheckBox from '@react-native-community/checkbox';
import { ScheduleContext } from '../src/contexts/ScheduleContext';
import { styles } from '../assets/styles';

const ScheduleTask = ({ task }) => {
    const { type } = useContext(ScheduleContext);
    const [toggleCheckBox, setToggleCheckBox] = useState(task.completed);

    switch (type) {
        case 'text':
            return;
            <View style={styles.taskContainer}>
                <CheckBox
                    height={40}
                    value={toggleCheckBox}
                    onValueChange={() => setToggleCheckBox(!toggleCheckBox)}
                />
                <Text
                    style={[
                        styles.taskText,
                        task.completed ? styles.completed : styles.incomplete,
                    ]}>
                    {task.text}
                </Text>
            </View>;
            break;

        case 'picture':
            return (
                <View style={styles.taskContainer}>
                    <CheckBox
                        height={40}
                        value={toggleCheckBox}
                        onValueChange={() => setToggleCheckBox(!toggleCheckBox)}
                    />
                    <Image
                        style={[
                            styles.image,
                            task.completed ? { opacity: 0.7 } : null,
                        ]}
                        source={task.image}
                    />
                </View>
            );
            break;

        case 'hybrid':
            return (
                <View
                    style={[
                        styles.taskContainer,
                        { justifyContent: 'center' },
                    ]}>
                    <CheckBox
                        height={40}
                        value={toggleCheckBox}
                        onValueChange={() => setToggleCheckBox(!toggleCheckBox)}
                    />
                    <Text
                        style={[
                            styles.taskText,
                            task.completed
                                ? styles.completed
                                : styles.incomplete,
                        ]}>
                        {task.text}
                    </Text>
                    <Image
                        style={[
                            styles.image,
                            task.completed ? { opacity: 0.7 } : null,
                        ]}
                        source={task.image}
                    />
                </View>
            );
            break;
        default:
            return null;
    }
};

ScheduleTask.propTypes = {
    task: PropTypes.shape({
        id: PropTypes.number,
        image: PropTypes.string,
        text: PropTypes.string,
        completed: PropTypes.bool,
        subtasks: PropTypes.array,
    }),
};

export default ScheduleTask;
