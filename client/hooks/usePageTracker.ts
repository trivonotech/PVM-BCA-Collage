import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment, setDoc, getDoc } from 'firebase/firestore';

export const usePageTracker = () => {
    const location = useLocation();

    useEffect(() => {
        const trackPageView = async () => {
            // Skip tracking for admin pages to keep data clean
            if (location.pathname.startsWith('/admin')) return;

            // Normalize path (e.g. "/" -> "home", "/about" -> "about")
            let pageKey = location.pathname.substring(1) || 'home';
            // Sanitize key for Firestore (remove slashes if nested)
            pageKey = pageKey.replace(/\//g, '_');

            const analyticsRef = doc(db, 'analytics', 'aggregate');

            try {
                // Try to update existing doc
                await updateDoc(analyticsRef, {
                    [`pageViews.${pageKey}`]: increment(1),
                    totalVisits: increment(1)
                });
            } catch (error: unknown) {
                const err = error as { code?: string };
                // If doc doesn't exist, create it (only happens once)
                if (err.code === 'not-found') {
                    await setDoc(analyticsRef, {
                        pageViews: { [pageKey]: 1 },
                        totalVisits: 1
                    });
                } else {
                    console.error("Tracking Error:", error);
                }
            }
        };

        trackPageView();
    }, [location.pathname]);
};
