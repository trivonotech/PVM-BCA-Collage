
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Search, Edit, Eye, Save, X, Upload, Layout } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { compressImage } from '@/utils/imageUtils';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

// --- Types ---
interface PageField {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'image';
    default?: string;
}

interface PageSection {
    id: string;
    title: string;
    fields: PageField[];
}

interface PageConfig {
    sections: PageSection[];
}

// Configuration for each page's editable fields
const PAGE_CONFIG: Record<string, PageConfig> = {
    'page_home': {
        sections: [
            {
                id: 'hero',
                title: 'Hero Section (Top)',
                fields: [
                    { key: 'title', label: 'Main Headline', type: 'text', default: 'Education That Builds Capable Professionals' },
                    { key: 'description', label: 'Description', type: 'textarea', default: 'Undergraduate Programs In Business Administration And Science Designed To Develop Practical Skills, Analytical Thinking, And Career Readiness.' },
                    { key: 'hero', label: 'Hero Image (Boy)', type: 'image', default: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop' }
                ]
            }
        ]
    },
    'page_about': {
        sections: [
            {
                id: 'hero',
                title: 'Hero Section',
                fields: [
                    { key: 'title', label: 'Page Title', type: 'text', default: 'About Us' },
                    { key: 'subtitle', label: 'Subtitle', type: 'textarea', default: 'Building Tomorrow\'s Leaders Through Quality Education And Holistic Development' }
                ]
            },
            {
                id: 'overview',
                title: 'Institute Overview',
                fields: [
                    { key: 'overview_title', label: 'Overview Title', type: 'text', default: 'Institute Overview' },
                    { key: 'overview_text1', label: 'Text Paragraph 1', type: 'textarea', default: 'Established with a vision to provide world-class education, our institute has been at the forefront of academic excellence for over a decade. We are committed to nurturing young minds and transforming them into capable professionals ready to face global challenges.' },
                    { key: 'overview_text2', label: 'Text Paragraph 2', type: 'textarea', default: 'Our state-of-the-art infrastructure, experienced faculty, and industry-aligned curriculum ensure that students receive comprehensive education that balances theoretical knowledge with practical skills.' },
                    { key: 'campus_image', label: 'Campus Image', type: 'image', default: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop' }
                ]
            },
            {
                id: 'vision_mission',
                title: 'Vision & Mission',
                fields: [
                    { key: 'vision', label: 'Vision Statement', type: 'textarea', default: 'To be a globally recognized institution that shapes future leaders through innovative education, research excellence, and character development, while fostering creativity, critical thinking, and social responsibility.' },
                    { key: 'mission_list', label: 'Mission Points (One per line)', type: 'textarea', default: "Provide quality education with modern teaching methodologies\nDevelop industry-ready professionals with practical skills\nFoster innovation, research, and creative thinking\nBuild strong industry partnerships for placements" }
                ]
            }
        ]
    },
    'page_contact': {
        sections: [
            {
                id: 'hero',
                title: 'Hero Section',
                fields: [
                    { key: 'title', label: 'Page Title', type: 'text', default: 'Contact Us' },
                    { key: 'subtitle', label: 'Subtitle', type: 'textarea', default: "Get In Touch With Us - We're Here To Help With Your Queries And Admissions" }
                ]
            }
        ]
    },
    'page_admissions': {
        sections: [
            {
                id: 'hero',
                title: 'Hero Section',
                fields: [
                    { key: 'title', label: 'Page Title', type: 'text', default: 'Admissions' },
                    { key: 'subtitle', label: 'Subtitle', type: 'textarea', default: 'Start Your Journey Towards A Bright Future - Admission Process Made Simple' }
                ]
            }
        ]
    },
    'page_academics': {
        sections: [
            {
                id: 'hero',
                title: 'Hero Section',
                fields: [
                    { key: 'title', label: 'Page Title', type: 'text', default: 'Academics' },
                    { key: 'subtitle', label: 'Subtitle', type: 'textarea', default: 'Comprehensive Programs Designed For Industry Readiness And Career Success' }
                ]
            }
        ]
    }
};

const AVAILABLE_PAGES = [
    { id: 'page_home', name: 'Home Page', description: 'Hero, stats, and promotional sections', path: '/' },
    { id: 'page_about', name: 'About Us', description: 'Overview, Vision, and Mission statements', path: '/about' },
    { id: 'page_academics', name: 'Academics', description: 'Program overviews and descriptions', path: '/academics' },
    { id: 'page_admissions', name: 'Admissions', description: 'Process details and hero section', path: '/admissions' },
    { id: 'page_contact', name: 'Contact Page', description: 'Headlines and contact information', path: '/contact' }
];

export default function PageContentManager() {
    const { toast } = useToast();
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<Record<string, any>>({});
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    // Helper to get default content for a page
    const getDefaults = (pageId: string) => {
        const config = PAGE_CONFIG[pageId];
        if (!config) return {};

        const defaults: Record<string, any> = {};
        config.sections.forEach((section) => {
            section.fields.forEach((field) => {
                if (field.type === 'image') {
                    defaults.images = { ...defaults.images, [field.key]: field.default || '' };
                } else {
                    defaults[field.key] = field.default || '';
                }
            });
        });
        return defaults;
    };

    // Load content when a page is selected
    useEffect(() => {
        if (!selectedPage) return;

        const loadContent = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, 'page_content', selectedPage);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const fetchedData = docSnap.data();
                    const defaults = getDefaults(selectedPage);
                    const mergedData = { ...defaults, ...fetchedData };

                    // Restore defaults if fetched data is empty string
                    // This fixes the issue where empty "" saved to DB causes blank fields
                    Object.keys(mergedData).forEach(key => {
                        if (mergedData[key] === '' && defaults[key]) {
                            mergedData[key] = defaults[key];
                        }
                    });
                    // Handle images merging specifically
                    if (fetchedData.images) {
                        mergedData.images = { ...defaults.images, ...fetchedData.images };
                    }

                    setContent(mergedData);
                }
                // If not exists, defaults were already set on click
            } catch (error) {
                console.error("Error loading page content:", error);
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, [selectedPage]);

    const handlePageClick = (pageId: string) => {
        setSelectedPage(pageId);
        // Optimistically set defaults so UI updates instantly
        setContent(getDefaults(pageId));
    };

    const handleSave = async () => {
        if (!selectedPage) return;
        setSaving(true);
        try {
            await setDoc(doc(db, 'page_content', selectedPage), content, { merge: true });
            toast({
                title: "Success",
                description: "Page content saved successfully!",
                className: "bg-green-500 text-white border-none",
                duration: 3000,
            });
        } catch (error) {
            console.error("Error saving:", error);
            toast({
                title: "Error",
                description: "Failed to save content.",
                variant: "destructive",
                duration: 3000,
            });
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (key: string, file: File) => {
        try {
            const base64 = await compressImage(file);
            setContent((prev) => ({
                ...prev,
                images: {
                    ...prev.images,
                    [key]: base64
                }
            }));
        } catch (error) {
            console.error("Image upload failed:", error);
            toast({
                title: "Error",
                description: "Failed to process image.",
                variant: "destructive",
                duration: 3000,
            });
        }
    };

    const currentConfig = selectedPage ? PAGE_CONFIG[selectedPage] : null;

    return (
        <AdminLayout>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Layout className="w-8 h-8 text-blue-600" />
                    Page Content Manager
                </h1>
                <p className="text-gray-600 mt-2">Edit visibility, text, and images for site pages.</p>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: Page List */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6 h-fit">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Select Page</h3>
                    <div className="space-y-3">
                        {AVAILABLE_PAGES.map(page => (
                            <button
                                key={page.id}
                                onClick={() => handlePageClick(page.id)}
                                className={`w-full text-left p-4 rounded-xl transition-all border-2 ${selectedPage === page.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                                    } `}
                            >
                                <div className="font-bold text-gray-900">{page.name}</div>
                                <div className="text-xs text-gray-500">{page.description}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Editor */}
                <div className="lg:col-span-2">
                    {selectedPage && currentConfig ? (
                        <div className={`bg-white rounded-2xl shadow-lg p-8 animate-in fade-in slide-in-from-bottom-4 transition-opacity duration-200 ${loading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    Editing: {AVAILABLE_PAGES.find(p => p.id === selectedPage)?.name}
                                    {loading && <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
                                </h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => window.open(AVAILABLE_PAGES.find(p => p.id === selectedPage)?.path, '_blank')}
                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                        title="View Live Page"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {currentConfig.sections.map((section) => (
                                    <div key={section.id} className="border-b last:border-0 pb-8 last:pb-0">
                                        <h3 className="text-lg font-extrabold text-blue-900 mb-4 bg-blue-50 p-2 rounded-lg inline-block">
                                            {section.title}
                                        </h3>

                                        <div className="space-y-6">
                                            {section.fields.map((field) => (
                                                <div key={field.key}>
                                                    {field.type === 'text' && (
                                                        <div>
                                                            <label className="block text-sm font-bold text-gray-700 mb-2">{field.label}</label>
                                                            <input
                                                                type="text"
                                                                value={content[field.key] || ''}
                                                                onChange={e => setContent({ ...content, [field.key]: e.target.value })}
                                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                                                            />
                                                        </div>
                                                    )}
                                                    {field.type === 'textarea' && (
                                                        <div>
                                                            <label className="block text-sm font-bold text-gray-700 mb-2">{field.label}</label>
                                                            <textarea
                                                                value={content[field.key] || ''}
                                                                onChange={e => setContent({ ...content, [field.key]: e.target.value })}
                                                                rows={4}
                                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none resize-none"
                                                            />
                                                        </div>
                                                    )}
                                                    {field.type === 'image' && (
                                                        <div>
                                                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">{field.label}</label>
                                                            <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden group w-full max-w-sm">
                                                                {content.images?.[field.key] || field.default ? (
                                                                    <img src={content.images?.[field.key] || field.default} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="flex items-center justify-center h-full text-gray-400 font-medium">No Image Uploaded</div>
                                                                )}
                                                                <input
                                                                    type="file"
                                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                                                                    onChange={(e) => e.target.files?.[0] && handleImageUpload(field.key, e.target.files[0])}
                                                                    accept="image/*"
                                                                />
                                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold text-sm pointer-events-none">
                                                                    Click to Upload
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {/* Save Button */}
                                <div className="pt-6 border-t border-gray-100 flex justify-end sticky bottom-0 bg-white pb-2">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {saving ? (
                                            <>Saving...</>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5" />
                                                Save All Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 p-12 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                            <Layout className="w-16 h-16 mb-4 opacity-50" />
                            <p className="text-lg font-medium">Select a page to start configuring content</p>
                            <p className="text-sm">Currently available: Home Page</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

