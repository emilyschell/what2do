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
                <View key={index}>
                    <TouchableOpacity
                        onPress={() => {
                            if (earned < quantity) {
                                setTokens(earned + 1);
                                setEarned((prev) => prev + 1);
                                getTokens();
                            }
                        }}
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
                    </TouchableOpacity>
                </View>
            );
        });
    };

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
                <View
                    style={{
                        width: '100%',
                        alignItems: 'center',
                        justifySelf: 'flex-start',
                    }}>
                    <Text
                        style={[
                            styles.largeText,
                            {
                                margin: 0,
                                marginRight: 8,
                                textAlign: 'center',
                            },
                        ]}>
                        {title}
                    </Text>
                </View>
                <View
                    style={[
                        styles.scheduleView,
                        {
                            height: 200,
                            padding: 15,
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                        },
                    ]}>
                    <View
                        style={{
                            alignSelf: 'flex-end',
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
                </View>
                <ScrollView
                    contentContainerStyle={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 350,
                    }}>
                    {getTokens()}
                </ScrollView>
                <CustomSmallButton
                    onPress={() => {
                        setEarned(0);
                        setTokens(0);
                        getTokens();
                    }}
                    style={{ marginBottom: 10 }}>
                    <Text style={styles.smallButtonText}>Reset</Text>
                </CustomSmallButton>
            </View>
        );
    }
};

export default ReadGoal;
