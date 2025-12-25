import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Search, Trash2, Mail, Calendar, UserCheck, X, Send } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useToast } from "@/components/ui/use-toast";

interface Subscriber {
    id: string;
    email: string;
    status: string;
    subscribedAt: any;
}

export default function SubscribersManager() {
    const { toast } = useToast();
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [subscriberToDelete, setSubscriberToDelete] = useState<string | null>(null);
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'subscribers'), orderBy('subscribedAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Subscriber[];
            setSubscribers(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleBroadcast = (targetEmails?: string[]) => {
        const emailsToNotify = targetEmails || subscribers.map(s => s.email);

        if (emailsToNotify.length === 0) {
            toast({
                title: "No Recipients",
                description: "Plese select at least one subscriber to send an email.",
                variant: "destructive",
            });
            return;
        }

        const bccAddresses = emailsToNotify.join(',');
        const subject = encodeURIComponent("📢 Important Update | PVM BCA College");
        const newsUrl = `${window.location.origin}/news`;

        const divider = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
        const bodyText =
            `📢 CAMPUS UPDATE | PVM BCA COLLEGE\n` +
            `${divider}\n\n` +
            `Hello,\n\n` +
            `We have some exciting new updates for you! Stay informed about the latest campus news, results, and announcements.\n\n` +
            `${divider}\n` +
            `👉 Visit our News Portal:\n${newsUrl}\n\n` +
            `Thank you for staying connected!\n` +
            `© PVM BCA College`;

        const body = encodeURIComponent(bodyText);

        // Using mailto with BCC to hide all recipient emails from each other
        window.location.href = `mailto:?bcc=${bccAddresses}&subject=${subject}&body=${body}`;
    };

    const toggleSelect = (email: string) => {
        setSelectedEmails(prev =>
            prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
        );
    };

    const toggleSelectAll = () => {
        if (selectedEmails.length === filteredSubscribers.length) {
            setSelectedEmails([]);
        } else {
            setSelectedEmails(filteredSubscribers.map(s => s.email));
        }
    };

    const handleDelete = async () => {
        if (!subscriberToDelete) return;

        try {
            await deleteDoc(doc(db, 'subscribers', subscriberToDelete));
            toast({
                title: "Success",
                description: "Subscriber removed successfully",
                className: "bg-green-500 text-white border-none",
            });
            setShowDeleteConfirm(false);
            setSubscriberToDelete(null);
        } catch (error) {
            console.error("Error deleting subscriber:", error);
            toast({
                title: "Error",
                description: "Failed to remove subscriber",
                variant: "destructive",
            });
        }
    };

    const filteredSubscribers = subscribers.filter(s =>
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Newsletter Subscribers</h1>
                        <p className="text-gray-600 mt-1">Manage users who subscribed to your newsletter</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {selectedEmails.length > 0 && (
                            <button
                                onClick={() => handleBroadcast(selectedEmails)}
                                className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-lg"
                            >
                                <Mail className="w-5 h-5" />
                                Send to Selected ({selectedEmails.length})
                            </button>
                        )}
                        <button
                            onClick={() => handleBroadcast()}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
                        >
                            <Send className="w-5 h-5" />
                            Send Email to All
                        </button>
                        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
                            <UserCheck className="w-5 h-5 text-green-500" />
                            <span className="font-bold text-gray-900">{subscribers.length}</span>
                            <span className="text-gray-500 text-sm">Total Subscribers</span>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by email address..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Subscribers List */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="p-4 w-12">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            checked={filteredSubscribers.length > 0 && selectedEmails.length === filteredSubscribers.length}
                                            onChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th className="p-4 font-bold text-gray-700">Email Address</th>
                                    <th className="p-4 font-bold text-gray-700">Status</th>
                                    <th className="p-4 font-bold text-gray-700">Subscribed On</th>
                                    <th className="p-4 font-bold text-gray-700 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center text-gray-500">Loading subscribers...</td>
                                    </tr>
                                ) : filteredSubscribers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center text-gray-500">
                                            {searchTerm ? 'No subscribers match your search' : 'No subscribers found'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSubscribers.map((sub) => (
                                        <tr key={sub.id} className={`hover:bg-gray-50 transition-colors group ${selectedEmails.includes(sub.email) ? 'bg-blue-50' : ''}`}>
                                            <td className="p-4">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                    checked={selectedEmails.includes(sub.email)}
                                                    onChange={() => toggleSelect(sub.email)}
                                                />
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                                                        <Mail className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <span className="font-medium text-gray-900">{sub.email}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase">
                                                    {sub.status || 'Active'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-500 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    {sub.subscribedAt?.toDate ? sub.subscribedAt.toDate().toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) : 'N/A'}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleBroadcast([sub.email])}
                                                        className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                        title="Mail this subscriber"
                                                    >
                                                        <Mail className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSubscriberToDelete(sub.id);
                                                            setShowDeleteConfirm(true);
                                                        }}
                                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                        title="Remove Subscriber"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDelete}
                title="Remove Subscriber"
                message="Are you sure you want to remove this email from the newsletter list?"
                confirmText="Remove"
                type="danger"
            />
        </AdminLayout>
    );
}
