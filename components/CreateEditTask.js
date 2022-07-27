import React, { useContext, useState } from 'react';
import {
    View,
    TextInput,
    Text,
    ImageBackground,
    TouchableOpacity,
} from 'react-native';
import { ScheduleContext } from '../src/contexts/ScheduleContext';
import { Entypo } from '@expo/vector-icons';
import { styles, colors } from '../assets/styles';
import {
    openImageLibrary,
    openCamera,
    prepareBlob,
} from '../helpers/ImageHelpers';
import PropTypes from 'prop-types';

const CreateEditTask = ({ addTask }) => {
    const { type } = useContext(ScheduleContext);
    const [imageUrl, setImageUrl] = useState('');
    const [text, setText] = useState('');

    const getImage = async () => {
        console.log('getting image');
        setImageUrl(
            'https://www.firstbenefits.org/wp-content/uploads/2017/10/placeholder-1024x1024.png'
        );
    };

    switch (type) {
        case 'text':
            return (
                <View style={styles.taskContainer}>
                    <TextInput
                        style={[styles.taskTextInput, { flex: 5 }]}
                        placeholder='enter task'
                        placeholderTextColor={colors.textInputPlaceholder}
                        onChangeText={(val) => setText(val)}
                        value={text}
                    />
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => {
                            addTask(text, null);
                            setText('');
                        }}>
                        <Text
                            style={{
                                fontSize: 40,
                                textAlign: 'center',
                                textAlignVertical: 'center',
                            }}>
                            +
                        </Text>
                    </TouchableOpacity>
                </View>
            );
            break;

        case 'picture':
            return (
                <View style={styles.taskContainer}>
                    <TouchableOpacity
                        style={styles.imageContainer}
                        onPress={() => getImage()}>
                        <ImageBackground
                            style={[styles.image, { opacity: 0.7 }]}
                            source={imageUrl}>
                            <Entypo name='camera' size={24} />
                        </ImageBackground>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => addTask(null, imageUrl)}>
                        <Text style={styles.smallButtonText}>+</Text>
                    </TouchableOpacity>
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
                    <TouchableOpacity style={styles.imageContainer}>
                        <ImageBackground
                            style={[styles.image, { opacity: 0.7 }]}
                            source={imageUrl}>
                            <Entypo name='camera' size={24} />
                        </ImageBackground>
                    </TouchableOpacity>
                    <TextInput
                        style={[styles.taskTextInput, { width: 200 }]}
                        placeholder='enter task'
                        placeholderTextColor={colors.textInputPlaceholder}
                        onChangeText={(val) => setText(val)}
                        value={text}
                    />
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => addTask(text, imageUrl)}>
                        <Text style={styles.smallButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
            );
            break;
        default:
            return null;
    }
};

CreateEditTask.propTypes = {
    addTask: PropTypes.func.isRequired,
};

export default CreateEditTask;
