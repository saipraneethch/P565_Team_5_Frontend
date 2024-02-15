import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyABQpNMXC2U4T2KQzqP693-WZK1QsUm_qI",
    authDomain: "lmss-414417.firebaseapp.com",
    projectId: "lmss-414417",
    storageBucket: "lmss-414417.appspot.com",
    messagingSenderId: "415342914533",
    appId: "1:415342914533:web:70bd7f860c7fae9cb99d0c",
    measurementId: "G-CBYRR5RSLC"
  };

const firebaseapp = initializeApp(firebaseConfig);

export default firebaseapp;