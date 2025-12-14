import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const logSystemError = async (error: Error, componentStack?: string) => {
    try {
        await addDoc(collection(db, 'system_logs'), {
            message: error.message || 'Unknown Error',
            stack: error.stack || '',
            component: componentStack || 'Global',
            timestamp: serverTimestamp(),
            userAgent: navigator.userAgent
        });
    } catch (e) {
        console.error("Failed to log error to Firestore:", e);
    }
};
