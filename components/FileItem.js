import { styles } from '../assets/styles';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useContext } from 'react';
import { ScheduleContext } from '../src/contexts/ScheduleContext';

const FileItem = ({ title, sid, deleteSched, navigation }) => {
    const { setSid } = useContext(ScheduleContext);

    return (
        <View style={styles.fileItem}>
            <TouchableOpacity
                onPress={() => {
                    setSid(sid);
                    navigation.navigate('ReadSchedule');
                }}>
                <Text style={styles.taskText}>{title}</Text>
            </TouchableOpacity>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => deleteSched(sid)}>
                    {' '}
                    <Ionicons name='ios-trash-outline' size={24} color='red' />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setSid(sid);
                        navigation.navigate('CreateEditSchedule');
                    }}>
                    <Entypo name='edit' size={24} color='black' />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default FileItem;
