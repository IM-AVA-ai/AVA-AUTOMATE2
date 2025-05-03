import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

export const onNewChat = onDocumentCreated("chats/{chatId}", (event) => {
  // Get the chat document
  const chatData = event.data?.data();

  // Get the chatId
  const chatId = event.params.chatId;

  console.log("New chat created:", chatId);

});