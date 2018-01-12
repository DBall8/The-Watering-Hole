import Rebase from 're-base';
import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyDpV4Q89RFDkdf4THWOcEkRh2QNqosyF1k",
    authDomain: "webware-a7.firebaseapp.com",
    databaseURL: "https://webware-a7.firebaseio.com"
};

var data = firebase.initializeApp(config);

var base = Rebase.createClass(data.database());

export default base;