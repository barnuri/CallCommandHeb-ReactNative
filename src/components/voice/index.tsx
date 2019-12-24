import React, { useState, useEffect } from 'react';
import { Text, View, Image, TouchableHighlight, AppState } from 'react-native';
import VoiceHelper from 'react-native-voice';
import { styles } from './styles';
import getContacts, { CustomContact } from '../../helpers/getContacts';
import permStrJoin from '../../helpers/perm';
import call from 'react-native-immediate-phone-call';
import getAllPermissions from '../../helpers/getAllPermissions';

const Voice = () => {
    const [error, setError] = useState('');
    const [appState, setAppState] = useState('');

    const [partialResults, setPartialResults] = useState([] as string[]);
    const [results, setResults] = useState([] as string[]);
    const [contacts, setContacts] = useState([] as CustomContact[]);
    const [foundPerson, setFoundPerson] = useState('');

    useEffect(() => {
        AppState.addEventListener('change', handleAppStateChange);

        getAllPermissions().then(() => {
            getContacts().then(res => setContacts(res));
            VoiceHelper.onSpeechResults = e => setResults(e.value);
            VoiceHelper.onSpeechPartialResults = e => setPartialResults(e.value);
            VoiceHelper.onSpeechError = e => {
                console.log('onSpeechError: ', e);
                setError(JSON.stringify(e.error));
            };
            startRecognizing();
        });
    }, []);

    const handleAppStateChange = nextAppState => {
        if (appState.match(/inactive|background/) && nextAppState === 'active') {
            startRecognizing();
        }
        setAppState(nextAppState);
    };
    const destroyVoiceListener = async () => {
        await VoiceHelper.cancel().catch(() => {});
        await VoiceHelper.stop().catch(() => {});
        await VoiceHelper.destroy().catch(() => {});
        await VoiceHelper.removeAllListeners().catch(() => {});
    };

    useEffect(() => {
        if (foundPerson) {
            console.log('all ready found');
            return;
        }
        if (contacts.length <= 0) {
            console.log('no contacts');
            return;
        }

        const lists = [...results, ...partialResults.filter(x => x.length >= 3)];
        const callReq = lists; //.filter(x => x.indexOf('תתקשר ל') >= 0).map(x => x.substr('תתקשר ל'.length));
        if (callReq.length <= 0) {
            console.log('no callReq');
            return;
        }
        const permsWithPhone = contacts.map(x => ({
            perms: permStrJoin([x.familyName, x.givenName, x.prefix, x.middleName, x.suffix]),
            contact: x,
        }));
        const matchContacts = permsWithPhone
            .filter(x => x.perms.findIndex(perm => callReq.findIndex(tryMatch => perm.includes(tryMatch)) >= 0) >= 0)
            .map(x => x.contact)
            .sort((a, b) => a.givenName.localeCompare(b.givenName));

        if (matchContacts.length <= 0) {
            console.log('no matchContacts');
            return;
        }
        setFoundPerson(matchContacts[0].fullDisplayName);

        const phones = matchContacts[0].phoneNumbers.filter(x => x.number.indexOf('05') >= 0).map(x => x.number);
        const telphones = matchContacts[0].phoneNumbers.filter(x => x.number.indexOf('05') < 0).map(x => x.number);

        const phonesMatchs = [...phones, ...telphones];
        const callTo = phonesMatchs[0];
        setFoundPerson(matchContacts[0].fullDisplayName + ' - ' + callTo);

        destroyVoiceListener();
        call.immediatePhoneCall(callTo);
    }, [results, partialResults]);

    const startRecognizing = async () =>
        getAllPermissions().then(async () => {
            setFoundPerson('');
            setResults([]);
            setPartialResults([]);
            setError('');

            try {
                await VoiceHelper.start('he-IL');
            } catch (e) {
                console.error(e);
                await destroyVoiceListener();
            }
        });
    return (
        <View style={styles.container}>
            <TouchableHighlight onPress={startRecognizing}>
                <Image style={styles.button} source={require('./button.png')} />
            </TouchableHighlight>

            <Text style={styles.stat}>תוצאות</Text>
            <Text style={styles.stat}>{results.toString()}</Text>

            <Text style={styles.stat}>תוצאות חלקיות</Text>
            <Text style={styles.stat}>{partialResults.toString()}</Text>

            {error ? <Text style={styles.stat}>{`Error: ${error}`}</Text> : <Text />}
            {foundPerson ? <Text style={styles.stat}>{`התאמה: ${foundPerson}`}</Text> : <Text />}
        </View>
    );
};

export default Voice;
