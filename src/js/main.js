import bugs from './modules/details/bugs';
import guestbook from 'squarebook';

bugs()

guestbook({
  container: document.getElementById('guestbook'),
  firebaseConfig: {
    apiKey: "AIzaSyDZL2pOHvTJJb8SEartEwhZDe-8XPIb_ME",
    authDomain: "myguestbook-a3cb4.firebaseapp.com",
    databaseURL: "https://myguestbook-a3cb4.firebaseio.com",
    storageBucket: "myguestbook-a3cb4.appspot.com",
    messagingSenderId: "659560428906"
  }
});

//Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-52955734-1', 'auto');
ga('send', 'pageview');
