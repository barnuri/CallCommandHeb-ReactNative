import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StatusBar, PermissionsAndroid } from 'react-native';
import Voice from './components/voice';
import getAllPermissions from './helpers/getAllPermissions';

const App = () => {
    useEffect(() => {
        getAllPermissions();
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
