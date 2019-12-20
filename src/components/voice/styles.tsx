import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
const screenHeight = Math.round(Dimensions.get('window').height);
const buttonSize = 100;
export const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        marginTop: screenHeight * 0.5 - buttonSize,
    },
    stat: {
        textAlign: 'center',
        color: '#B0171F',
        marginTop: 20,
        fontSize: 20,
    },
    button: {
        width: buttonSize,
        height: buttonSize,
    },
});
