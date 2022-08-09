import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    SafeAreaView,
    Image,
    TouchableOpacity,
} from 'react-native';
import { styles, colors } from '../../assets/styles';
import CustomSmallButton from '../../components/CustomSmallButton';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { AuthContext } from '../../contexts/AuthContext';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImageHelpers from '../../helpers/ImageHelpers';
import { storage } from '../../firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { manipulateAsync } from 'expo-image-manipulator';
import Check from '../../assets/tokens/Check.png';
import Money from '../../assets/tokens/Money.png';
import Smile from '../../assets/tokens/Smile.png';
import Star from '../../assets/tokens/Star.png';
import ThumbsUp from '../../assets/tokens/ThumbsUp.png';
import Toothbrush from '../../assets/tokens/Toothbrush.png';

const ChooseToken = ({ navigation, route }) => {
    const { currentUser } = useContext(AuthContext);
    const uid = currentUser.uid;
    const { gid } = route.params;
    const [loading, setLoading] = useState(false);
    const [tokenUrl, setTokenUrl] = useState(null);
    const { showActionSheetWithOptions } = useActionSheet();

    const uploadImage = async (image) => {
        let fileName = new Date().toString().replace(/\s+/g, '') + '.jpg';
        try {
            const storageRef = ref(
                storage,
                `'users'/${uid}/'tokens'/${fileName}`
            );
            const shrunkImage = await manipulateAsync(image.uri, [
                { resize: { width: 100 } },
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
            setTokenUrl(downloadUrl);
            setLoading(false);
        }
    };

    const openCamera = async () => {
        const result = await ImageHelpers.openCamera();
        if (result) {
            setLoading(true);
            const downloadUrl = await uploadImage(result);
            setTokenUrl(downloadUrl);
            setLoading(false);
        }
    };

    const addToken = () => {
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

    const uploadToken = async (tokenName) => {
        setLoading(true);
        let fileName = `${tokenName}.png`;

        //search to see if it already exists in user's storage
        const fileRef = ref(storage, `'users'/${uid}/'tokens'/${fileName}`);
        try {
            let downloadUrl = await getDownloadURL(fileRef);
            if (downloadUrl) {
                setTokenUrl(downloadUrl);
                setLoading(false);
                return;
            }
        } catch (error) {
            console.log('image does not exist in storage yet: ', error);
        }
        //take token state, convert image to blob, upload to Storage, and get URL to set tokenUrl
        let img;
        switch (tokenName) {
            case 'check':
                img = Check;
                break;
            case 'money':
                img = Money;
                break;
            case 'star':
                img = Star;
                break;
            case 'smile':
                img = Smile;
                break;
            case 'toothbrush':
                img = Toothbrush;
                break;
            case 'thumbsUp':
                img = ThumbsUp;
        }
        const imageUri = Image.resolveAssetSource(img).uri;
        try {
            const storageRef = ref(
                storage,
                `'users'/${uid}/'tokens'/${fileName}`
            );
            const blob = await ImageHelpers.prepareBlob(imageUri);
            await uploadBytes(storageRef, blob);
            let downloadUrl = await getDownloadURL(storageRef);
            blob.close();
            setTokenUrl(downloadUrl);
            setLoading(false);
        } catch (error) {
            console.log('error uploading token image:', error);
            setLoading(false);
        }
    };

    const makeBoard = async () => {
        const goalRef = doc(db, 'users', uid, 'goals', gid);
        await setDoc(goalRef, { tokenUrl }, { merge: true });
        navigation.navigate('ReadGoal', { gid });
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large' color={colors.iconColor} />
            </View>
        );
    } else {
        return (
            <View
                style={[
                    styles.container,
                    { justifyContent: 'flex-start', paddingTop: 50 },
                ]}>
                <SafeAreaView />
                <Text style={styles.largeText}>Choose Token</Text>

                <View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 300,
                    }}>
                    <TouchableOpacity
                        onPress={() => {
                            uploadToken('check');
                        }}>
                        <Image
                            source={{
                                uri: Image.resolveAssetSource(Check).uri,
                            }}
                            style={styles.token}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            uploadToken('money');
                        }}>
                        <Image
                            source={{
                                uri: Image.resolveAssetSource(Money).uri,
                            }}
                            style={styles.token}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            uploadToken('smile');
                        }}>
                        <Image
                            source={{
                                uri: Image.resolveAssetSource(Smile).uri,
                            }}
                            style={styles.token}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            uploadToken('star');
                        }}>
                        <Image
                            source={{ uri: Image.resolveAssetSource(Star).uri }}
                            style={styles.token}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            uploadToken('thumbsUp');
                        }}>
                        <Image
                            source={{
                                uri: Image.resolveAssetSource(ThumbsUp).uri,
                            }}
                            style={styles.token}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            uploadToken('toothbrush');
                        }}>
                        <Image
                            source={{
                                uri: Image.resolveAssetSource(Toothbrush).uri,
                            }}
                            style={styles.token}
                        />
                    </TouchableOpacity>
                </View>
                <CustomSmallButton onPress={() => addToken()}>
                    <Text style={styles.smallButtonText}>Upload...</Text>
                </CustomSmallButton>
                <Image style={styles.token} source={{ uri: tokenUrl }} />

                {/* Small Bottom Buttons */}
                <CustomSmallButton
                    position='left'
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Text style={styles.smallButtonText}>Back</Text>
                </CustomSmallButton>

                <CustomSmallButton
                    position='right'
                    onPress={() => {
                        if (tokenUrl) {
                            makeBoard();
                        } else {
                            alert('Please select or upload a token first.');
                        }
                    }}>
                    <Text style={styles.smallButtonText}>Create</Text>
                </CustomSmallButton>
            </View>
        );
    }
};

export default ChooseToken;
