import firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDPstLUagswfltEaGxxwh7YcgKlQ6HvSrg",
    authDomain: "revents-b3bc1.firebaseapp.com",
    databaseURL: "https://revents-b3bc1.firebaseio.com",
    projectId: "revents-b3bc1",
    storageBucket: "",
    messagingSenderId: "473206382789"
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;