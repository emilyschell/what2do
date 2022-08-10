import { Text, View } from 'react-native';
import { styles, colors } from '../../assets/styles';

const EditGoal = ({ navigation, route }) => {
    const { gid } = route.params;
    return (
        <View style={styles.container}>
            <Text style={styles.mediumText}>Edit Goal id#{gid}</Text>
        </View>
    );
};

export default EditGoal;
