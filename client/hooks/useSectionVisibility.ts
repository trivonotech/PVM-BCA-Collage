import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export interface SectionVisibility {
    // Home Page
    homeHero?: boolean;
    featureCards?: boolean;
    aboutSection?: boolean;
    academicsSnapshot?: boolean;
    admissionJourney?: boolean;
    eventHighlights?: boolean;
    topStudents?: boolean;

    // About Page
    aboutHero?: boolean;
    instituteOverview?: boolean;
    visionMission?: boolean;
    achievementsAccreditations?: boolean;

    // Academics Page
    academicsHero?: boolean;
    coursesList?: boolean;
    departmentInfo?: boolean;
    syllabusSection?: boolean;

    // Student Life Page
    studentLifeHero?: boolean;
    festivalsEvents?: boolean;
    sportsActivities?: boolean;
    workshopsSeminars?: boolean;
    clubsActivities?: boolean;

    // News Page
    newsHero?: boolean;
    latestNews?: boolean;
    upcomingEvents?: boolean;
    pressReleases?: boolean;

    // Examinations Page
    examinationsHero?: boolean;
    examSchedule?: boolean;
    examNotices?: boolean;
    results?: boolean;

    // Placements Page
    placementsHero?: boolean;
    placementStats?: boolean;
    recruiters?: boolean;
    placementRecords?: boolean;

    // Contact Page
    contactHero?: boolean;
    contactForm?: boolean;
    contactInfo?: boolean;
    locationMap?: boolean;

    [key: string]: boolean | undefined;
}

export function useSectionVisibility() {
    const [visibility, setVisibility] = useState<SectionVisibility>(() => {
        // 1. Try to load from localStorage first to prevent flash on refresh
        try {
            const cached = localStorage.getItem('section_visibility_settings');
            return cached ? JSON.parse(cached) : {};
        } catch (e) {
            console.warn('Failed to load visibility settings from localStorage', e);
            return {};
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'settings', 'visibility'), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data() as SectionVisibility;
                setVisibility(data);
                // 2. Update localStorage with fresh data
                try {
                    localStorage.setItem('section_visibility_settings', JSON.stringify(data));
                } catch (e) {
                    console.warn('Failed to save visibility settings to localStorage', e);
                }
            } else {
                // Default to all true if no document exists
                setVisibility({});
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching visibility settings:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Helper to check visibility
    const isVisible = (key: keyof SectionVisibility) => {
        // If we have a specific value in state (from cache or live), use it immediately
        if (visibility[key] !== undefined) {
            return visibility[key] !== false;
        }

        // Only fall back to loading logic if we don't have a value
        if (loading) return true; // Show by default while loading if no cache

        return true; // Default to true if not found
    };

    return { visibility, loading, isVisible };
}
