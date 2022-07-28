import React, { useContext, useState } from 'react';
import { View, Text, Image } from 'react-native';
import PropTypes from 'prop-types';
import { ScheduleContext } from '../src/contexts/ScheduleContext';
import { styles } from '../assets/styles';
import Checkbox from './Checkbox';

const ScheduleTask = ({ task }) => {
    const { type } = useContext(ScheduleContext);
    const [complete, setComplete] = useState(false);

    switch (type) {
        case 'text':
            return (
                <View style={styles.taskContainer}>
                    <Checkbox setComplete={setComplete} />
                    <Text
                        style={[
                            styles.taskText,
                            complete ? styles.completed : styles.incomplete,
                        ]}>
                        {task.text}
                    </Text>
                </View>
            );
            break;

        case 'picture':
            return (
                <View style={styles.taskContainer}>
                    <Checkbox setComplete={setComplete} />
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
                    <Checkbox setComplete={setComplete} />
                    <Text
                        style={[
                            styles.taskText,
                            complete ? styles.completed : styles.incomplete,
                        ]}>
                        {task.text}
                    </Text>
                    <Image
                        style={[
                            styles.image,
                            complete ? { opacity: 0.7 } : null,
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
        image: PropTypes.string,
        text: PropTypes.string,
    }),
};

export default ScheduleTask;
