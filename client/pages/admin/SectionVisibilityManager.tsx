import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Eye, EyeOff, Save, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { useToast } from "@/components/ui/use-toast";

export default function SectionVisibilityManager() {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        // Home Page
        homeHero: true,
        featureCards: true,
        aboutSection: true,
        academicsSnapshot: true,
        admissionJourney: true,
        eventHighlights: true,
        topStudents: true,
        // About Page
        aboutHero: true,
        instituteOverview: true,
        visionMission: true,
        achievementsAccreditations: true,
        // Academics Page
        academicsHero: true,
        coursesList: true,
        departmentInfo: true,
        syllabusSection: true,
        // Student Life Page
        studentLifeHero: true,
        festivalsEvents: true,
        sportsActivities: true,
        workshopsSeminars: true,
        clubsActivities: true,
        // News Page
        newsHero: true,
        latestNews: true,
        upcomingEvents: true,
        pressReleases: true,
        // Examinations Page
        examinationsHero: true,
        examSchedule: true,
        examNotices: true,
        results: true,
        // Placements Page
        placementsHero: true,
        placementStats: true,
        recruiters: true,
        placementRecords: true,
        // Contact Page
        contactHero: true,
        contactForm: true,
        contactInfo: true,
        locationMap: true,
    });

    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    // Initial load from Firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'settings', 'visibility'), (docSnap) => {
            if (docSnap.exists()) {
                setFormData(prev => ({ ...prev, ...docSnap.data() }));
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'settings', 'visibility'), formData, { merge: true });
            toast({
                title: "Success",
                description: "Visibility settings saved successfully!",
                className: "bg-green-500 text-white border-none",
                duration: 3000,
            });
        } catch (error) {
            console.error("Error saving visibility settings:", error);
            toast({
                title: "Error",
                description: "Failed to save settings. Please check console.",
                variant: "destructive",
                duration: 3000,
            });
        } finally {
            setSaving(false);
        }
    };

    const sectionToggles = [
        // Home Page Sections
        { key: 'homeHero', label: 'Hero Section', page: 'Home', description: 'Main hero banner with CTA button' },
        { key: 'featureCards', label: 'Feature Cards', page: 'Home', description: 'Highlight feature cards section' },
        { key: 'aboutSection', label: 'About Section', page: 'Home', description: 'College introduction section' },
        { key: 'academicsSnapshot', label: 'Academics Snapshot', page: 'Home', description: 'Courses overview cards' },
        { key: 'admissionJourney', label: 'Admission Journey', page: 'Home', description: 'Admission process timeline' },
        { key: 'eventHighlights', label: 'Event Highlights Carousel', page: 'Home', description: 'Auto-scrolling event carousel' },
        { key: 'topStudents', label: 'Top Students Section', page: 'Home', description: 'Top performing students showcase' },

        // About Page Sections  
        { key: 'aboutHero', label: 'Hero Section', page: 'About', description: 'About page hero banner' },
        { key: 'instituteOverview', label: 'Institute Overview', page: 'About', description: 'College introduction and stats' },
        { key: 'visionMission', label: 'Vision & Mission', page: 'About', description: 'Our vision and mission cards' },
        { key: 'achievementsAccreditations', label: 'Achievements & Accreditations', page: 'About', description: 'Awards, NAAC, UGC, AICTE, ISO' },

        // Academics Page Sections
        { key: 'academicsHero', label: 'Hero Section', page: 'Academics', description: 'Academics page hero banner' },
        { key: 'coursesList', label: 'Courses List', page: 'Academics', description: 'All available courses with details' },
        { key: 'departmentInfo', label: 'Department Information', page: 'Academics', description: 'Department details and faculty' },
        { key: 'syllabusSection', label: 'Syllabus Section', page: 'Academics', description: 'Course syllabus and curriculum' },

        // Student Life Page Sections
        { key: 'studentLifeHero', label: 'Hero Section', page: 'Student Life', description: 'Student life hero banner' },
        { key: 'festivalsEvents', label: 'Festivals & Cultural Events', page: 'Student Life', description: 'Cultural events and celebrations' },
        { key: 'sportsActivities', label: 'Sports & Athletics', page: 'Student Life', description: 'Sports facilities and tournaments' },
        { key: 'workshopsSeminars', label: 'Workshops & Seminars', page: 'Student Life', description: 'Skill development workshops' },
        { key: 'clubsActivities', label: 'Clubs & Activities', page: 'Student Life', description: 'Student clubs and extracurricular' },

        // News Page Sections
        { key: 'newsHero', label: 'Hero Section', page: 'News', description: 'News page hero banner' },
        { key: 'latestNews', label: 'Latest News & Announcements', page: 'News', description: 'Recent college news and updates' },
        { key: 'upcomingEvents', label: 'Upcoming Events Calendar', page: 'News', description: 'Events calendar and schedule' },
        { key: 'pressReleases', label: 'Press Releases', page: 'News', description: 'Official press releases' },

        // Examinations Page Sections
        { key: 'examinationsHero', label: 'Hero Section', page: 'Examinations', description: 'Examinations page hero banner' },
        { key: 'examSchedule', label: 'Exam Schedule', page: 'Examinations', description: 'Examination timetable' },
        { key: 'examNotices', label: 'Exam Notices', page: 'Examinations', description: 'Important examination notices' },
        { key: 'results', label: 'Results Section', page: 'Examinations', description: 'Exam results and downloads' },

        // Placements Page Sections
        { key: 'placementsHero', label: 'Hero Section', page: 'Placements', description: 'Placements page hero banner' },
        { key: 'placementStats', label: 'Placement Statistics', page: 'Placements', description: 'Placement percentages and data' },
        { key: 'recruiters', label: 'Top Recruiters', page: 'Placements', description: 'Companies hiring our students' },
        { key: 'placementRecords', label: 'Placement Records', page: 'Placements', description: 'Student placement details' },

        // Contact Page Sections
        { key: 'contactHero', label: 'Hero Section', page: 'Contact', description: 'Contact page hero banner' },
        { key: 'contactForm', label: 'Contact Form', page: 'Contact', description: 'Inquiry and contact form' },
        { key: 'contactInfo', label: 'Contact Information', page: 'Contact', description: 'Address, phone, email details' },
        { key: 'locationMap', label: 'Location Map', page: 'Contact', description: 'Google Maps integration' },
    ];

    const toggleSection = (key: string) => {
        setFormData({ ...formData, [key]: !formData[key as keyof typeof formData] });
    };

    const toggleAllInPage = (page: string, value: boolean) => {
        const updatedData = { ...formData };
        sectionToggles
            .filter(s => s.page === page)
            .forEach(s => {
                updatedData[s.key as keyof typeof formData] = value as never;
            });
        setFormData(updatedData);
    };

    const groupedSections = sectionToggles.reduce((acc, section) => {
        if (!acc[section.page]) acc[section.page] = [];
        acc[section.page].push(section);
        return acc;
    }, {} as Record<string, typeof sectionToggles>);

    const getPageStats = (page: string) => {
        const pageSections = sectionToggles.filter(s => s.page === page);
        const visible = pageSections.filter(s => formData[s.key as keyof typeof formData]).length;
        return { total: pageSections.length, visible };
    };

    const totalVisible = Object.values(formData).filter(Boolean).length;
    const totalSections = sectionToggles.length;

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-6xl space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Section Visibility Control</h1>
                    <p className="text-gray-600 mt-2">
                        Control which sections appear on your website pages. Toggle sections on/off to customize your site.
                    </p>
                </div>

                {/* Stats Card */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Active Sections</p>
                            <p className="text-4xl font-bold mt-1">
                                {totalVisible} / {totalSections}
                            </p>
                        </div>
                        <div className="bg-white/20 rounded-full p-4">
                            <Eye className="w-12 h-12" />
                        </div>
                    </div>
                </div>

                {saved && (
                    <div className="bg-green-50 border-2 border-green-200 text-green-700 px-6 py-4 rounded-xl">
                        <p className="font-semibold">✓ Visibility settings saved successfully!</p>
                    </div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
                    {/* Sections by Page */}
                    {Object.entries(groupedSections).map(([page, sections]) => {
                        const stats = getPageStats(page);
                        const allVisible = stats.visible === stats.total;
                        const allHidden = stats.visible === 0;

                        return (
                            <div key={page} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                {/* Page Header */}
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b-2 border-gray-200">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">{page} Page</h2>
                                            <p className="text-gray-600 mt-1">
                                                {stats.visible} of {stats.total} sections visible
                                            </p>
                                        </div>
                                        <div className="flex gap-2 self-start md:self-auto">
                                            <button
                                                type="button"
                                                onClick={() => toggleAllInPage(page, true)}
                                                disabled={allVisible}
                                                className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap text-sm md:text-base ${allVisible
                                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    : 'bg-green-600 text-white hover:bg-green-700'
                                                    } `}
                                            >
                                                Show All
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => toggleAllInPage(page, false)}
                                                disabled={allHidden}
                                                className={`px-4 py-2 rounded-lg font-semibold transition-all ${allHidden
                                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    : 'bg-red-600 text-white hover:bg-red-700'
                                                    } `}
                                            >
                                                Hide All
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Sections Grid */}
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {sections.map((section) => {
                                        const isVisible = formData[section.key as keyof typeof formData];
                                        return (
                                            <div
                                                key={section.key}
                                                onClick={() => toggleSection(section.key)}
                                                className={`group relative p-5 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${isVisible
                                                    ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-500 shadow-md'
                                                    : 'bg-gray-50 border-gray-300 hover:border-gray-400'
                                                    } `}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className={`font-bold text-lg ${isVisible ? 'text-green-900' : 'text-gray-700'} `}>
                                                        {section.label}
                                                    </h3>
                                                    <div className={`p-2 rounded-full ${isVisible ? 'bg-green-500' : 'bg-gray-400'} `}>
                                                        {isVisible ? (
                                                            <Eye className="w-5 h-5 text-white" />
                                                        ) : (
                                                            <EyeOff className="w-5 h-5 text-white" />
                                                        )}
                                                    </div>
                                                </div>
                                                <p className={`text-sm ${isVisible ? 'text-green-700' : 'text-gray-600'} `}>
                                                    {section.description}
                                                </p>
                                                <div className="absolute bottom-3 right-3">
                                                    <span
                                                        className={`text-xs font-semibold px-3 py-1 rounded-full ${isVisible
                                                            ? 'bg-green-600 text-white'
                                                            : 'bg-gray-400 text-white'
                                                            } `}
                                                    >
                                                        {isVisible ? 'Visible' : 'Hidden'}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}

                    {/* Save Button */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2 text-lg"
                    >
                        <Save className="w-6 h-6" />
                        Save Visibility Settings
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
