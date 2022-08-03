import { colors, styles } from '../assets/styles';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { ScheduleContext } from '../src/contexts/ScheduleContext';
import { FontAwesome } from '@expo/vector-icons';

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
            <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={() => onPressCallback(sid)}>
                <Text
                    style={[
                        styles.taskText,
                        currentSubschedule === sid ? { marginRight: 10 } : null,
                    ]}>
                    {title}
                </Text>
                {currentSubschedule === sid && (
                    <FontAwesome name='hand-o-left' size={30} />
                )}
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
