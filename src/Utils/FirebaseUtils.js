import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyCiqlUC6KaeGpUByMU2-c0_INCgIn6so5k",
  authDomain: "learnreadenglish.firebaseapp.com",
  databaseURL: "https://learnreadenglish.firebaseio.com",
  projectId: "learnreadenglish",
  storageBucket: "learnreadenglish.appspot.com",
  messagingSenderId: "198650835278"
};

const firebaseApp = firebase.initializeApp(config);
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export default firebaseApp;
// export const firebaseDatabase = firebase.database();
