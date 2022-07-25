import { initializeApp } from 'firebase/app';

import { firebaseConfig } from './config';

const firebase = initializeApp(firebaseConfig);
export default firebase;
