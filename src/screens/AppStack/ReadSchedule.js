import { styles } from '../../../assets/styles';
import { View, Text } from 'react-native';
import { snapshotToArray } from '../../../helpers/firebaseHelpers';
import { ScheduleContext } from '../../contexts/ScheduleContext';
import { useContext } from 'react';
import CustomSmallButton from '../../../components/CustomSmallButton';

const ReadSchedule = ({ navigation }) => {
    const { title, tasks, type } = useContext(ScheduleContext);
    return (
        <View style={styles.container}>
            <Text style={styles.largeText}>
                {type} schedule: {title}
            </Text>
            {tasks.map((task) => {
                return <Text>{task.text}</Text>;
            })}
            <Text style={styles.largeText}></Text>
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

export default ReadSchedule;
