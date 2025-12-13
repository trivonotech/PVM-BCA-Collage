// Shared TypeScript types for Admin Panel and Frontend

export interface Event {
    id: string;
    name: string;
    date: string;
    category: string;
    image: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Student {
    id: string;
    rank: string;
    name: string;
    course: string;
    achievement: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Sport {
    id: string;
    name: string;
    facilities: string;
    icon: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Workshop {
    id: string;
    title: string;
    date: string;
    speaker: string;
    status: 'Upcoming' | 'Ongoing' | 'Completed';
    description?: string;
    venue?: string;
    createdAt: string;
    updatedAt: string;
}

export interface NewsArticle {
    id: string;
    title: string;
    date: string;
    category: 'Academic' | 'Campus' | 'Achievement' | 'Announcement' | 'Other';
    content: string;
    image?: string;
    author?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Faculty {
    id: string;
    name: string;
    designation: string;
    department: string;
    qualification: string;
    specialization?: string;
    experience?: string;
    email?: string;
    phone?: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    date: string;
    category: 'Academic' | 'Sports' | 'Cultural' | 'Research' | 'Other';
    studentName?: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Placement {
    id: string;
    studentName: string;
    company: string;
    package: string;
    position: string;
    year: string;
    course: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Course {
    id: string;
    name: string;
    code: string;
    duration: string;
    eligibility: string;
    seats: number;
    fees: string;
    description: string;
    syllabus?: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AdminUser {
    id: string;
    username: string;
    email: string;
    role: 'super_admin' | 'admin' | 'editor';
    createdAt: string;
    lastLogin?: string;
}

export interface SiteSettings {
    id: string;
    siteName: string;
    siteEmail: string;
    sitePhone: string;
    siteAddress: string;
    socialMedia: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        linkedin?: string;
        youtube?: string;
    };
    heroSection: {
        title: string;
        subtitle: string;
        ctaText: string;
        ctaLink: string;
    };
    sectionVisibility: {
        // Home Page Sections
        hero: boolean;
        featureCards: boolean;
        about: boolean;
        academics: boolean;
        admissionJourney: boolean;
        eventHighlights: boolean;
        topStudents: boolean;
        // About Page
        aboutPageContent: boolean;
        // Academics Page
        academicsPageContent: boolean;
        // Student Life Page
        festivalsEvents: boolean;
        sportsActivities: boolean;
        workshopsSeminars: boolean;
        // News Page
        newsArticles: boolean;
        upcomingEvents: boolean;
        // Other Pages
        examinationsContent: boolean;
        placementsContent: boolean;
        contactForm: boolean;
    };
    updatedAt: string;
}
