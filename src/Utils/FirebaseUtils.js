import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyBIJXKC8fukznbss6bjLJZdtiWmOrgUt_Q',
  authDomain: 'invest-futuro.firebaseapp.com',
  databaseURL: 'https://invest-futuro.firebaseio.com',
  projectId: 'invest-futuro',
  storageBucket: 'invest-futuro.appspot.com',
  messagingSenderId: '909060958999'
};

const firebaseApp = firebase.initializeApp(config);
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export default firebaseApp;
// export const firebaseDatabase = firebase.database();
