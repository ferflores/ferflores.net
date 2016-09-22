import bugs from './modules/details/bugs';
import guestbook from 'squarebook';

bugs()

squarebook({
  container: document.getElementById('guestbook'),
  firebaseConfig: {
    apiKey: "AIzaSyDZL2pOHvTJJb8SEartEwhZDe-8XPIb_ME",
    authDomain: "myguestbook-a3cb4.firebaseapp.com",
    databaseURL: "https://myguestbook-a3cb4.firebaseio.com",
    storageBucket: "myguestbook-a3cb4.appspot.com",
    messagingSenderId: "659560428906"
  }
});
