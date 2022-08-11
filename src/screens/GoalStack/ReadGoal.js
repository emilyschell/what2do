import { useEffect, useState } from 'react';
import { styles, colors } from '../../assets/styles';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Image,
    ScrollView,
} from 'react-native';
import CustomSmallButton from '../../components/CustomSmallButton';
import { db } from '../../firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import CustomModal from '../../components/CustomModal';

const ReadGoal = ({ navigation, route }) => {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [action, setAction] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');
    const [reward, setReward] = useState('');
    const [earned, setEarned] = useState(0);
    const [tokenUrl, setTokenUrl] = useState('');
    const [modalShown, setModalShown] = useState(false);
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
                    setEarned(goalData.earned);
                    setTokenUrl(goalData.tokenUrl);
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

    const setTokens = async (newEarned) => {
        const goalRef = doc(db, 'users', currentUser.uid, 'goals', gid);
        await setDoc(goalRef, { earned: newEarned }, { merge: true });
    };

    const getTokens = () => {
        let tokenArray = [];
        for (let i = 0; i < earned; i++) {
            tokenArray.push('earned');
        }
        for (let j = 0; j < quantity - earned; j++) {
            tokenArray.push('unearned');
        }
        return tokenArray.map((token, index) => {
            return (
                <View
                    key={index}
                    style={[
                        styles.token,
                        token === 'earned'
                            ? {
                                  borderColor: colors.bgSuccess,
                              }
                            : null,
                    ]}>
                    {token === 'earned' ? (
                        <Image
                            source={{ uri: tokenUrl }}
                            style={{
                                borderRadius: 10,
                                height: 73,
                                width: 73,
                                margin: 0,
                                borderColor: colors.bgSuccess,
                                borderWidth: 2,
                            }}
                        />
                    ) : null}
                </View>
            );
        });
    };

    const resetModal = (
        <CustomModal
            modalShown={modalShown}
            msg='Are you sure you want to clear all tokens?'
            lCallback={() => setModalShown(false)}
            lText='Cancel'
            rCallback={() => {
                setEarned(0);
                setTokens(0);
                getTokens();
                setModalShown(false);
            }}
            rText='Clear tokens'
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
            <View style={[styles.container, { paddingTop: 0 }]}>
                <SafeAreaView />
                <View style={styles.goalView}>
                    <View
                        style={{
                            position: 'absolute',
                            right: 10,
                            top: 10,
                            width: 20,
                            zIndex: 1000,
                        }}>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('OpenCreateGoal')
                            }>
                            <FontAwesome name='close' size={24} />
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            width: '100%',
                            alignItems: 'center',
                        }}>
                        <Text
                            style={[
                                styles.largeText,
                                {
                                    lineHeight: 40,
                                    paddingTop: 20,
                                    margin: 0,
                                    marginRight: 20,
                                    textAlign: 'center',
                                },
                            ]}>
                            {title}
                        </Text>
                    </View>
                    <Text style={[styles.formText, { marginVertical: 10 }]}>
                        Do:{' '}
                        <Text style={{ fontFamily: 'Arial' }}>{action} </Text>
                    </Text>
                    <Text style={[styles.formText, { marginBottom: 10 }]}>
                        For:{' '}
                        <Text style={{ fontFamily: 'Arial' }}>
                            {' '}
                            {quantity} {unit}
                        </Text>
                    </Text>
                    <Text style={[styles.formText, { marginBottom: 10 }]}>
                        Get:{' '}
                        <Text style={{ fontFamily: 'Arial' }}>{reward}</Text>
                    </Text>
                    <Text style={[styles.formText, { marginBottom: 10 }]}>
                        Progress:{' '}
                        <Text style={{ fontFamily: 'Arial' }}>
                            <Text
                                style={{
                                    color: colors.bgSuccess,
                                    fontWeight: 'bold',
                                }}>
                                {earned}
                            </Text>{' '}
                            of {quantity}
                        </Text>
                    </Text>
                    <ScrollView
                        contentContainerStyle={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        {getTokens()}
                    </ScrollView>
                </View>
                {resetModal}

                <CustomSmallButton
                    position='left'
                    onPress={() => setModalShown(true)}
                    style={{
                        backgroundColor: colors.bgError,
                        height: 30,
                        right: 10,
                        bottom: -10,
                        width: 70,
                    }}>
                    <Text style={styles.smallButtonText}>Reset</Text>
                </CustomSmallButton>
                <CustomSmallButton
                    position='right'
                    onPress={() => {
                        if (earned < quantity) {
                            setTokens(earned + 1);
                            setEarned((prev) => prev + 1);
                            getTokens();
                        }
                    }}
                    style={{
                        alignItems: 'center',
                        backgroundColor: colors.bgSuccess,
                        bottom: -10,
                        height: 50,
                        left: 10,
                        width: 50,
                    }}>
                    <Text style={[styles.addButtonText, { fontSize: 35 }]}>
                        +
                    </Text>
                </CustomSmallButton>
            </View>
        );
    }
};

export default ReadGoal;
