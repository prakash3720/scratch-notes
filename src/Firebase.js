import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyB5vu7wIDcLVV-vp_uo58fWvD1K7-amI8k",
    authDomain: "scratch-4c53b.firebaseapp.com",
    databaseURL: "https://scratch-4c53b.firebaseio.com",
    projectId: "scratch-4c53b",
    storageBucket: "scratch-4c53b.appspot.com",
    messagingSenderId: "943101265839",
    appId: "1:943101265839:web:420fecad696b4cde1f115a",
    measurementId: "G-YN8596JQHP"
};

firebase.initializeApp(firebaseConfig)

// var db = firedb.firestore();

export default firebase