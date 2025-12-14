
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Search, Edit, Eye, Save, X, Upload, Layout } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { compressImage } from '@/utils/imageUtils';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

// Define the pages available for editing
const AVAILABLE_PAGES = [
    { id: 'page_home', name: 'Home Page', path: '/', description: 'Hero section, highlights, etc.' },
    { id: 'page_about', name: 'About Us', path: '/about', description: 'Mission, history, principal message.' },
    { id: 'page_contact', name: 'Contact Page', path: '/contact', description: 'Address, map link, emails.' },
    { id: 'page_admissions', name: 'Admissions', path: '/admissions', description: 'Process, requirements.' },
    { id: 'page_academics', name: 'Academics', path: '/academics', description: 'Course details overview.' },
];

// Configuration for each page's editable fields
const PAGE_CONFIG: Record<string, any> = {
    'page_home': {
        sections: [
            {
                id: 'hero',
                title: 'Hero Section (Top)',
                fields: [
                    { key: 'hero_title', label: 'Main Headline', type: 'text', default: 'Education That Builds <span class="whitespace-nowrap">Capable Professionals</span>' },
                    { key: 'hero_desc', label: 'Description', type: 'textarea', default: 'Undergraduate Programs In Business Administration And Science Designed To Develop Practical Skills, Analytical Thinking, And Career Readiness.' },
                    { key: 'hero_image', label: 'Hero Image (Boy)', type: 'image' }
                ]
            },
            {
                id: 'about',
                title: 'About Section',
                fields: [
                    { key: 'about_title', label: 'Section Title', type: 'text', default: 'About Institute' },
                    { key: 'about_desc', label: 'Main Text', type: 'textarea', default: 'Our Institute Is Dedicated To Delivering Quality Education Through Well-Structured Academic Programs, Experienced Faculty, And A Student-Focused Learning Environment.' }
                ]
            },
            {
                id: 'admission',
                title: 'Admission Section',
                fields: [
                    { key: 'admission_title', label: 'Section Title', type: 'text', default: 'Your Admission Journey' },
                    { key: 'admission_image', label: 'Steps Image', type: 'image' }
                ]
            }
        ]
    },
    'page_about': {
        sections: [
            {
                id: 'main',
                title: 'Main Content',
                fields: [
                    { key: 'title', label: 'Page Title', type: 'text', default: 'About Us' },
                    { key: 'description', label: 'Description', type: 'textarea', default: 'PVM College is...' }
                ]
            }
        ]
    }
};

export default function PageContentManager() {
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<any>({});
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    // Helper to get default content for a page
    const getDefaults = (pageId: string) => {
        const config = PAGE_CONFIG[pageId];
        if (!config) return {};

        const defaults: any = {};
        config.sections.forEach((section: any) => {
            section.fields.forEach((field: any) => {
                if (field.type === 'image') {
                    if (!defaults.images) defaults.images = {};
                    // No default image URL, handling in component
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
                    setContent(docSnap.data());
                } else {
                    setContent(getDefaults(selectedPage));
                }
            } catch (error) {
                console.error("Error loading page content:", error);
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, [selectedPage]);

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
            setContent((prev: any) => ({
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
                                onClick={() => { setSelectedPage(page.id); setContent({}); }}
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
                        <div className="bg-white rounded-2xl shadow-lg p-8 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Editing: {AVAILABLE_PAGES.find(p => p.id === selectedPage)?.name}
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

                            {loading ? (
                                <div className="py-20 text-center text-gray-500">Loading content...</div>
                            ) : (
                                <div className="space-y-8">
                                    {currentConfig.sections.map((section: any) => (
                                        <div key={section.id} className="border-b last:border-0 pb-8 last:pb-0">
                                            <h3 className="text-lg font-extrabold text-blue-900 mb-4 bg-blue-50 p-2 rounded-lg inline-block">
                                                {section.title}
                                            </h3>

                                            <div className="space-y-6">
                                                {section.fields.map((field: any) => (
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
                                                                <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden group cursor-pointer w-full max-w-sm">
                                                                    {content.images?.[field.key] ? (
                                                                        <img src={content.images[field.key]} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <div className="flex items-center justify-center h-full text-gray-400 font-medium">No Image Uploaded</div>
                                                                    )}
                                                                    <input
                                                                        type="file"
                                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                                        onChange={(e) => e.target.files?.[0] && handleImageUpload(field.key, e.target.files[0])}
                                                                    />
                                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold text-sm">
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
                            )}

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
