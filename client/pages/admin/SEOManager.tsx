import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { Save, Globe, MapPin, Share2, Search, Info, ShieldCheck } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export default function SEOManager() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [seoData, setSeoData] = useState({
        collegeName: 'PVM BCA College',
        address: 'Main Campus Road, Education City, State - 123456',
        phone: '+91-XXXX-XXXXXX',
        email: 'info@pvmbcacollege.com',
        keywords: 'BCA College, Best BCA in Bharuch, PVM BCA, Computer Applications',
        googleVerification: '',
        socialLinks: {
            facebook: '',
            instagram: '',
            linkedin: '',
            twitter: ''
        },
        structuredDataEnabled: true
    });

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'settings', 'seo'), (docSnap) => {
            if (docSnap.exists()) {
                setSeoData(prev => ({ ...prev, ...docSnap.data() }));
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'settings', 'seo'), seoData);
            toast({
                title: "Settings Saved",
                description: "SEO and Schema data updated successfully.",
                className: "bg-green-600 text-white border-none",
            });
        } catch (error) {
            toast({
                title: "Save Failed",
                description: "Could not update settings. Check permissions.",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center text-gray-500">Loading SEO Settings...</div>;

    return (
        <AdminLayout>
            <div className="space-y-6 pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <Search className="w-8 h-8 text-blue-600" />
                            SEO & Metadata Manager
                        </h1>
                        <p className="text-gray-600 mt-1">Configure search engine visibility and structured data</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-[#0B0B3B] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1a1a5e] transition-all flex items-center gap-2 shadow-lg disabled:opacity-70"
                    >
                        {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                        Save Changes
                    </button>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* General Schema Info */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center gap-2 text-xl font-bold text-[#0B0B3B] border-b pb-4">
                            <MapPin className="w-5 h-5 text-red-500" />
                            Organization Details (JSON-LD)
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Official College Name</label>
                                <input
                                    type="text"
                                    value={seoData.collegeName}
                                    onChange={(e) => setSeoData({ ...seoData, collegeName: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Full Address</label>
                                <textarea
                                    value={seoData.address}
                                    onChange={(e) => setSeoData({ ...seoData, address: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Phone</label>
                                    <input
                                        type="text"
                                        value={seoData.phone}
                                        onChange={(e) => setSeoData({ ...seoData, phone: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Email</label>
                                    <input
                                        type="email"
                                        value={seoData.email}
                                        onChange={(e) => setSeoData({ ...seoData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Keywords & Verification */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center gap-2 text-xl font-bold text-[#0B0B3B] border-b pb-4">
                            <Globe className="w-5 h-5 text-blue-500" />
                            Search Configuration
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase flex items-center gap-2">
                                    Global Keywords
                                    <Info className="w-4 h-4 text-gray-400" title="Comma separated keywords for search engines" />
                                </label>
                                <textarea
                                    value={seoData.keywords}
                                    onChange={(e) => setSeoData({ ...seoData, keywords: e.target.value })}
                                    rows={3}
                                    placeholder="college, bca, bharuch, education..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase flex items-center gap-2">
                                    Google Site Verification
                                    <ShieldCheck className="w-4 h-4 text-green-500" />
                                </label>
                                <input
                                    type="text"
                                    value={seoData.googleVerification}
                                    onChange={(e) => setSeoData({ ...seoData, googleVerification: e.target.value })}
                                    placeholder="google-site-verification code"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100 mt-4">
                                <div>
                                    <p className="font-bold text-[#0B0B3B] text-sm">JSON-LD Structured Data</p>
                                    <p className="text-xs text-blue-600">Enhanced search snippets for Google</p>
                                </div>
                                <button
                                    onClick={() => setSeoData({ ...seoData, structuredDataEnabled: !seoData.structuredDataEnabled })}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${seoData.structuredDataEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${seoData.structuredDataEnabled ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Social Presence */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6 lg:col-span-2">
                        <div className="flex items-center gap-2 text-xl font-bold text-[#0B0B3B] border-b pb-4">
                            <Share2 className="w-5 h-5 text-purple-500" />
                            Social Presence (Company Knowledge Graph)
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {(['facebook', 'instagram', 'linkedin', 'twitter'] as const).map((platform) => (
                                <div key={platform}>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase capitalize">{platform} URL</label>
                                    <input
                                        type="url"
                                        value={seoData.socialLinks[platform]}
                                        onChange={(e) => setSeoData({
                                            ...seoData,
                                            socialLinks: { ...seoData.socialLinks, [platform]: e.target.value }
                                        })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                                        placeholder={`https://${platform}.com/...`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
