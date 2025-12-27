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
    getDocs,
} from 'firebase/firestore';
import { Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from "@/components/ui/use-toast";
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { logAdminActivity } from '@/lib/ActivityLogger';
import NewsItemCard from '@/components/admin/NewsItemCard';
import NewsEditForm from '@/components/admin/NewsEditForm';
import { CONFIG } from '@/lib/config';
import { getCurrentAdminEmail, getCurrentAdmin } from '@/lib/authUtils';

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
    submittedAt: { seconds: number; nanoseconds: number } | string | number | any;
    approvedBy?: string;
    approvedAt?: { seconds: number; nanoseconds: number } | string | number | any;
    rejectedBy?: string;
    rejectedAt?: { seconds: number; nanoseconds: number } | string | number | any;
}

export default function NewsManager() {
    const { toast } = useToast();
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
        }, (error: unknown) => {
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
                    approvedBy: getCurrentAdminEmail(),
                    approvedAt: serverTimestamp()
                });
                logAdminActivity({
                    action: 'UPDATE_DATA',
                    target: 'News',
                    details: `Approved news ID: ${itemId}`
                });
            } else if (type === 'reject') {
                await updateDoc(doc(db, 'news', itemId), {
                    status: 'rejected',
                    rejectedBy: getCurrentAdminEmail(),
                    rejectedAt: serverTimestamp()
                });
                logAdminActivity({
                    action: 'UPDATE_DATA',
                    target: 'News',
                    details: `Rejected news ID: ${itemId}`
                });
            } else if (type === 'delete') {
                await deleteDoc(doc(db, 'news', itemId));
                logAdminActivity({
                    action: 'DELETE_DATA',
                    target: 'News',
                    details: `Deleted news ID: ${itemId}`
                });
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
                email: CONFIG.SUPER_ADMIN_EMAIL,
                rollNumber: 'ADMIN',
                role: 'admin'
            },
            status: 'approved',
            submittedAt: null,
        });
        setShowEditModal(true);
    };

    const handleEditSave = async (notify: boolean = false) => {
        if (!editingNews) return;

        try {
            let newsTitle = editingNews.title;
            let newsContent = editingNews.content;

            let savedId = editingNews.id;

            if (editingNews.id === 'new') {
                // Add new document
                const docRef = await addDoc(collection(db, 'news'), {
                    title: newsTitle,
                    content: newsContent,
                    category: editingNews.category,
                    imageUrl: editingNews.imageUrl,
                    submittedBy: editingNews.submittedBy,
                    status: 'approved',
                    submittedAt: serverTimestamp(),
                    approvedBy: getCurrentAdmin(),
                    approvedAt: serverTimestamp()
                });
                savedId = docRef.id;
                logAdminActivity({
                    action: 'CREATE_DATA',
                    target: 'News',
                    details: `Created new news article: ${newsTitle}`
                });
            } else {
                // Update existing
                await updateDoc(doc(db, 'news', editingNews.id), {
                    title: newsTitle,
                    content: newsContent,
                    category: editingNews.category,
                    imageUrl: editingNews.imageUrl
                });
                logAdminActivity({
                    action: 'UPDATE_DATA',
                    target: 'News',
                    details: `Updated news article: ${newsTitle}`
                });
            }

            if (notify) {
                // Fetch all subscribers
                const subSnapshot = await getDocs(collection(db, 'subscribers'));
                const subscribers = subSnapshot.docs.map(doc => doc.data().email);

                if (subscribers.length > 0) {
                    const bccAddresses = subscribers.join(',');
                    const subject = encodeURIComponent(`🆕 Latest News: ${newsTitle}`);
                    const newsUrl = `${window.location.origin}/news/${savedId}`;

                    const divider = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
                    const bodyText =
                        `🆕 LATEST NEWS UPDATE | PVM BCA COLLEGE\n` +
                        `${divider}\n\n` +
                        `📌 ${newsTitle.toUpperCase()}\n\n` +
                        `${newsContent.substring(0, 400)}...\n\n` +
                        `${divider}\n` +
                        `🔗 Read full story here:\n${newsUrl}\n\n` +
                        `Stay Updated!\n` +
                        `© PVM BCA College`;

                    const body = encodeURIComponent(bodyText);
                    window.location.href = `mailto:?bcc=${bccAddresses}&subject=${subject}&body=${body}`;
                } else {
                    toast({
                        title: "No Subscribers",
                        description: "News saved, but there are no subscribers to notify.",
                    });
                }
            } else {
                toast({
                    title: "Success",
                    description: "News article saved successfully!",
                    className: "bg-green-500 text-white border-none",
                });
            }

            setShowEditModal(false);
            setEditingNews(null);
        } catch (error) {
            console.error('Error saving news:', error);
            toast({
                title: "Error",
                description: "Failed to save news article.",
                variant: "destructive",
            });
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
                const currentStatus = data.status;

                // Fix missing status OR fix case sensitivity (e.g. 'Approved' -> 'approved')
                if (!currentStatus || !['pending', 'approved', 'rejected'].includes(currentStatus)) {
                    restoredCount++;

                    let newStatus = 'approved'; // Default fallback
                    if (currentStatus && typeof currentStatus === 'string') {
                        const lower = currentStatus.toLowerCase();
                        if (['pending', 'approved', 'rejected'].includes(lower)) {
                            newStatus = lower;
                        }
                    }

                    return updateDoc(doc(db, 'news', docSnapshot.id), {
                        status: newStatus,
                        approvedBy: 'system_migration',
                        approvedAt: serverTimestamp()
                    });
                }
            });

            await Promise.all(updates);

            logAdminActivity({
                action: 'UPDATE_DATA',
                target: 'News',
                details: `Restored ${restoredCount} legacy news articles`
            });

            if (restoredCount > 0) {
                toast({
                    title: "Success",
                    description: `Successfully restored ${restoredCount} legacy news articles!`,
                    className: "bg-green-500 text-white border-none",
                    duration: 3000,
                });
                // Refresh by toggling tab
                const currentTab = activeTab;
                setActiveTab('rejected'); // switch briefly
                setTimeout(() => setActiveTab(currentTab), 100);
            } else {
                toast({
                    title: "Info",
                    description: "No legacy items found needing restoration.",
                    duration: 3000,
                });
            }
        } catch (error) {
            console.error("Error restoring legacy news:", error);
            toast({
                title: "Error",
                description: "Failed to restore legacy news.",
                variant: "destructive",
                duration: 3000,
            });
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
                            <NewsItemCard
                                key={item.id}
                                item={item}
                                activeTab={activeTab}
                                onApprove={(id) => requestConfirm('approve', id)}
                                onReject={(id) => requestConfirm('reject', id)}
                                onDelete={(id) => requestConfirm('delete', id)}
                                onEdit={(newsItem) => {
                                    setEditingNews(newsItem);
                                    setShowEditModal(true);
                                }}
                            />
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
                        <NewsEditForm
                            editingNews={editingNews}
                            setEditingNews={setEditingNews}
                            handleEditSave={handleEditSave}
                            onClose={() => {
                                setShowEditModal(false);
                                setEditingNews(null);
                            }}
                        />
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
