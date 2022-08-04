import { View, Text } from 'react-native';
import { styles } from '../../assets/styles';
import React, { useContext } from 'react';
import CustomBigButton from '../../components/CustomBigButton';
import { FontAwesome } from '@expo/vector-icons';
import { ScheduleContext } from '../../contexts/ScheduleContext';
import CustomSmallButton from '../../components/CustomSmallButton';

const ScheduleTypeMenu = ({ navigation }) => {
    const { setScheduleInfo } = useContext(ScheduleContext);
    return (
        <View style={[styles.container, { justifyContent: 'flex-start' }]}>
            <Text style={styles.largeText}>Schedules</Text>
            <View style={{ marginTop: 50 }}>
                <CustomBigButton
                    style={[styles.bigButtons, { paddingTop: 15 }]}
                    onPress={() => {
                        setScheduleInfo({
                            type: 'picture',
                            sid: '',
                        });
                        navigation.navigate('CreateSchedule');
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
                        setScheduleInfo({ type: 'text', sid: '' });
                        navigation.navigate('CreateSchedule');
                    }}>
                    <Text style={styles.largeText}>Words</Text>
                </CustomBigButton>
                <CustomBigButton
                    style={[styles.bigButtons, { flexDirection: 'row' }]}
                    onPress={() => {
                        setScheduleInfo({
                            type: 'hybrid',
                            sid: '',
                        });
                        navigation.navigate('CreateSchedule');
                    }}>
                    <FontAwesome name='photo' size={40} />
                    <Text style={styles.largeText}>Both</Text>
                </CustomBigButton>
            </View>
            <CustomSmallButton
                position='left'
                onPress={() => {
                    navigation.goBack();
                }}>
                <Text style={styles.smallButtonText}>Back</Text>
            </CustomSmallButton>
        </View>
    );
};

export default ScheduleTypeMenu;
