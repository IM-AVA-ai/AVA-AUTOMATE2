const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { DataConnect } = require('@firebase/data-connect'); // Assuming you're using Data Connect

admin.initializeApp(); // Initialize Firebase Admin SDK

exports.processIncomingSMS = functions.https.onRequest(async (req, res) => {