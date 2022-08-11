import { useEffect, useState } from 'react';
import { styles, colors } from '../../assets/styles';
import {
    View,
    Text,
    SafeAreaView,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import CustomSmallButton from '../../components/CustomSmallButton';
import { db } from '../../firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { DismissKeyboard } from '../../helpers/dismissKeyboard';
import CustomModal from '../../components/CustomModal';

const EditGoal = ({ navigation, route }) => {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [action, setAction] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');
    const [reward, setReward] = useState('');
    const [changesMade, setChangesMade] = useState(false);
    const [discardModalShown, setDiscardModalShown] = useState(false);
    const { gid } = route.params;

    useEffect(() => {
        const getGoal = async () => {
            const goalRef = doc(db, 'users', currentUser.uid, 'goals', gid);
            try {
                const goal = await getDoc(goalRef);
                if (goal.exists()) {
                    const goalData = goal.data();
                    setTitle(goalData.title);
                    setAction(goalData.action);
                    setQuantity(goalData.quantity);
                    setUnit(goalData.unit);
                    setReward(goalData.reward);
                    setLoading(false);
                } else {
                    console.log('No such goal!');
                }
            } catch (error) {
                console.log('Error in getting goal: ', { error });
            }
        };
        getGoal();
    }, []);

    const updateGoal = async () => {
        setLoading(true);

        const newGoal = {
            title,
            action,
            quantity,
            unit,
            reward,
        };

        try {
            const goalRef = doc(db, 'users', currentUser.uid, 'goals', gid);
            await setDoc(goalRef, newGoal, { merge: true });
            navigation.navigate('ChooseToken', { gid });
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
                                navigation.navigate('OpenCreateGoal');
                            }
                        }}>
                        <Text style={styles.smallButtonText}>Back</Text>
                    </CustomSmallButton>

                    <CustomSmallButton
                        position='right'
                        onPress={() => {
                            if (title && reward && quantity && unit && action) {
                                updateGoal();
                            } else {
                                alert(
                                    'Please enter a title, action, quantity, units and reward.'
                                );
                            }
                        }}>
                        <Text style={styles.smallButtonText}>Save</Text>
                    </CustomSmallButton>
                </View>
            </DismissKeyboard>
        );
    }
};

export default EditGoal;
