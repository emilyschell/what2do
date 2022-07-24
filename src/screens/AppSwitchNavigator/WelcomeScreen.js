import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../../../assets/styles';
import CustomBigButton from '../../../components/CustomBigButton';

const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={{ flex: 1, backgroundColor: colors.bgMain }}>
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <Text
                    style={{
                        fontSize: 36,
                        fontFamily: 'Montserrat',
                        fontWeight: '700',
                    }}>
                    Thanks for using
                </Text>
                <Text
                    style={{
                        fontFamily: 'PermanentMarker',
                        fontSize: 36,
                    }}>
                    What2Do
                </Text>
            </View>
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <CustomBigButton
                    style={{
                        width: 280,
                        height: 100,
                        backgroundColor: colors.bgPrimary,
                        borderWidth: 0.5,
                        borderRadius: 10,
                        borderColor: '#000',
                    }}
                    title='Log in'
                    onPress={() => navigation.navigate('LoginScreen')}>
                    <Text>Log in</Text>
                </CustomBigButton>
            </View>
        </View>
    );
};

export default WelcomeScreen;
