import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getStorage, ref } from "firebase/storage";
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDDXvPPyCJ8JUVV4BgPOXpw3sQWFjIH7Bk",
    authDomain: "real-time-chat-10c5d.firebaseapp.com",
    projectId: "real-time-chat-10c5d",
    storageBucket: "real-time-chat-10c5d.appspot.com",
    messagingSenderId: "534298369372",
    appId: "1:534298369372:web:aabb4174086ba08f4b7599",
    measurementId: "G-44PBCFW4Q5"
};
  

firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var provider = new firebase.auth.GoogleAuthProvider(); 
var db = getFirestore();
export {auth , provider , db};