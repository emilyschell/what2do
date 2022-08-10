import React, { useContext } from 'react';
import { View, Text, Image, ImageBackground } from 'react-native';
import { styles } from '../../assets/styles';
import CustomBigButton from '../../components/CustomBigButton';
import { AuthContext } from '../../contexts/AuthContext';

const Home = ({ navigation }) => {
    const { currentUser } = useContext(AuthContext);

    return (
        <View style={[styles.container, { justifyContent: 'space-around' }]}>
            <View style={{ flex: 1 }}>
                <Text style={styles.largeText}>What2Do</Text>
                <Text style={styles.mediumText}>
                    Welcome{' '}
                    {currentUser.displayName
                        ? currentUser.displayName
                        : 'New User'}
                    !
                </Text>
            </View>
            <View style={{ flex: 2 }}>
                <CustomBigButton
                    style={[
                        styles.bigButtons,
                        { flexDirection: 'row', justifyContent: 'flex-start' },
                    ]}
                    onPress={() => navigation.navigate('Schedules')}>
                    <Image
                        source={require('../../assets/icons/SchedulesIcon.png')}
                        style={{ height: 55, width: 48, marginLeft: 10 }}
                    />
                    <Text style={styles.largeText}>Schedules</Text>
                </CustomBigButton>
                <CustomBigButton
                    style={[
                        styles.bigButtons,
                        { flexDirection: 'row', justifyContent: 'center' },
                    ]}
                    onPress={() => navigation.navigate('Goals')}>
                    <Image
                        source={require('../../assets/icons/GoalsIcon.png')}
                        style={{
                            height: 55,
                            width: 48,
                            marginLeft: 10,
                        }}
                    />
                    <Text
                        style={[
                            styles.largeText,
                            { flex: 1, textAlign: 'center' },
                        ]}>
                        Goals
                    </Text>
                </CustomBigButton>
            </View>
        </View>
    );
};

export default Home;
