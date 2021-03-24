import firebase from 'firebase/app';
import "firebase/auth"

const app = firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASES_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASES_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASES_APP_ID
});

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
export const auth = app.auth();
export default app;