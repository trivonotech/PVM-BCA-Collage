import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type ActivityType =
    | 'VIEW_PAGE'
    | 'CREATE_DATA'
    | 'UPDATE_DATA'
    | 'DELETE_DATA'
    | 'AUTH_EVENT'
    | 'SECURITY_TOGGLE'
    | 'NAVIGATE';

interface LogOptions {
    adminEmail?: string;
    adminName?: string;
    action: ActivityType;
    target: string;
    details?: string;
    metadata?: any;
}

export const logAdminActivity = async (options: LogOptions) => {
    try {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const adminEmail = options.adminEmail || user?.email || 'Anonymous/System';
        const adminName = options.adminName || user?.name || 'Admin';
        const sessionId = localStorage.getItem('currentSessionId') || 'unknown';

        await addDoc(collection(db, 'activity_logs'), {
            adminEmail,
            adminName,
            sessionId,
            action: options.action,
            target: options.target,
            details: options.details || '',
            metadata: options.metadata || {},
            timestamp: serverTimestamp(),
            userAgent: navigator.userAgent,
        });
    } catch (err) {
        console.error("Failed to log activity:", err);
    }
};
