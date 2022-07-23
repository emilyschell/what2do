import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';
import CheckBox from '@react-native-community/checkbox';

const ScheduleTask = ({ schedType, task }) => {
    const [toggleCheckBox, setToggleCheckBox] = useState(task.completed);

    schedType === 'text' && (
        <View style={styles.taskContainer}>
            <CheckBox
                height={40}
                value={toggleCheckBox}
                onValueChange={() => setToggleCheckBox(!toggleCheckBox)}
            />
            <Text
                style={[
                    styles.text,
                    task.completed ? styles.completed : styles.incomplete,
                ]}>
                {task.text}
            </Text>
        </View>
    );

    schedType === 'picture' && (
        <View style={styles.taskContainer}>
            <CheckBox
                height={40}
                value={toggleCheckBox}
                onValueChange={() => setToggleCheckBox(!toggleCheckBox)}
            />
            <Image
                style={[styles.image, task.completed ? { opacity: 0.7 } : null]}
                source={task.image}
            />
        </View>
    );

    schedType === 'hybrid' && (
        <View style={[styles.taskContainer, { justifyContent: 'center' }]}>
            <CheckBox
                height={40}
                value={toggleCheckBox}
                onValueChange={() => setToggleCheckBox(!toggleCheckBox)}
            />
            <Text
                style={[
                    styles.text,
                    task.completed ? styles.completed : styles.incomplete,
                ]}>
                {task.text}
            </Text>
            <Image
                style={[styles.image, task.completed ? { opacity: 0.7 } : null]}
                source={task.image}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    taskContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    text: {
        fontSize: '1.5rem',
        fontFamily: 'Montserrat sans-serif',
        margin: '.5rem',
    },
    completed: {
        textDecorationLine: 'line-through',
    },
    incomplete: {
        textDecorationLine: 'none',
    },
    image: {
        border: '1px solid black',
        borderRadius: '10',
        height: 'auto',
        width: '80%',
    },
});

BookCount.propTypes = {
    schedType: PropTypes.string,
    task: PropTypes.shape({
        id: PropTypes.number,
        image: PropTypes.string,
        text: PropTypes.string,
        completed: PropTypes.bool,
    }),
};

export default ScheduleTask;
