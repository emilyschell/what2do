import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../../assets/styles';
import CustomBigButton from '../../../components/CustomBigButton';

const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.container}>
                <Text
                    style={{
                        fontSize: 36,
                        fontFamily: 'Roboto',
                        fontWeight: '400',
                    }}>
                    Thanks for using
                </Text>
                <Text style={styles.largeText}>What2Do</Text>
            </View>
            <View style={[styles.container, { justifyContent: 'flex-start' }]}>
                <CustomBigButton
                    style={styles.bigButtons}
                    title='Log in'
                    onPress={() => navigation.navigate('LoginScreen')}>
                    <Text style={styles.largeText}>Log in</Text>
                </CustomBigButton>
            </View>
        </View>
    );
};

export default WelcomeScreen;
