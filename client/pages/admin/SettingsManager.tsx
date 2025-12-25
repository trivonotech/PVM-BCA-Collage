import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Save, Globe, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, Shield } from 'lucide-react';
import SecurityConfigModal from '@/components/admin/SecurityConfigModal';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useToast } from "@/components/ui/use-toast";

export default function SettingsManager() {
    const { toast } = useToast();
    const [showSecurityConfig, setShowSecurityConfig] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        siteName: 'PVM BCA College',
        siteEmail: 'info@pvmbca.edu',
        sitePhone: '+91 1234567890',
        siteAddress: 'College Address, City, State - 123456',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093747!2d144.9537353159042!3d-37.81720974201434!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sEnvato!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin',
        facebook: 'https://facebook.com/pvmbca',
        twitter: 'https://twitter.com/pvmbca',
        instagram: 'https://instagram.com/pvmbca',
        linkedin: 'https://linkedin.com/company/pvmbca',
        youtube: 'https://youtube.com/pvmbca',
        heroTitle: 'Transform Your Future with Quality Education',
        heroSubtitle: 'Join India\'s Leading BCA College',
        heroCTA: 'Apply Now',
    });

    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, 'settings', 'general');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setFormData(prev => ({ ...prev, ...docSnap.data() }));
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await setDoc(doc(db, 'settings', 'general'), formData);
            setSaved(true);
            toast({
                title: "Settings Saved",
                description: "Website configuration has been updated.",
                className: "bg-green-600 text-white border-none"
            });
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error("Error saving settings:", error);
            toast({
                title: "Error",
                description: "Failed to save settings.",
                variant: "destructive"
            });
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[50vh]">
                    <p className="text-gray-500">Loading settings...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <SecurityConfigModal
                isOpen={showSecurityConfig}
                onClose={() => setShowSecurityConfig(false)}
            />
            <div className="max-w-4xl space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
                    <p className="text-gray-600 mt-1">Manage your website settings and configuration</p>
                </div>

                {/* Security Section */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-indigo-600">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Shield className="w-6 h-6 text-indigo-600" />
                                Security & Safety
                            </h2>
                            <p className="text-gray-500 mt-1 text-sm">Configure protection rules, rate limits, and automated blocking.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowSecurityConfig(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold transition shadow-md flex items-center gap-2"
                        >
                            <Shield className="w-4 h-4" /> Manage Security Rules
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Globe className="w-6 h-6 text-blue-600" />
                            Basic Information
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Site Name</label>
                                <input
                                    type="text"
                                    value={formData.siteName}
                                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Mail className="w-4 h-4" /> Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.siteEmail}
                                        onChange={(e) => setFormData({ ...formData, siteEmail: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Phone className="w-4 h-4" /> Phone
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.sitePhone}
                                        onChange={(e) => setFormData({ ...formData, sitePhone: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Address
                                </label>
                                <textarea
                                    value={formData.siteAddress}
                                    onChange={(e) => setFormData({ ...formData, siteAddress: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Google Map Embed URL
                                </label>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={formData.mapUrl}
                                        onChange={(e) => {
                                            let val = e.target.value;
                                            // Smart extract if user pastes full iframe code
                                            if (val.includes('<iframe')) {
                                                const srcMatch = val.match(/src="([^"]+)"/);
                                                if (srcMatch && srcMatch[1]) {
                                                    val = srcMatch[1];
                                                    toast({
                                                        title: "Link Extracted",
                                                        description: "We automatically extracted the correct URL from the embed code.",
                                                        className: "bg-blue-600 text-white border-none"
                                                    });
                                                }
                                            }
                                            setFormData({ ...formData, mapUrl: val });
                                        }}
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none text-sm font-mono transition-colors ${formData.mapUrl && !formData.mapUrl.includes('embed')
                                                ? 'border-yellow-400 focus:border-yellow-500 bg-yellow-50'
                                                : 'border-gray-200 focus:border-blue-500'
                                            }`}
                                        placeholder="https://www.google.com/maps/embed?..."
                                    />
                                    {formData.mapUrl && !formData.mapUrl.includes('embed') && (
                                        <div className="flex items-start gap-2 text-yellow-700 text-xs bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                            <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                                            <p>
                                                <strong>Warning:</strong> This doesn't look like an embed link.
                                                Please click the <strong>"Embed a map"</strong> button (the <code className="bg-yellow-100 px-1 rounded">&lt; &gt;</code> icon) in Google Maps, then copy the <strong>HTML</strong> or just the link inside <code>src="..."</code>.
                                            </p>
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-500">
                                        Go to Google Maps &gt; Share &gt; Click <strong>"Embed a map"</strong> &gt; Copy HTML.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Social Media Links</h2>
                        <div className="space-y-4">
                            {[
                                { icon: Facebook, label: 'Facebook', key: 'facebook', color: 'text-blue-600' },
                                { icon: Twitter, label: 'Twitter', key: 'twitter', color: 'text-blue-400' },
                                { icon: Instagram, label: 'Instagram', key: 'instagram', color: 'text-pink-600' },
                                { icon: Linkedin, label: 'LinkedIn', key: 'linkedin', color: 'text-blue-700' },
                                { icon: Youtube, label: 'YouTube', key: 'youtube', color: 'text-red-600' },
                            ].map(({ icon: Icon, label, key, color }) => (
                                <div key={key}>
                                    <label className={`block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2 ${color}`}>
                                        <Icon className="w-4 h-4" /> {label}
                                    </label>
                                    <input
                                        type="url"
                                        value={formData[key as keyof typeof formData] as string}
                                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                                        placeholder={`https://${key}.com/yourpage`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hero Section Settings */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Hero Section</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Title</label>
                                <input
                                    type="text"
                                    value={formData.heroTitle}
                                    onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Subtitle</label>
                                <input
                                    type="text"
                                    value={formData.heroSubtitle}
                                    onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Button Text</label>
                                <input
                                    type="text"
                                    value={formData.heroCTA}
                                    onChange={(e) => setFormData({ ...formData, heroCTA: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        Save All Settings
                    </button>
                </form>
            </div >
        </AdminLayout >
    );
}
