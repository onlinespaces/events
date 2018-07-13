import firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDPstLUagswfltEaGxxwh7YcgKlQ6HvSrg",
    authDomain: "revents-b3bc1.firebaseapp.com",
    databaseURL: "https://revents-b3bc1.firebaseio.com",
    projectId: "revents-b3bc1",
    storageBucket: "revents-b3bc1.appspot.com",
    messagingSenderId: "473206382789"
};

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

const settings = {
    timestampsInSnapshots: true
};

firestore.settings(settings);

export default firebase;