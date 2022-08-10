import { styles } from '../assets/styles';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import PropTypes from 'prop-types';

const FileItem = ({
    title,
    id,
    onPressCallback,
    showDelete,
    deleteCallback,
    showEdit,
    editCallback,
    currentSubschedule,
}) => {
    return (
        <View style={styles.fileItem}>
            <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={() => onPressCallback(id)}>
                <Text
                    style={[
                        styles.taskText,
                        currentSubschedule === id ? { marginRight: 10 } : null,
                    ]}>
                    {title}
                </Text>
                {currentSubschedule === id && (
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
                    <TouchableOpacity onPress={() => deleteCallback(id)}>
                        <Ionicons
                            name='ios-trash-outline'
                            size={24}
                            color='red'
                        />
                    </TouchableOpacity>
                )}
                {showEdit && (
                    <TouchableOpacity onPress={() => editCallback(id)}>
                        <Entypo name='edit' size={24} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

FileItem.propTypes = {
    title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    onPressCallback: PropTypes.func.isRequired,
    showDelete: PropTypes.bool.isRequired,
    deleteCallback: PropTypes.func,
    editCallback: PropTypes.func,
    showEdit: PropTypes.bool.isRequired,
    currentSubschedule: PropTypes.string,
};

export default FileItem;
