import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface AppSettings {
    getUrl: () => Promise<string>;
    BASE_URL: () => Promise<string>;
}

const getUrlFromStorage = async (): Promise<string> => {
    try {
        const val = await AsyncStorage.getItem('selectenv');
        let currentURL = '';

        if (val === 'deve') {
            currentURL = '';
            ;
        } else if (val === 'val') {
            currentURL = '';

        }
        console.log('currentURL',currentURL)
        return currentURL;
    } catch (error) {
        console.error('Error retrieving environment setting:', error);
        return ''; 
    }
};

const AppSettings: AppSettings = {
    getUrl: async () => {
        const url = await getUrlFromStorage();
        return url;
    },
    BASE_URL: async () => {
        return await AppSettings.getUrl();
    },

};

export default AppSettings;
