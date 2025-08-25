const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// Note: We will set the credentials via environment variables in Netlify
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });
}

const db = admin.firestore();

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const formData = new URLSearchParams(event.body);
        const email = formData.get('email');
        const password = formData.get('password');
        const fullName = formData.get('fullName');
        const phone = formData.get('phone');
        const address = formData.get('address');

        // Step 1: Create user in Firebase Authentication
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: fullName,
            emailVerified: false // Firebase will send a verification email
        });

        // Step 2: Save additional user info in Firestore
        await db.collection('users').doc(userRecord.uid).set({
            fullName: fullName,
            phone: phone,
            address: address,
            email: email,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Step 3: Generate email verification link
        const link = await admin.auth().generateEmailVerificationLink(email);
        // In a real app, you would use a service like SendGrid to email this link.
        // For now, we'll return it in the response for testing.

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                message: 'ثبت نام با موفقیت انجام شد! لطفاً ایمیل خود را برای فعال‌سازی حساب کاربری چک کنید.',
                uid: userRecord.uid,
                verificationLink: link // For testing purposes
            })
        };

    } catch (error) {
        console.error('Signup Error:', error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: error.message })
        };
    }
};