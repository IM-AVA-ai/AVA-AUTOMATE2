// src/services/campaigns.ts
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  getDoc,
  Timestamp, deleteDoc,
} from 'firebase/firestore';
import { createMessage, } from './messages';
import { sendNotification } from './notifications';
import { createChat } from './chats';
import { db } from '@/firebase/config';

export interface NewCampaign {
  name: string;
  message: string;
  status: string;
}
interface CampaignData {
  [key: string]: any;
}
export interface Campaign {
  id: string;
  name: string;
  message: string;
  status: string;
  [key: string]: any;
}
export interface CampaignLead {
  leadId: string;
  campaignId: string;
  message?: string;
  status: 'pending' | 'sent' | 'failed';
}

export const createCampaign = async (
  userId: string,
  campaignData: NewCampaign
) => {
  try {
    const docRef = await addDoc(collection(db, `users/${userId}/campaigns`), {
      ...campaignData,
      createdAt: Timestamp.now(),
    });
    return { id: docRef.id, ...campaignData };
  } catch (error: any) {
    console.error('Error creating campaign:', error);
    throw error;
  }
};

export const getCampaign = async (userId: string, campaignId: string) => {
  try {
    const docSnap = await getDoc(
      doc(db, `users/${userId}/campaigns`, campaignId)
    );
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error: any) {
    console.error('Error getting campaign:', error);
    return null;
  }
};

export const getCampaigns = async (userId: string) => {
  try {
    const q = query(collection(db, `users/${userId}/campaigns`));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Campaign));
  } catch (error: any) {
    console.error('Error getting campaigns:', error);
    return [];
  }
};

export const updateCampaign = async (
  userId: string,
  campaignId: string,
  updatedData: CampaignData
) => {
  try {
    await updateDoc(
      doc(db, `users/${userId}/campaigns`, campaignId),
      updatedData
    );
    return { id: campaignId, ...updatedData };
  } catch (error: any) {
    console.error('Error updating campaign:', error);
    return null;
  }
};

export const updateCampaignStatus = async (
  campaignId: string,
  status: string,
  userId: string
) => {
  try {
    const campaignRef = doc(db, `users/${userId}/campaigns`, campaignId);
    await updateDoc(campaignRef, { status });
    if (status === 'Completed') {
      const campaignData = (await getDoc(campaignRef)).data();
      await sendNotification(
        userId,
        'Campaign completed',
        `The campaign ${campaignData?.name} has been completed.`
      );
    }
    return true;
  } catch (error: any) {
    console.error('Error updating campaign status:', error);
    return false;
  }
};

export const sendCampaign = async (
  userId: string,
  campaignId: string,
  leadIds: string[]
) => {
  try {

    const campaign = await getCampaign(userId, campaignId);
     if (!campaign) {
      throw new Error('Campaign not found');
    }
    const { name, message, id } = campaign;
    await updateCampaign(userId, campaignId, {
      status: 'Active'
    })
      //send notification
    await sendNotification(userId, 'Campaign sent', `The campaign ${name} has been sent`);
    
    await Promise.all(
      leadIds.map(async (leadId) => {


        const messageUserId = userId;
        // Create and send the message
        const { id: messageId } = await createMessage(
          messageUserId,
          leadId,
          campaignId,
          message
        );
        await sendMessage(messageUserId, leadId, messageId, message);
        //Update lead
        await updateDoc(doc(db, `users/${userId}/leads`, leadId), {
          campaignId: id,
        });
      })
    );

    return true;
  } catch (error: any) {
    console.error('Error sending campaign:', error);
    return false;
  }
};

export const addLeadsToCampaign = async (
  userId: string,
  campaignId: string,
  leadIds: string[]
) => {
  try {

    const campaignLeadsCollection = collection(db, `users/${userId}/campaigns/${campaignId}/leads`);

    const docRef = doc(db, `users/${userId}/campaigns`, campaignId);
    const campaign = await getDoc(docRef);
    if (!campaign.exists() || !('name' in campaign.data() as Campaign) || !('message' in campaign.data() as Campaign)) {
      return;
    }
    const campaignData = campaign.data() as Campaign;

    const batch = [];

    for (const leadId of leadIds) {
        if(!campaignData){
            return
        }
        if(campaignData){
            
            batch.push(
        addDoc(campaignLeadsCollection, {
            leadId,
            campaignId,
            status: 'pending',
          })
      );
        }
      
    }

    await Promise.all(batch);
    await Promise.all(
      batch.map(async () => {
        const campaignLeads = await getDocs(campaignLeadsCollection);

          campaignLeads.forEach(async (campaignLead) => {

          const messageId = await createMessage(
            campaignLead.data().leadId,
            campaignData.name,
            campaignData.message,
            userId
          );

        });})
    );
  } catch (error: any) {
    console.error('Error sending campaign:', error);
    return false;
  }
};



export const deleteCampaign = async (userId: string, campaignId: string) => {
  try {
    await deleteDoc(doc(db, `users/${userId}/campaigns`, campaignId));
    return true;
  } catch (error: any) {
    console.error('Error deleting campaign:', error);
    return false;
  }
};

