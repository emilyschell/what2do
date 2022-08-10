import { useContext, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import { styles, colors } from '../../assets/styles';
import CustomSmallButton from '../../components/CustomSmallButton';
import { AuthContext } from '../../contexts/AuthContext';
import { db } from '../../firebase/firebase';
import { doc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import FileItem from '../../components/FileItem';
import CustomModal from '../../components/CustomModal';

const OpenGoal = ({ navigation }) => {
    const { currentUser } = useContext(AuthContext);
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalShown, setModalShown] = useState(false);
    const [gidToDelete, setGidToDelete] = useState(null);

    useEffect(() => {
        const getGoals = async () => {
            const userRef = doc(db, 'users', currentUser.uid);
            try {
                const goalColl = collection(userRef, 'goals');
                const goalSnap = await getDocs(goalColl);
                const newGoals = [];
                goalSnap.forEach((goal) => newGoals.push(goal.data()));
                setGoals(newGoals);
                setLoading(false);
            } catch (error) {
                console.log('Error in getting goals: ', { error });
            }
        };
        getGoals();
    }, []);

    const onPressDelete = (gid) => {
        setGidToDelete(gid);
        setModalShown(true);
    };

    const deleteGoal = async () => {
        await deleteDoc(
            doc(db, 'users', currentUser.uid, 'goals', gidToDelete)
        );
        const newGoals = goals.filter((goal) => goal.gid !== gidToDelete);
        setGoals(newGoals);
    };

    const ConfirmDeleteModal = (
        <CustomModal
            modalShown={modalShown}
            msg='Are you sure you want to delete goal?'
            lText='Cancel'
            rText='Delete'
            lCallback={() => setModalShown(false)}
            rCallback={() => {
                deleteGoal(gidToDelete);
                setModalShown(false);
            }}
        />
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large' color={colors.iconColor} />
            </View>
        );
    } else if (!goals.length) {
        return (
            <View style={[styles.container, { justifyContent: 'flex-start' }]}>
                <Text style={styles.largeText}>Goals</Text>
                <Text style={styles.mediumText}>
                    You have no goals to show.
                </Text>
                <CustomSmallButton
                    position='left'
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Text style={styles.smallButtonText}>Back</Text>
                </CustomSmallButton>
            </View>
        );
    } else {
        return (
            <View style={[styles.container, { justifyContent: 'flex-start' }]}>
                <Text style={styles.largeText}>Goals</Text>
                {ConfirmDeleteModal}
                <View style={styles.fileList}>
                    <FlatList
                        data={goals}
                        renderItem={({ item }) => {
                            return (
                                <FileItem
                                    id={item.gid}
                                    title={item.title}
                                    onPressCallback={() =>
                                        navigation.navigate('ReadGoal', {
                                            gid: item.gid,
                                        })
                                    }
                                    showDelete={true}
                                    deleteCallback={onPressDelete}
                                    showEdit={true}
                                    editCallback={(id) => {
                                        navigation.navigate('EditGoal', {
                                            gid: id,
                                        });
                                    }}
                                />
                            );
                        }}
                    />
                </View>
                <CustomSmallButton
                    position='left'
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Text style={styles.smallButtonText}>Back</Text>
                </CustomSmallButton>
            </View>
        );
    }
};

export default OpenGoal;
