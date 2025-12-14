import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Save, Globe, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, Shield } from 'lucide-react';
import SecurityConfigModal from '@/components/admin/SecurityConfigModal';

export default function SettingsManager() {
    const [showSecurityConfig, setShowSecurityConfig] = useState(false);
    const [formData, setFormData] = useState({
        siteName: 'PVM BCA College',
        siteEmail: 'info@pvmbca.edu',
        sitePhone: '+91 1234567890',
        siteAddress: 'College Address, City, State - 123456',
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem('siteSettings', JSON.stringify(formData));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

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

                {saved && (
                    <div className="bg-green-50 border-2 border-green-200 text-green-700 px-6 py-4 rounded-xl">
                        <p className="font-semibold">✓ Settings saved successfully!</p>
                    </div>
                )}

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
