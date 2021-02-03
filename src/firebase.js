import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyATZXbxsodcfVWid32hZNXuDyjBQPm5Cvw",
    authDomain: "instagramclone-7c585.firebaseapp.com",
    databaseURL: "https://instagramclone-7c585.firebaseio.com",
    projectId: "instagramclone-7c585",
    storageBucket: "instagramclone-7c585.appspot.com",
    messagingSenderId: "1174293143",
    appId: "1:1174293143:web:9d8bc0d2fd123bc7e1b7d2",
    measurementId: "G-67QT28S1E0"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };