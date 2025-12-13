import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    addDoc,
    getDocs
} from 'firebase/firestore';
import { Check, X, Edit, Trash2, Eye, Clock, CheckCircle, XCircle, Upload, Plus } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { compressImage } from '@/utils/imageUtils';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';

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

export default function NewsManager() {
    const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const [news, setNews] = useState<NewsSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingNews, setEditingNews] = useState<NewsSubmission | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // Confirmation Modal State
    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean;
        type: 'approve' | 'reject' | 'delete' | null;
        itemId: string | null;
        title: string;
        message: string;
        confirmType: 'info' | 'warning' | 'danger';
        confirmText: string;
    }>({
        isOpen: false,
        type: null,
        itemId: null,
        title: '',
        message: '',
        confirmType: 'danger',
        confirmText: 'Confirm'
    });

    // Get current admin email
    const getCurrentAdmin = () => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                return user.email || 'admin';
            }
        } catch (e) {
            console.error('Error getting current admin:', e);
        }
        return 'admin';
    };

    // Real-time news sync based on active tab
    useEffect(() => {
        const q = query(
            collection(db, 'news'),
            where('status', '==', activeTab)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as NewsSubmission[];

            // Client-side sort
            newsData.sort((a, b) => {
                const dateA = a.submittedAt?.toDate?.() || new Date(0);
                const dateB = b.submittedAt?.toDate?.() || new Date(0);
                return dateB.getTime() - dateA.getTime();
            });

            setNews(newsData);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching news:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [activeTab]);

    const requestConfirm = (type: 'approve' | 'reject' | 'delete', id: string) => {
        const configs = {
            approve: {
                title: 'Approve Submission',
                message: 'Are you sure you want to approve this news submission? It will be published immediately.',
                confirmType: 'info' as const,
                confirmText: 'Approve'
            },
            reject: {
                title: 'Reject Submission',
                message: 'Are you sure you want to reject this submission? This action cannot be undone.',
                confirmType: 'warning' as const,
                confirmText: 'Reject'
            },
            delete: {
                title: 'Delete Submission',
                message: 'Are you sure you want to permanently delete this news item?',
                confirmType: 'danger' as const,
                confirmText: 'Delete'
            }
        };

        setConfirmState({
            isOpen: true,
            type,
            itemId: id,
            ...configs[type]
        });
    };

    const handleConfirmAction = async () => {
        const { type, itemId } = confirmState;
        if (!itemId || !type) return;

        try {
            if (type === 'approve') {
                await updateDoc(doc(db, 'news', itemId), {
                    status: 'approved',
                    approvedBy: getCurrentAdmin(),
                    approvedAt: serverTimestamp()
                });
            } else if (type === 'reject') {
                await updateDoc(doc(db, 'news', itemId), {
                    status: 'rejected',
                    rejectedBy: getCurrentAdmin(),
                    rejectedAt: serverTimestamp()
                });
            } else if (type === 'delete') {
                await deleteDoc(doc(db, 'news', itemId));
            }
            setConfirmState(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
            console.error(`Error performing ${type}:`, error);
            alert(`Failed to ${type} news`);
        }
    };

    const handleAddNew = () => {
        setEditingNews({
            id: 'new',
            title: '',
            content: '',
            category: 'General',
            imageUrl: '',
            submittedBy: {
                name: 'PVM BCA College',
                email: 'admin@pvm.edu',
                rollNumber: 'ADMIN',
                role: 'admin'
            },
            status: 'approved',
            submittedAt: null,
        } as NewsSubmission);
        setShowEditModal(true);
    };

    const handleEditSave = async () => {
        if (!editingNews) return;

        try {
            if (editingNews.id === 'new') {
                // Add new document
                await addDoc(collection(db, 'news'), {
                    title: editingNews.title,
                    content: editingNews.content,
                    category: editingNews.category,
                    imageUrl: editingNews.imageUrl,
                    submittedBy: editingNews.submittedBy,
                    status: 'approved',
                    submittedAt: serverTimestamp(),
                    approvedBy: getCurrentAdmin(),
                    approvedAt: serverTimestamp()
                });
            } else {
                // Update existing
                await updateDoc(doc(db, 'news', editingNews.id), {
                    title: editingNews.title,
                    content: editingNews.content,
                    category: editingNews.category,
                    imageUrl: editingNews.imageUrl
                });
            }
            setShowEditModal(false);
            setEditingNews(null);
        } catch (error) {
            console.error('Error saving news:', error);
            alert('Failed to save news');
        }
    };

    const handleRestoreLegacy = async () => {
        if (!confirm('This will verify all news articles and make visible any that are missing a status. Continue?')) return;

        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'news'));
            let restoredCount = 0;

            const updates = querySnapshot.docs.map(async (docSnapshot) => {
                const data = docSnapshot.data();
                if (!data.status) {
                    restoredCount++;
                    return updateDoc(doc(db, 'news', docSnapshot.id), {
                        status: 'approved',
                        approvedBy: 'system_migration',
                        approvedAt: serverTimestamp()
                    });
                }
            });

            await Promise.all(updates);

            if (restoredCount > 0) {
                alert(`Successfully restored ${restoredCount} legacy news articles!`);
                // Refresh by toggling tab
                const currentTab = activeTab;
                setActiveTab('rejected'); // switch briefly
                setTimeout(() => setActiveTab(currentTab), 100);
            } else {
                alert('No legacy items found needing restoration.');
            }
        } catch (error) {
            console.error('Error restoring legacy news:', error);
            alert('Failed to restore legacy news.');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { key: 'pending', label: 'Pending', icon: Clock, color: 'orange' },
        { key: 'approved', label: 'Approved', icon: CheckCircle, color: 'green' },
        { key: 'rejected', label: 'Rejected', icon: XCircle, color: 'red' }
    ] as const;

    const getTabCount = () => {
        // In a real app, you might want to fetch counts separately or rely on the filtered list
        return news.length;
    };

    return (
        <AdminLayout>
            <div className="p-4 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">News Management</h1>
                        <p className="text-gray-600 mt-1">
                            Review and manage student-submitted news articles
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={handleRestoreLegacy}
                            className="text-blue-600 hover:text-blue-800 font-semibold text-sm underline whitespace-nowrap"
                        >
                            Find Missing/Legacy News
                        </button>
                        <button
                            onClick={handleAddNew}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2 shadow-lg whitespace-nowrap"
                        >
                            <Plus className="w-5 h-5" />
                            Add News
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                {/* Mobile: Wrapped flex for visibility */}
                <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => {
                                    setActiveTab(tab.key);
                                    setLoading(true);
                                }}
                                className={`flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 font-semibold border-b-2 transition-all whitespace-nowrap text-sm md:text-base ${isActive
                                    ? `border-${tab.color}-600 text-${tab.color}-600`
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.label}
                                {isActive && (
                                    <span className={`bg-${tab.color}-100 text-${tab.color}-700 px-2 py-1 rounded-full text-sm`}>
                                        {getTabCount()}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* News List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading...</p>
                    </div>
                ) : news.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <p className="text-gray-500 text-lg">No {activeTab} news submissions</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {news.map(item => (
                            <div key={item.id} className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-200">
                                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                                    {/* Image */}
                                    {item.imageUrl && (
                                        <div className="flex-shrink-0">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className="w-full h-48 md:w-48 md:h-32 object-cover rounded-lg"
                                            />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                                                <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                                    {item.category}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-gray-700 mb-4 line-clamp-3">{item.content}</p>

                                        {/* Submitter Info */}
                                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                            <p className="text-sm text-gray-600">
                                                <strong>Submitted by:</strong> {item.submittedBy.name} ({item.submittedBy.rollNumber})
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <strong>Email:</strong> {item.submittedBy.email}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <strong>Date:</strong> {item?.submittedAt?.toDate?.().toLocaleString() || 'N/A'}
                                            </p>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap gap-2">
                                            {activeTab === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => requestConfirm('approve', item.id)}
                                                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingNews(item);
                                                            setShowEditModal(true);
                                                        }}
                                                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => requestConfirm('reject', item.id)}
                                                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {activeTab === 'approved' && (
                                                <button
                                                    onClick={() => requestConfirm('delete', item.id)}
                                                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </button>
                                            )}
                                            {activeTab === 'rejected' && (
                                                <button
                                                    onClick={() => requestConfirm('delete', item.id)}
                                                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Edit Modal - Using Shared Component */}
                <Modal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    title={editingNews?.id === 'new' ? 'Add News' : 'Edit News Article'}
                    maxWidth="2xl"
                    hideScrollbar={true}
                >
                    {editingNews && (
                        <form onSubmit={(e) => { e.preventDefault(); handleEditSave(); }} className="space-y-6">
                            {/* Publisher Information - Only for new news or if role is admin */}
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
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={editingNews.title}
                                    onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                                    placeholder="e.g., University Rankings 2024"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                                <select
                                    value={['General', 'Study Resources', 'Courses', 'Study Support'].includes(editingNews.category)
                                        ? editingNews.category
                                        : 'Other (Custom)'}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        if (newValue === 'Other (Custom)') {
                                            // Keep existing if it was already custom, otherwise clear it for input
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

                                {/* Custom Category Input */}
                                {!['General', 'Study Resources', 'Courses', 'Study Support'].includes(editingNews.category) && (
                                    <input
                                        type="text"
                                        value={editingNews.category}
                                        onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value })}
                                        className="w-full mt-3 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                                        placeholder="Enter custom category name"
                                        required
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
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingNews(null);
                                    }}
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
                            </div>
                        </form>
                    )}
                </Modal>

                {/* Confirmation Modal */}
                <ConfirmModal
                    isOpen={confirmState.isOpen}
                    onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                    onConfirm={handleConfirmAction}
                    title={confirmState.title}
                    message={confirmState.message}
                    confirmText={confirmState.confirmText}
                    type={confirmState.confirmType}
                />
            </div>
        </AdminLayout>
    );
}
