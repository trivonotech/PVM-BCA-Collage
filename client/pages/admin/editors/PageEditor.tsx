import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import AdminLayout from '@/components/admin/AdminLayout';
import { Save, ArrowLeft, Loader2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { compressImage } from '@/utils/imageUtils';
import { useToast } from "@/components/ui/use-toast";

interface PageContent {
    title: string;
    content: string;
    metaDescription: string;
    heroImage: string;
}

export default function PageEditor() {
    const { pageId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Generic Schema
    const [data, setData] = useState<PageContent>({
        title: '',
        content: '',
        metaDescription: '',
        heroImage: ''
    });

    useEffect(() => {
        if (!pageId) return;
        const fetchPage = async () => {
            const docRef = doc(db, 'pages', pageId);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                setData(snap.data() as PageContent);
            } else {
                // Should load defaults based on ID if new
                setData(prev => ({ ...prev, title: pageId?.toUpperCase() || '' }));
            }
            setLoading(false);
        };
        fetchPage();
    }, [pageId]);

    const handleSave = async () => {
        if (!pageId) return;
        setSaving(true);
        try {
            await setDoc(doc(db, 'pages', pageId), {
                ...data,
                updatedAt: serverTimestamp(),
                updatedBy: 'admin' // In real app, use auth uid
            }, { merge: true });
            toast({
                title: "Success",
                description: "Page saved successfully!",
                className: "bg-green-500 text-white border-none",
                duration: 3000,
            });
        } catch (e) {
            toast({
                title: "Error",
                description: "Failed to save.",
                variant: "destructive",
                duration: 3000,
            });
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const compressed = await compressImage(file);
            setData(prev => ({ ...prev, heroImage: compressed }));
        } catch (err) {
            toast({
                title: "Error",
                description: "Image upload failed",
                variant: "destructive",
                duration: 3000,
            });
        }
    };

    if (loading) return <div className="p-12 text-center">Loading editor...</div>;

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-6 sticky top-4 z-10 bg-white/80 p-4 rounded-xl shadow-sm backdrop-blur-md border border-gray-100">
                    <button onClick={() => navigate('/admin/pages')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>Save Changes</span>
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                    {/* SEO / Meta */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Page Title</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData({ ...data, title: e.target.value })}
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Slug/URL</label>
                            <div className="flex items-center gap-2 text-gray-400 bg-gray-50 p-3 rounded-xl border">
                                <LinkIcon className="w-4 h-4" />
                                <span className="text-sm">/{pageId}</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Page Banner / Hero Image</label>
                        <div className="flex items-center gap-4">
                            {data.heroImage && (
                                <img src={data.heroImage} className="w-24 h-24 object-cover rounded-lg border" alt="Banner" />
                            )}
                            <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                <span>Upload Image</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Content Body (HTML Supported)
                        </label>
                        <p className="text-xs text-gray-400 mb-2">You can type plain text or paste HTML here.</p>
                        <textarea
                            rows={15}
                            value={data.content}
                            onChange={(e) => setData({ ...data, content: e.target.value })}
                            className="w-full p-4 border rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="<p>Write your page content here...</p>"
                        />
                    </div>

                    {/* Meta Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">SEO Meta Description</label>
                        <textarea
                            rows={2}
                            value={data.metaDescription}
                            onChange={(e) => setData({ ...data, metaDescription: e.target.value })}
                            className="w-full p-3 border rounded-xl text-sm"
                            placeholder="Brief summary for Google search results..."
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
