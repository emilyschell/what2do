import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../assets/styles';
import CustomBigButton from '../../components/CustomBigButton';
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import CustomSmallButton from '../../components/CustomSmallButton';

const OpenCreateGoal = ({ navigation }) => {
    const { currentUser } = useContext(AuthContext);

    return (
        <View style={[styles.container, { justifyContent: 'flex-start' }]}>
            <Text style={styles.largeText}>Goals</Text>
            <Text style={styles.mediumText}>
                Welcome{' '}
                {currentUser.displayName ? currentUser.displayName : 'New User'}
                !
            </Text>
            <View style={{ marginTop: 50 }}>
                <CustomBigButton
                    style={[styles.bigButtons, { flexDirection: 'row' }]}
                    onPress={() => navigation.navigate('OpenGoal')}>
                    <FontAwesome name='folder-open' size={40} color='black' />
                    <Text style={styles.largeText}>Open</Text>
                </CustomBigButton>
                <CustomBigButton
                    style={[styles.bigButtons, { flexDirection: 'row' }]}
                    onPress={() => navigation.navigate('CreateGoal')}>
                    <Entypo name='edit' size={40} color='black' />
                    <Text style={styles.largeText}>Make</Text>
                </CustomBigButton>
            </View>
            <CustomSmallButton
                position='left'
                onPress={() => navigation.goBack()}>
                <Text style={styles.smallButtonText}>Back</Text>
            </CustomSmallButton>
        </View>
    );
};

export default OpenCreateGoal;
