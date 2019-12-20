import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StatusBar, PermissionsAndroid } from 'react-native';
import Voice from './components/voice';

const App = () => {
    useEffect(() => {
        PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        ]);
    }, []);

    return (
        <>
            <StatusBar barStyle='dark-content' />
            <SafeAreaView>
                <ScrollView contentInsetAdjustmentBehavior='automatic'>
                    <Voice />
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

export default App;
