import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyBNbmA9dMg0mp-TmnKQoEvXzW7UqvPdERA',
    authDomain: 'what2do-82722.firebaseapp.com',
    projectId: 'what2do-82722',
    storageBucket: 'what2do-82722.appspot.com',
    messagingSenderId: '507745529505',
    appId: '1:507745529505:web:2616600999b51428728ae0',
    measurementId: 'G-TB57JZLYL9',
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, { experimentalForceLongPolling: true });
const auth = getAuth(app);

export { db, auth };
