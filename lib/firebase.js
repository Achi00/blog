
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8EJfBGPVgUDYuYrT1en2GgQQ0o9XcmcM",
  authDomain: "blog-88a51.firebaseapp.com",
  projectId: "blog-88a51",
  storageBucket: "blog-88a51.appspot.com",
  messagingSenderId: "963452229768",
  appId: "1:963452229768:web:28830e582cc239856b673d"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

// auth exports
export const auth = firebase.auth()
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

// firebase exports
export const firestore = firebase.firestore()
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const increment = firebase.firestore.FieldValue.increment

// storage exports
export const storage = firebase.storage()
export const STATE_CHANGE = firebase.storage.TaskEvent.STATE_CHANGED

// helper functions
// get users/{uid} document with username
// @params { string } username
export async function getUserWithUsername(username) {
  const usersRef = firestore.collection('users');
  const query = usersRef.where('username', '==', username).limit(1);
  const userDoc = (await query.get()).docs[0];
  return userDoc;
}

// converts firestore document to json
export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };
}