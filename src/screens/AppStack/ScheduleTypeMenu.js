import { View, Text } from 'react-native';
import { styles } from '../../../assets/styles';
import React, { useContext } from 'react';
import CustomBigButton from '../../../components/CustomBigButton';
import { FontAwesome } from '@expo/vector-icons';
import { ScheduleContext } from '../../contexts/ScheduleContext';

const ScheduleTypeMenu = ({ navigation }) => {
    const { setType } = useContext(ScheduleContext);
    return (
        <View style={[styles.container, { justifyContent: 'flex-start' }]}>
            <Text style={styles.largeText}>Schedules</Text>
            <View style={{ marginTop: 50 }}>
                <CustomBigButton
                    style={[styles.bigButtons, { paddingTop: 15 }]}
                    onPress={() => {
                        setType('picture');
                        navigation.navigate('CreateEditSchedule');
                    }}>
                    <FontAwesome name='photo' size={50} />
                    <Text
                        style={[
                            styles.largeText,
                            { fontSize: 24, marginTop: 0 },
                        ]}>
                        {'('}Pictures{')'}
                    </Text>
                </CustomBigButton>
                <CustomBigButton
                    style={[styles.bigButtons, { flexDirection: 'row' }]}
                    onPress={() => {
                        setType('text');
                        navigation.navigate('CreateEditSchedule');
                    }}>
                    <Text style={styles.largeText}>Words</Text>
                </CustomBigButton>
                <CustomBigButton
                    style={[styles.bigButtons, { flexDirection: 'row' }]}
                    onPress={() => {
                        setType('hybrid');
                        navigation.navigate('CreateEditSchedule');
                    }}>
                    <FontAwesome name='photo' size={40} />
                    <Text style={styles.largeText}>Both</Text>
                </CustomBigButton>
            </View>
        </View>
    );
};

export default ScheduleTypeMenu;
