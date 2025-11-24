import {
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    QuerySnapshot,
    DocumentData
} from "firebase/firestore";
import { db, opponentsCollection } from "../firebase";
import { Opponent } from "../types";

// Helper to convert Firestore doc to Opponent type
const mapDocToOpponent = (doc: DocumentData): Opponent => {
    const data = doc.data();
    return {
        id: doc.id, // Use Firestore ID (string) instead of number
        name: data.name,
        phone: data.phone,
        club: data.club,
        observation: data.observation
    } as Opponent;
};

export const OpponentService = {
    async getAll(): Promise<Opponent[]> {
        try {
            const snapshot = await getDocs(opponentsCollection);
            return snapshot.docs.map(mapDocToOpponent);
        } catch (error) {
            console.error("Error fetching opponents:", error);
            throw error;
        }
    },

    async add(opponent: Omit<Opponent, 'id'>): Promise<Opponent> {
        try {
            const docRef = await addDoc(opponentsCollection, opponent);
            return { ...opponent, id: docRef.id } as Opponent;
        } catch (error) {
            console.error("Error adding opponent:", error);
            throw error;
        }
    },

    async update(id: string | number, opponent: Partial<Opponent>): Promise<void> {
        try {
            const docRef = doc(db, "opponents", String(id));
            await updateDoc(docRef, opponent);
        } catch (error) {
            console.error("Error updating opponent:", error);
            throw error;
        }
    },

    async delete(id: string | number): Promise<void> {
        try {
            const docRef = doc(db, "opponents", String(id));
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting opponent:", error);
            throw error;
        }
    }
};
