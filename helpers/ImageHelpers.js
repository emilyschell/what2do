import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import { Camera } from 'expo-camera';

export const openImageLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        base64: true,
    });

    return !result.cancelled ? result : false;
};

export const openCamera = async () => {
    // const [camera, setCamera] = useState(null);
    // const [hasCameraPermission, setHasCameraPermission] = useState(null);
    // const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
    const cameraStatus = await Camera.requestCameraPermissionsAsync();

    if (cameraStatus.status !== 'granted') {
        alert('Must give camera permission to select an image');
        return false;
    } else {
        const result = await ImagePicker.launchCameraAsync({
            quality: 0.1,
            base64: true,
            allowsEditing: Platform.OS == 'ios' ? false : true,
            aspect: [1, 1],
        });

        return !result.cancelled ? result : false;
    }
};

export const prepareBlob = async (imageUri) => {
    const blob = await new Promise((resolve, reject) => {
        //new request
        const xml = new XMLHttpRequest();

        //success resolved it
        xml.onload = function () {
            resolve(xml.response);
        };

        //error threw new error
        xml.onerror = function (e) {
            console.log(e);
            reject(new TypeError('Image Upload failed'));
        };

        //set the response type to get the blob
        xml.responseType = 'blob';
        xml.open('GET', imageUri, true);
        //send the request
        xml.send();
    });

    return blob;
};
