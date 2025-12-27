import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Upload, X, Check, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from "@/components/ui/use-toast";
import { compressImage } from '@/utils/imageUtils';

export default function SubmitNewsPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [role, setRole] = useState<'student' | 'staff'>('student');
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'Study Resources',
        customCategory: '',
        imageUrl: '',
        imageData: '',
        name: '',
        email: '',
        rollNumber: '',
        department: '',
        designation: ''
    });

    const categories = ['Study Resources', 'Courses', 'Study Support', 'General', 'Other (Custom)'];

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const compressedBase64 = await compressImage(file);
                setFormData(prev => ({ ...prev, imageData: compressedBase64 }));
                setImagePreview(compressedBase64);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to process image. Please try a different one.",
                    variant: "destructive",
                });
            }
        }
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, imageData: '', imageUrl: '' }));
        setImagePreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            const finalCategory = formData.category === 'Other (Custom)' && formData.customCategory
                ? formData.customCategory
                : formData.category;

            const imageToSave = formData.imageData || formData.imageUrl;

            await addDoc(collection(db, 'news'), {
                title: formData.title,
                content: formData.content,
                category: finalCategory,
                imageUrl: imageToSave,
                submittedBy: {
                    name: formData.name,
                    email: formData.email,
                    role: role,
                    ...(role === 'student' ? { rollNumber: formData.rollNumber } : {
                        department: formData.department,
                        designation: formData.designation
                    })
                },
                status: 'pending',
                submittedAt: serverTimestamp()
            });

            setSubmitSuccess(true);
            setSubmitLoading(false);
            window.scrollTo(0, 0);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to submit news. Please try again.",
                variant: "destructive",
            });
            setSubmitLoading(false);
        }
    };

    if (submitSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 font-poppins flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center p-4 py-20">
                    <div className="max-w-xl w-full mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-blue-100">
                        <div className="bg-green-50 p-12 text-center">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <Check className="w-12 h-12 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Submission Received!</h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                Thank you for your contribution. Your news article has been submitted to the admin team for approval.
                            </p>
                            <div className="space-y-4">
                                <Link
                                    to="/news"
                                    className="block w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                                >
                                    Return to News Page
                                </Link>
                                <button
                                    onClick={() => {
                                        setSubmitSuccess(false);
                                        setFormData({
                                            title: '',
                                            content: '',
                                            category: 'Study Resources',
                                            customCategory: '',
                                            imageUrl: '',
                                            imageData: '',
                                            name: formData.name, // Keep existing user info
                                            email: formData.email,
                                            rollNumber: formData.rollNumber,
                                            department: formData.department,
                                            designation: formData.designation
                                        });
                                        setSubmitLoading(false);
                                        setImagePreview(null);
                                        window.scrollTo(0, 0);
                                    }}
                                    className="block w-full bg-white text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all"
                                >
                                    Submit Another Article
                                </button>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                                Need to make changes? Contact <a href="/contact" className="text-blue-600 font-semibold hover:underline">Support</a>
                            </p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-poppins">
            <Header />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    <Link to="/news" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold mb-8 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        Back to News
                    </Link>

                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B0B3B] mb-4">Submit News Article</h1>
                            <p className="text-gray-600">Share announcements, events, or resources with the college community</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Reporter Information */}
                            <div className="bg-blue-50 p-6 md:p-8 rounded-2xl">
                                <h3 className="font-bold text-xl text-[#0B0B3B] mb-6">Reporter Information</h3>

                                {/* Role Selection */}
                                <div className="flex gap-8 mb-6">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${role === 'student' ? 'border-blue-600' : 'border-gray-400 group-hover:border-blue-500'}`}>
                                            {role === 'student' && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
                                        </div>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="student"
                                            checked={role === 'student'}
                                            onChange={() => setRole('student')}
                                            className="hidden"
                                        />
                                        <span className="font-semibold text-gray-800">Student</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${role === 'staff' ? 'border-blue-600' : 'border-gray-400 group-hover:border-blue-500'}`}>
                                            {role === 'staff' && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
                                        </div>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="staff"
                                            checked={role === 'staff'}
                                            onChange={() => setRole('staff')}
                                            className="hidden"
                                        />
                                        <span className="font-semibold text-gray-800">Staff / Faculty</span>
                                    </label>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-blue-200 bg-white rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                            placeholder="Your name"
                                        />
                                    </div>

                                    {role === 'student' ? (
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Roll Number *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.rollNumber}
                                                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-blue-200 bg-white rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                                placeholder="e.g., BCA2023001"
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Designation *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.designation}
                                                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-blue-200 bg-white rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                                placeholder="e.g., Assistant Professor"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-blue-200 bg-white rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                        placeholder="your.email@example.com"
                                    />
                                </div>

                                {role === 'staff' && (
                                    <div className="mt-6">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Department *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-blue-200 bg-white rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                            placeholder="e.g., Computer Science"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Article Details */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Article Title *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                        placeholder="e.g., New Study Resources Added to Digital Library"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>

                                    {formData.category === 'Other (Custom)' && (
                                        <input
                                            type="text"
                                            required
                                            value={formData.customCategory}
                                            onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                                            className="w-full mt-4 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                            placeholder="Enter custom category name"
                                        />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Article Content *</label>
                                    <textarea
                                        required
                                        rows={8}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none transition-colors"
                                        placeholder="Write your article content here..."
                                    />
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Cover Image</label>

                                    {imagePreview ? (
                                        <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
                                            <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute top-4 right-4 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group">
                                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                    <Upload className="w-8 h-8" />
                                                </div>
                                                <p className="text-gray-900 font-bold mb-1 text-lg">Click to upload image</p>
                                                <p className="text-sm text-gray-500">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                />
                                            </label>

                                            <div className="relative">
                                                <div className="absolute inset-0 flex items-center">
                                                    <div className="w-full border-t border-gray-200"></div>
                                                </div>
                                                <div className="relative flex justify-center text-sm">
                                                    <span className="px-4 bg-white text-gray-500 font-medium">Or paste image URL</span>
                                                </div>
                                            </div>

                                            <input
                                                type="url"
                                                value={formData.imageUrl}
                                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex gap-4">
                                <Link
                                    to="/news"
                                    className="flex-1 px-8 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors text-center"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={submitLoading}
                                    className="flex-1 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    {submitLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Article'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
