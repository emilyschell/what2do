import { StyleSheet } from 'react-native';

export const colors = {
    bgSuccess: '#00B394',
    bgError: '#FF0404',
    bgPrimary: '#FFF7E0',
    bgMain: '#E0E5FF',
    bgTextInput: '#FFF',
    borderColor: '#000',
    textColorDefault: '#000',
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.bgMain,
    },
    textInput: {
        height: 50,
        borderWidth: 0.5,
        borderColor: colors.borderColor,
        marginHorizontal: 40,
        marginBottom: 10,
        color: colors.txtWhite,
        paddingHorizontal: 10,
    },
    smallButtons: {
        borderWidth: 0.5,
        backgroundColor: colors.bgPrimary,
        marginTop: 10,
        width: 200,
    },
    bigButtons: {
        width: 280,
        backgroundColor: colors.bgPrimary,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
