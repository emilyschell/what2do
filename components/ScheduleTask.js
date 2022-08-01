import React, { useContext, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { ScheduleContext } from '../src/contexts/ScheduleContext';
import { styles, colors } from '../assets/styles';
import { Ionicons } from '@expo/vector-icons';

const ScheduleTask = ({ task }) => {
    const { type } = useContext(ScheduleContext);
    const [complete, setComplete] = useState(false);

    const Checkbox = () => {
        return (
            <TouchableOpacity
                style={styles.checkboxBase}
                onPress={() => {
                    setComplete(!complete);
                }}>
                {complete && (
                    <Ionicons
                        name='checkmark'
                        size={30}
                        color={colors.bgSuccess}
                    />
                )}
            </TouchableOpacity>
        );
    };

    switch (type) {
        case 'text':
            return (
                <View style={styles.readTaskContainer}>
                    <Checkbox />
                    <TouchableOpacity
                        onPress={() => {
                            setComplete(!complete);
                        }}>
                        <Text
                            style={[
                                styles.taskText,
                                complete ? styles.completed : styles.incomplete,
                            ]}>
                            {task.text}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
            break;

        case 'picture':
            return (
                <View style={styles.readTaskContainer}>
                    <Checkbox />
                    <TouchableOpacity
                        style={[
                            styles.imageContainer,
                            { height: 200, width: 200 },
                        ]}
                        onPress={() => {
                            setComplete(!complete);
                        }}>
                        <Image
                            style={[
                                styles.image,
                                { height: 200, width: 200 },
                                complete ? { opacity: 0.5 } : null,
                            ]}
                            source={{ uri: task.image }}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                </View>
            );
            break;

        case 'hybrid':
            return (
                <View
                    style={[
                        styles.readTaskContainer,
                        { justifyContent: 'center' },
                    ]}>
                    <Checkbox />
                    <TouchableOpacity
                        onPress={() => {
                            setComplete(!complete);
                        }}>
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
                    </TouchableOpacity>
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
