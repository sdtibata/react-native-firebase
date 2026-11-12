// firebase/config.js
import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Pega aquí el objeto que te da la consola de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAtYfvnMJKxXkko5yzyS7kqjke_ImaX_dQ",
  authDomain: "pokeapp-guia.firebaseapp.com",
  projectId: "pokeapp-guia",
  storageBucket: "pokeapp-guia.firebasestorage.app",
  messagingSenderId: "539416724122",
  appId: "1:539416724122:web:a974cdb95dfa4069381523"
};

const app = initializeApp(firebaseConfig);

// En el celular la sesión se guarda con AsyncStorage para no pedir
// el login cada vez que abres la app. En el navegador basta getAuth.
export const auth = Platform.OS === 'web'
  ? getAuth(app)
  : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

export const db = getFirestore(app);
