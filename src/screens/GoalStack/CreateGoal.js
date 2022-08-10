import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import { styles, colors } from '../../assets/styles';
import CustomSmallButton from '../../components/CustomSmallButton';
import CustomModal from '../../components/CustomModal';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { AuthContext } from '../../contexts/AuthContext';
import { DismissKeyboard } from '../../helpers/dismissKeyboard';

const CreateGoal = ({ navigation }) => {
    const { currentUser } = useContext(AuthContext);
    const uid = currentUser.uid;
    const [title, setTitle] = useState('');
    const [action, setAction] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');
    const [reward, setReward] = useState('');
    const [loading, setLoading] = useState(false);
    const [changesMade, setChangesMade] = useState(false);
    const [discardModalShown, setDiscardModalShown] = useState(false);

    const makeGoal = async () => {
        setLoading(true);

        const newGoal = {
            title,
            action,
            quantity,
            unit,
            reward,
            earned: 0,
        };

        // Add goal to user's Firestore collection
        try {
            const goalsColl = collection(db, 'users', uid, 'goals');
            const goalResponse = await addDoc(goalsColl, newGoal);
            if (goalResponse) {
                // Add goal ID to newly created goal
                await setDoc(
                    doc(goalsColl, goalResponse.id),
                    {
                        gid: goalResponse.id,
                    },
                    { merge: true }
                );
                navigation.navigate('ChooseToken', { gid: goalResponse.id });
            }
        } catch (error) {
            console.log('error creating goal: ', error);
        }
    };

    const ConfirmDiscardModal = (
        <CustomModal
            modalShown={discardModalShown}
            msg='Are you sure you want to discard changes?'
            rCallback={() => navigation.goBack()}
            rText='Discard Changes'
            lCallback={() => setDiscardModalShown(false)}
            lText='Cancel'
        />
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large' color={colors.iconColor} />
            </View>
        );
    } else {
        return (
            <DismissKeyboard>
                <View
                    style={[
                        styles.container,
                        { justifyContent: 'flex-start', paddingTop: 15 },
                    ]}>
                    <SafeAreaView />
                    <Text style={styles.largeText}>Set Goal</Text>
                    <View style={styles.formContainer}>
                        <View style={styles.formLine}>
                            <Text style={styles.formText}>Title: </Text>
                            <TextInput
                                style={[styles.goalInput, { width: 250 }]}
                                value={title}
                                onChangeText={(val) => {
                                    setChangesMade(true);
                                    setTitle(val);
                                }}
                            />
                        </View>
                        <View style={styles.formLine}>
                            <Text style={styles.formText}>Do: </Text>
                            <TextInput
                                autoCapitalize='none'
                                style={[styles.goalInput, { width: 250 }]}
                                value={action}
                                onChangeText={(val) => {
                                    setChangesMade(true);
                                    setAction(val);
                                }}
                            />
                        </View>
                        <View style={styles.formLine}>
                            <Text style={styles.formText}>For: </Text>
                            <TextInput
                                autoCapitalize='none'
                                style={styles.goalInput}
                                placeholder='#'
                                value={quantity}
                                onChangeText={(val) => {
                                    setChangesMade(true);
                                    setQuantity(val);
                                }}
                            />
                            <TextInput
                                autoCapitalize='none'
                                style={styles.goalInput}
                                placeholder='units'
                                value={unit}
                                onChangeText={(val) => {
                                    setChangesMade(true);
                                    setUnit(val);
                                }}
                            />
                        </View>
                        <View style={styles.formLine}>
                            <Text style={styles.formText}>Get: </Text>
                            <TextInput
                                autoCapitalize='none'
                                style={[styles.goalInput, { width: 250 }]}
                                value={reward}
                                onChangeText={(val) => {
                                    setChangesMade(true);
                                    setReward(val);
                                }}
                            />
                        </View>
                    </View>

                    {ConfirmDiscardModal}

                    {/* Small Bottom Buttons */}
                    <CustomSmallButton
                        position='left'
                        onPress={() => {
                            if (changesMade) {
                                setDiscardModalShown(true);
                            } else {
                                navigation.goBack();
                            }
                        }}>
                        <Text style={styles.smallButtonText}>Back</Text>
                    </CustomSmallButton>

                    <CustomSmallButton
                        position='right'
                        onPress={() => {
                            if (title && reward && quantity && unit && action) {
                                makeGoal();
                            } else {
                                alert(
                                    'Please enter a title, action, quantity, units and reward.'
                                );
                            }
                        }}>
                        <Text style={styles.smallButtonText}>Create</Text>
                    </CustomSmallButton>
                </View>
            </DismissKeyboard>
        );
    }
};

export default CreateGoal;
