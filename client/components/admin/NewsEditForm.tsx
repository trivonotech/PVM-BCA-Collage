import { X, Upload, Bell } from 'lucide-react';
import { compressImage } from '@/utils/imageUtils';

interface NewsSubmission {
    id: string;
    title: string;
    content: string;
    category: string;
    imageUrl?: string;
    submittedBy: {
        name: string;
        email: string;
        rollNumber: string;
        role?: string;
        department?: string;
        designation?: string;
    };
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: any;
    approvedBy?: string;
    approvedAt?: any;
    rejectedBy?: string;
    rejectedAt?: any;
}

interface NewsEditFormProps {
    editingNews: NewsSubmission;
    setEditingNews: (news: NewsSubmission | null) => void;
    handleEditSave: (notify?: boolean) => void;
    onClose: () => void;
}

export default function NewsEditForm({
    editingNews,
    setEditingNews,
    handleEditSave,
    onClose
}: NewsEditFormProps) {
    return (
        <form onSubmit={(e) => { e.preventDefault(); handleEditSave(); }} className="space-y-6">
            {/* Publisher Information */}
            {(editingNews.id === 'new' || editingNews.submittedBy?.role === 'admin') && (
                <div className="bg-blue-50 p-6 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-4">Publisher Information</h3>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Publisher Name</label>
                        <input
                            type="text"
                            value="PVM BCA College"
                            disabled
                            className="w-full px-4 py-3 border-2 border-blue-200 bg-white text-gray-500 rounded-xl focus:outline-none"
                        />
                    </div>
                </div>
            )}

            {/* Title */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                    type="text"
                    value={editingNews.title}
                    onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., University Rankings 2024"
                />
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                    value={['General', 'Study Resources', 'Courses', 'Study Support'].includes(editingNews.category)
                        ? editingNews.category
                        : 'Other (Custom)'}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        if (newValue === 'Other (Custom)') {
                            const isAlreadyCustom = !['General', 'Study Resources', 'Courses', 'Study Support'].includes(editingNews.category);
                            if (!isAlreadyCustom) {
                                setEditingNews({ ...editingNews, category: '' });
                            }
                        } else {
                            setEditingNews({ ...editingNews, category: newValue });
                        }
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                >
                    <option value="General">General</option>
                    <option value="Study Resources">Study Resources</option>
                    <option value="Courses">Courses</option>
                    <option value="Study Support">Study Support</option>
                    <option value="Other (Custom)">Other (Custom)</option>
                </select>

                {!['General', 'Study Resources', 'Courses', 'Study Support'].includes(editingNews.category) && (
                    <input
                        type="text"
                        value={editingNews.category}
                        onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value })}
                        className="w-full mt-3 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                        placeholder="Enter custom category name"
                    />
                )}
            </div>

            {/* Content */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                <textarea
                    rows={4}
                    value={editingNews.content}
                    onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                    placeholder="Write your news article content..."
                />
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Article Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                    {editingNews.imageUrl ? (
                        <div className="relative">
                            <img
                                src={editingNews.imageUrl}
                                alt="Preview"
                                className="max-h-96 w-auto mx-auto rounded-lg object-contain shadow-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setEditingNews({ ...editingNews, imageUrl: '' })}
                                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <label className="cursor-pointer block">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                            <p className="text-sm text-gray-500">PNG, JPG up to 1MB</p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        try {
                                            const compressedBase64 = await compressImage(file);
                                            setEditingNews({ ...editingNews, imageUrl: compressedBase64 });
                                        } catch (error) {
                                            console.error("Image compression failed:", error);
                                            alert("Failed to compress image");
                                        }
                                    }
                                }}
                                className="hidden"
                            />
                            <div className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Choose File
                            </div>
                        </label>
                    )}
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                    {editingNews.id === 'new' ? 'Add News' : 'Save Changes'}
                </button>
                {editingNews.id === 'new' && (
                    <button
                        type="button"
                        onClick={() => handleEditSave(true)}
                        className="flex-[1.5] bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Bell className="w-5 h-5" />
                        Save & Notify Subscribers
                    </button>
                )}
            </div>
        </form>
    );
}
