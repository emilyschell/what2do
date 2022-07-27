import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../../assets/styles';
import { ScheduleContext } from '../../contexts/ScheduleContext';

const CreateEditSchedule = () => {
    const { type } = useContext(ScheduleContext);
    return (
        <View style={styles.container}>
            <Text style={styles.largeText}>I am a {type} schedule! </Text>
        </View>
    );
};

export default CreateEditSchedule;
