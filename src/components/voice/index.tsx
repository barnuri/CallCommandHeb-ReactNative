import React, { useState, useEffect } from 'react';
import { Text, View, Image, TouchableHighlight, AppState } from 'react-native';
import VoiceHelper from 'react-native-voice';
import { styles } from './styles';
import getContacts from '../../helpers/getContacts';
import Contacts from 'react-native-contacts';
import permStrJoin from '../../helpers/perm';
import call from 'react-native-immediate-phone-call';

const Voice = () => {
    const [error, setError] = useState('');
    const [appState, setAppState] = useState('');

    const [partialResults, setPartialResults] = useState([] as string[]);
    const [results, setResults] = useState([] as string[]);
    const [contacts, setContacts] = useState([] as Contacts.Contact[]);
    const [foundPerson, setFoundPerson] = useState(false);

    useEffect(() => {
        getContacts().then(res => setContacts(res));
        VoiceHelper.onSpeechResults = e => setResults(e.value);
        VoiceHelper.onSpeechPartialResults = e => setPartialResults(e.value);
        VoiceHelper.onSpeechError = e => {
            console.log('onSpeechError: ', e);
            setError(JSON.stringify(e.error));
        };
        AppState.addEventListener('change', handleAppStateChange);
        startRecognizing();
    }, []);

    const handleAppStateChange = nextAppState => {
        if (appState.match(/inactive|background/) && nextAppState === 'active') {
            startRecognizing();
        }
        setAppState(nextAppState);
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
        console.log(callReq);
        const permsWithPhone = contacts.map(x => ({
            perms: permStrJoin([x.familyName || '', x.givenName || '', x.prefix || '', x.middleName || '']),
            contact: x,
        }));
        const matchContacts = permsWithPhone
            .filter(x => x.perms.findIndex(perm => callReq.findIndex(tryMatch => perm.includes(tryMatch)) >= 0) >= 0)
            .map(x => x.contact)
            .sort((a, b) => (a.givenName || '').localeCompare(b.givenName || ''));

        if (matchContacts.length <= 0) {
            console.log('no matchContacts');
            return;
        }
        setFoundPerson(true);
        console.log(matchContacts[0]);

        const phones = matchContacts[0].phoneNumbers.filter(x => (x.number || '').indexOf('05') >= 0).map(x => x.number);
        const telphones = matchContacts[0].phoneNumbers.filter(x => (x.number || '').indexOf('05') < 0).map(x => x.number);

        console.log('found', phones, telphones);

        const phonesMatchs = [...phones, ...telphones];
        const callTo = phonesMatchs[0];
        console.log(callTo);

        call.immediatePhoneCall(callTo);
    }, [results, partialResults]);

    const startRecognizing = async () => {
        setFoundPerson(false);
        setResults([]);
        setPartialResults([]);
        setError('');

        try {
            await VoiceHelper.start('he-IL');
        } catch (e) {
            console.error(e);
        }
    };

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
        </View>
    );
};

export default Voice;
