import { colors, styles } from '../assets/styles';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { ScheduleContext } from '../src/contexts/ScheduleContext';

const FileItem = ({
    title,
    sid,
    onPressCallback,
    showDelete,
    deleteSched,
    showEdit,
    currentSubschedule,
}) => {
    const { setSid } = useContext(ScheduleContext);
    const navigation = useNavigation();

    return (
        <View style={styles.fileItem}>
            <TouchableOpacity onPress={() => onPressCallback(sid)}>
                <Text
                    style={[
                        styles.taskText,
                        currentSubschedule === sid
                            ? { color: colors.bgSuccess, fontWeight: 'bold' }
                            : null,
                    ]}>
                    {title}
                </Text>
            </TouchableOpacity>
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                }}>
                {showDelete && (
                    <TouchableOpacity onPress={() => deleteSched(sid)}>
                        <Ionicons
                            name='ios-trash-outline'
                            size={24}
                            color='red'
                        />
                    </TouchableOpacity>
                )}
                {showEdit && (
                    <TouchableOpacity
                        onPress={() => {
                            setSid(sid);
                            navigation.navigate('EditSchedule');
                        }}>
                        <Entypo name='edit' size={24} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default FileItem;
