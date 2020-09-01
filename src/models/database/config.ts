const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(Buffer.from(`${process.env.SA_CLOUDFIRESTORE}`, 'base64').toString('ascii')))
});


let db = admin.firestore();
module.exports = db;