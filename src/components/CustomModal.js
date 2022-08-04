import { Modal, View, Text, Pressable } from 'react-native';
import { styles } from '../assets/styles';
import PropTypes from 'prop-types';

const CustomModal = ({
    modalShown,
    msg,
    lText,
    rText,
    lCallback,
    rCallback,
}) => {
    return (
        <Modal visible={modalShown} transparent={true}>
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <View style={styles.modal}>
                        <Text
                            style={[
                                styles.mediumText,
                                { textAlign: 'center' },
                            ]}>
                            {msg}
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                width: '100%',
                            }}>
                            <Pressable
                                style={[styles.smallButtons, { margin: 10 }]}
                                onPress={() => lCallback()}
                                title='Cancel'>
                                <Text style={styles.smallButtonText}>
                                    {lText}
                                </Text>
                            </Pressable>
                            <Pressable
                                style={[styles.smallButtons, { margin: 10 }]}
                                onPress={() => rCallback()}>
                                <Text style={styles.smallButtonText}>
                                    {rText}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CustomModal;

CustomModal.propTypes = {
    modalShown: PropTypes.bool.isRequired,
    msg: PropTypes.string.isRequired,
    lText: PropTypes.string.isRequired,
    rText: PropTypes.string.isRequired,
    lCallback: PropTypes.func.isRequired,
    rCallback: PropTypes.func.isRequired,
};
