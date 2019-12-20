import Contacts from 'react-native-contacts';

export type CustomContact = Contacts.Contact & { fullDisplayName: string };

export default () =>
    new Promise((res: (arr: any[]) => void, rej) => {
        try {
            Contacts.getAll((err, data) => {
                if (err === 'denied') {
                    rej(err);
                }
                res(data as CustomContact[]);
            });
        } catch (err) {
            rej(err);
        }
    })
        .catch(err => {
            console.error(err);
            return [] as CustomContact[];
        })
        .then(lst => {
            const list = lst as CustomContact[];
            for (const item of list) {
                item.familyName = item.familyName || '';
                item.backTitle = item.backTitle || '';
                item.company = item.company || '';
                item.givenName = item.givenName || '';
                item.jobTitle = item.jobTitle || '';
                item.middleName = item.middleName || '';
                item.prefix = item.prefix || '';
                item.suffix = item.suffix || '';
                item.fullDisplayName = `${item.prefix} ${item.givenName} ${item.middleName} ${item.familyName} ${item.suffix}`;
                item.phoneNumbers.forEach(x => {
                    x.label = x.label || '';
                    x.number = x.number || '';
                });
            }
            return list;
        });
