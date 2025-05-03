
"use client";

import { useEffect } from 'react';
import { getMessaging, onMessage, getToken } from 'firebase/messaging';
import { app } from '@/firebase/config';
import { addToast } from '@heroui/react';

export const NotificationHandler = () => {    
    useEffect(() => {
    const messaging = getMessaging(app);

    getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY })
      .then((currentToken) => {
        if (currentToken) {
          console.log('FCM registration token', currentToken);
        } else {
          console.warn('No registration token available. Request permission to generate one.');
        }
      })
      .catch((error) => {
        console.error('Error during token generation', error);
      });
    
      const unsubscribe = onMessage(messaging, (payload) => {
        const { title = '', body = '' } = payload.notification ?? {};
        if (title || body) {
          addToast({title, description:body});
        }
      });

      

    return () => unsubscribe();
  }, []);

  return null;
};