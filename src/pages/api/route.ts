import { NextRequest, NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, addDoc, collection, updateDoc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from '../../firebase/config';
import { sendEmail } from '../../services/email'; // Corrected relative path for email service as well

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function POST(req: NextRequest) {
  try {
    const { userId, subject, message, eventType } = await req.json();

    if (!userId || !subject || !message || !eventType) {
      return new NextResponse(JSON.stringify({ error: 'Missing required parameters' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    const userData = userDocSnap.data();
    const userEmail = userData?.email;

    // Notification preferences logic
    const notificationPreferencesRef = doc(db, 'users', userId, 'notificationPreferences', 'email');
    const notificationPreferencesSnap = await getDoc(notificationPreferencesRef);
    let preferences = notificationPreferencesSnap.data();
    
    if (!preferences) {
      // If no preferences exist, set default preferences
      preferences = { [eventType]: true }; // Default to enabled
      await setDoc(notificationPreferencesRef, preferences);
    } else if (preferences[eventType] === false) {
        return new NextResponse(JSON.stringify({ error: 'User has disabled notifications for this event type' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        });
    }

      const emailResult = await sendEmail({ to: userEmail, subject, body: message });
    
    if (!emailResult.success) {
      console.error('Error sending email:', emailResult.error);
      return new NextResponse(JSON.stringify({ error: 'Failed to send email' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    await addDoc(collection(db, 'notifications'), {
        userId,
        type: 'email',
        subject,
        message,
        status: 'sent',
        timestamp: new Date(),
        eventType
    });

    return new NextResponse(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error sending email:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
