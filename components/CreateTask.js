import React, { useContext, useState } from 'react';
import {
    View,
    TextInput,
    Text,
    ImageBackground,
    TouchableOpacity,
    ActivityIndicator,
    Button,
    Modal,
    Image,
} from 'react-native';
import { ScheduleContext } from '../src/contexts/ScheduleContext';
import { Entypo } from '@expo/vector-icons';
import { styles, colors } from '../assets/styles';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImageHelpers from '../helpers/ImageHelpers';
import { storage } from '../src/firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { AuthContext } from '../src/contexts/AuthContext';
import PropTypes from 'prop-types';

const CreateTask = ({ addTask }) => {
    const { type } = useContext(ScheduleContext);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const { showActionSheetWithOptions } = useActionSheet();
    const { currentUser } = useContext(AuthContext);
    const uid = currentUser.uid;

    // const [modalShown, setModalShown] = useState(false);

    const uploadImage = async (image) => {
        console.log('made it to upload image');

        try {
            const storageRef = ref(
                storage,
                'users',
                uid,
                'images',
                new Date().toLocaleString()
            );
            const blob = await ImageHelpers.prepareBlob(image.uri);
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
        const data = await ImageHelpers.openCamera();
        if (data) {
            setLoading(true);
            setImage(data);
            const downloadUrl = await uploadImage(image);
            setImageUrl(downloadUrl);
            setLoading(false);
        }
    };

    // const takePicture = async () => {
    //     if (camera) {
    //         const data = await camera.takePictureAsync(null);
    //         if (data.uri) {
    //             setLoading(true);
    //             setImage(data.uri);
    //             const downloadUrl = await uploadImage(image);
    //             setImageUrl(downloadUrl);
    //             setLoading(false);
    //             setModalShown(false);
    //         }
    //     }
    // };

    // if (hasCameraPermission === false) {
    //     alert('No access to camera');
    // }

    // const openCamera = () => {
    //     console.log('open camera running!');
    //     setModalShown(true);
    // };

    // const cameraModal = (
    //     <Modal visible={modalShown}>
    //         <View style={styles.cameraContainer}>
    //             <Camera
    //                 ref={(ref) => setCamera(ref)}
    //                 style={styles.fixedRatio}
    //                 type={type}
    //                 ratio={'1:1'}
    //             />
    //         </View>
    //         <Button
    //             title='Flip Image'
    //             onPress={() => {
    //                 setType(
    //                     type === Camera.Constants.Type.back
    //                         ? Camera.Constants.Type.front
    //                         : Camera.Constants.Type.back
    //                 );
    //             }}></Button>
    //         <Button title='Take Picture' onPress={() => takePicture()} />
    //         {image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
    //     </Modal>
    // );

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

    if (loading) {
        return (
            <View style={styles.container}>
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
                                source={{ uri: imageUrl }}
                                resizeMode='contain'>
                                <Entypo name='camera' size={40} />
                            </ImageBackground>
                        </TouchableOpacity>
                        {/* {cameraModal} */}
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => {
                                if (imageUrl) {
                                    addTask(null, imageUrl);
                                    setImageUrl(null);
                                } else
                                    alert(
                                        'click the camera to upload an image before adding'
                                    );
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
                        {/* {cameraModal} */}
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
    }
};

CreateTask.propTypes = {
    addTask: PropTypes.func.isRequired,
};

export default CreateTask;
