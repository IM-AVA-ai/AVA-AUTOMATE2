// src/services/leads.ts
import {
  getFirestore,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  WhereFilterOp,
} from 'firebase/firestore'; 
import Papa from 'papaparse';
import { collection } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  status: string;
  email?: string;
  city?: string;
  state?: string;
  country?: string;
  source?: string;
  createdAt: Date;

  notes?: string;
  [key: string]: any;
}


interface LeadData {
  
  [key: string]: any;
}


export const createLead = async (userId: string, newLead: NewLead) => {
  const db = getFirestore();
  try {
    const docRef = await addDoc(collection(db, `users/${userId}/leads`), { ...newLead, createdAt: Timestamp.now() });
    return { id: docRef.id, ...newLead }; 
  } catch (error: any) {
    console.error('Error creating lead:', error);
    throw error;
  }
};

export const createLeadsFromCSV = async (userId: string, csvData: string) => {
  try {
    const db = getFirestore();
    const parsedData = Papa.parse(csvData, {
      header: true, // Assumes the first row contains column headers
      skipEmptyLines: true,
    });

    if (parsedData.errors.length > 0) {
      console.error('CSV Parsing Errors:', parsedData.errors);
      throw new Error('Invalid CSV format');
    }

    const leads = parsedData.data.map((row: any) => ({
      ...row,
      name: row.name,
      phone: row.phone,
      status: row.status,
      email: row.email || '',
      source: row.source || '',
      notes: row.notes || '',
      createdAt: Timestamp.now(),
    }));

    // Create leads in batch
    const batch = leads.map((lead: any) => addDoc(collection(db, `users/${userId}/leads`), lead));
    
    const results = await Promise.all(batch);
    
    return results.map((docRef, index) => ({ id: docRef.id, ...leads[index] }));
  } catch (error: any) {
    console.error('Error creating leads from CSV:', error);
    throw error;
  }
};

export const updateLead = async (leadId: string, updatedData: LeadData, userId: string) => {
  try {
    const db = getFirestore();
    await updateDoc(doc(db, `users/${userId}/leads`, leadId), updatedData); 
    return { ...updatedData, id: leadId};
  } catch (error: any) {
    return null;
  }
};

export const getLead = async (userId:string, leadId: string) => {
  try {
    const db = getFirestore();
    const docSnap = await getDoc(doc(db, `users/${userId}/leads`, leadId));
      if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error: any) {
    return null;
  }
};


export interface NewLead {
  name: string;
  phone: string;
  status: string;
  email?: string;
  city?: string;
  state?: string;
  country?: string;
};

export const getLeads = async (
  userId: string,
  filter?: { field: string; operator: WhereFilterOp; value: any }[]
) => {
  try {
    const db = getFirestore();
    let q = query(collection(db, `users/${userId}/leads`));

    if (filter && filter.length > 0) {
      const conditions = filter.map((condition) =>
        where(condition.field, condition.operator, condition.value)
      );
      q = query(q, ...conditions);
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), createdAt: (doc.data().createdAt as Timestamp).toDate() })) as Lead[];
  } catch (error: any) {
    return [];
  }
};

export const deleteLead = async (userId: string, leadId: string) => {
  try {
    const db = getFirestore();
    await deleteDoc(doc(db, `users/${userId}/leads`, leadId));
    return true; // Indicate successful deletion
  } catch (error: any) {
    console.error('Error deleting lead:', error);
    return false; // Indicate failure
  }
};
