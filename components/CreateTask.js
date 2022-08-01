import React, { useContext, useState } from 'react';
import {
    View,
    TextInput,
    Text,
    ImageBackground,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { ScheduleContext } from '../src/contexts/ScheduleContext';
import { Entypo } from '@expo/vector-icons';
import { styles, colors } from '../assets/styles';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImageHelpers from '../helpers/ImageHelpers';
import { storage } from '../src/firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { AuthContext } from '../src/contexts/AuthContext';
import { manipulateAsync } from 'expo-image-manipulator';
import PropTypes from 'prop-types';

const CreateTask = ({ addTask }) => {
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const { showActionSheetWithOptions } = useActionSheet();
    const { type } = useContext(ScheduleContext);
    const { currentUser } = useContext(AuthContext);
    const uid = currentUser.uid;

    const uploadImage = async (image) => {
        let fileName = new Date().toString().replace(/\s+/g, '') + '.jpg';
        try {
            const storageRef = ref(
                storage,
                `'users'/${uid}/'images'/${fileName}`
            );
            const shrunkImage = await manipulateAsync(image.uri, [
                { resize: { width: 300 } },
            ]);
            const blob = await ImageHelpers.prepareBlob(shrunkImage.uri);
            await uploadBytes(storageRef, blob);
            let downloadUrl = await getDownloadURL(storageRef);
            blob.close();
            return downloadUrl;
        } catch (error) {
            console.log(error);
        }
    };

    const openImageLibrary = async () => {
        const result = await ImageHelpers.openImageLibrary();
        if (result) {
            setLoading(true);
            const downloadUrl = await uploadImage(result);
            setImageUrl(downloadUrl);
            setLoading(false);
        }
    };

    const openCamera = async () => {
        const result = await ImageHelpers.openCamera();
        if (result) {
            setLoading(true);
            const downloadUrl = await uploadImage(result);
            setImageUrl(downloadUrl);
            setLoading(false);
        }
    };

    const addImage = () => {
        const options = ['Select from Photos', 'Camera', 'Cancel'];
        const cancelButtonIndex = 2;

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            (buttonIndex) => {
                if (buttonIndex == 0) {
                    openImageLibrary();
                } else if (buttonIndex == 1) {
                    openCamera();
                }
            }
        );
    };

    const blankImageUrl = '../assets/BlankImage.png';

    if (loading) {
        return (
            <View>
                <ActivityIndicator size='large' color={colors.iconColor} />
            </View>
        );
    } else {
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
                    <View style={[styles.taskContainer, { marginTop: 60 }]}>
                        <TouchableOpacity
                            style={styles.imageContainer}
                            onPress={() => addImage()}>
                            <ImageBackground
                                style={[styles.image, { opacity: 0.7 }]}
                                source={{ uri: imageUrl }}>
                                <Entypo name='camera' size={40} />
                            </ImageBackground>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => {
                                if (imageUrl) {
                                    addTask(null, imageUrl);
                                    setImageUrl(blankImageUrl);
                                } else
                                    alert(
                                        'click the camera to upload an image before adding'
                                    );
                            }}>
                            <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                );
                break;

            case 'hybrid':
                return (
                    <View
                        style={[
                            styles.taskContainer,
                            {
                                marginTop: 100,
                                justifyContent: 'center',
                                flex: 1,
                            },
                        ]}>
                        <View
                            style={{
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}>
                            <TouchableOpacity
                                style={styles.imageContainer}
                                onPress={() => addImage()}>
                                <ImageBackground
                                    style={[styles.image, { opacity: 0.7 }]}
                                    source={{ uri: imageUrl }}
                                    resizeMode='contain'>
                                    <Entypo name='camera' size={40} />
                                </ImageBackground>
                            </TouchableOpacity>
                            <TextInput
                                style={[styles.taskTextInput, { width: 200 }]}
                                placeholder='enter task'
                                placeholderTextColor={
                                    colors.textInputPlaceholder
                                }
                                onChangeText={(val) => setText(val)}
                                value={text}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => {
                                addTask(text, imageUrl);
                                setText('');
                                setImageUrl(blankImageUrl);
                            }}>
                            <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                );
                break;
            default:
                return null;
        }
    }
};

CreateTask.propTypes = {
    addTask: PropTypes.func.isRequired,
};

export default CreateTask;