const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = admin.initializeApp();
const express = require('express');
const cors = require('cors');

const app = express();

// Automatically allow cross-origin requests
app.use(cors());

app.get('/test', (req, res) => {
    res.send('Hello, World!')
})

// add to database
app.put('/add', (req, res) => {
    let db = firebase.firestore()
    db.collection('entries').add(req.body)
    res.send('ok')
});

// Expose Express API as a single Cloud Function:
exports.entry = functions.https.onRequest(app);
