import Contacts from 'react-native-contacts';

export default () =>
    new Promise((res: (arr: any[]) => void, rej) => {
        try {
            Contacts.getAll((err, data) => {
                if (err === 'denied') {
                    rej(err);
                }
                res(data);
            });
        } catch (err) {
            rej(err);
        }
    }).catch(err => {
        console.error(err);
        return [] as any[];
    });
