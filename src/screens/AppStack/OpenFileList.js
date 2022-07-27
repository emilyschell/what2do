import { View, Text } from 'react-native';
import { styles } from '../../../assets/styles';
import CustomSmallButton from '../../../components/CustomSmallButton';

const OpenFileList = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.largeText}>Open File List Here!</Text>
            <CustomSmallButton
                position='left'
                onPress={() => {
                    navigation.goBack();
                }}>
                <Text style={styles.smallButtonText}>Back</Text>
            </CustomSmallButton>
        </View>
    );
};

export default OpenFileList;
