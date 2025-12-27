import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, Search, Edit, Trash2, X, Upload, Calendar as CalendarIcon, User, Mic } from 'lucide-react';
import { compressImage } from '@/utils/imageUtils';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useToast } from "@/components/ui/use-toast";
import { getEventStatus } from "@/lib/utils";

interface Workshop {
    id: string;
    title: string;
    date: string;
    speaker: string;
    image?: string;
    createdAt?: unknown;
    updatedAt?: unknown;
}

export default function WorkshopsManager() {
    const { toast } = useToast();
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal States
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Workshop | null>(null);
    const [imagePreview, setImagePreview] = useState('');

    // Delete Confirmation
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    // Form Data
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        speaker: '',
        image: ''
    });

    // Firestore Reference
    const workshopsCollection = collection(db, 'workshops');

    // Fetch Workshops
    useEffect(() => {
        const q = query(workshopsCollection, orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Workshop[];
            setWorkshops(data);
            setLoading(false);
        }, () => {
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleAdd = () => {
        setEditingItem(null);
        setFormData({ title: '', date: '', speaker: '', image: '' });
        setImagePreview('');
        setShowModal(true);
    };

    const handleEdit = (item: Workshop) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            date: item.date,
            speaker: item.speaker,
            image: item.image || ''
        });
        setImagePreview(item.image || '');
        setShowModal(true);
    };

    const confirmDelete = (id: string) => {
        setItemToDelete(id);
        setShowDeleteConfirm(true);
    };

    const executeDelete = async () => {
        if (!itemToDelete) return;
        try {
            await deleteDoc(doc(db, 'workshops', itemToDelete));
            toast({ title: "Deleted", description: "Workshop deleted successfully." });
            setShowDeleteConfirm(false);
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete workshop.", variant: "destructive" });
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const base64 = await compressImage(file);
                setImagePreview(base64);
                setFormData(prev => ({ ...prev, image: base64 }));
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to process image",
                    variant: "destructive",
                });
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingItem) {
                await updateDoc(doc(db, 'workshops', editingItem.id), {
                    ...formData,
                    updatedAt: serverTimestamp()
                });
                toast({ title: "Updated", description: "Workshop updated successfully." });
            } else {
                await addDoc(workshopsCollection, {
                    ...formData,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
                toast({ title: "Created", description: "Workshop created successfully." });
            }
            setShowModal(false);
        } catch (error) {
            toast({ title: "Error", description: "Failed to save workshop.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredWorkshops = workshops.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.speaker.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Workshops Management</h1>
                        <p className="text-gray-600 mt-1">Manage technical workshops and seminars</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Workshop
                    </button>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search workshops..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWorkshops.map((item) => {
                        const status = getEventStatus(item.date);
                        return (
                            <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                <div className="relative h-48 bg-gray-100">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">
                                            <Mic className="w-12 h-12" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status === 'Upcoming' ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-600'}`}>
                                            {status}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <CalendarIcon className="w-4 h-4" />
                                            {item.date}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <User className="w-4 h-4" />
                                            {item.speaker}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(item)} className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 flex items-center justify-center gap-2">
                                            <Edit className="w-4 h-4" /> Edit
                                        </button>
                                        <button onClick={() => confirmDelete(item.id)} className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 flex items-center justify-center gap-2">
                                            <Trash2 className="w-4 h-4" /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingItem ? "Edit Workshop" : "Add Workshop"}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                        <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none" placeholder="e.g. AI Seminar" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                        <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Speaker</label>
                        <input type="text" value={formData.speaker} onChange={e => setFormData({ ...formData, speaker: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none" placeholder="e.g. Dr. Sharma" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Image</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                            {imagePreview ? (
                                <div className="relative w-fit mx-auto">
                                    <img src={imagePreview} className="h-32 object-contain" />
                                    <button type="button" onClick={() => { setImagePreview(''); setFormData({ ...formData, image: '' }) }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X className="w-4 h-4" /></button>
                                </div>
                            ) : (
                                <label className="cursor-pointer block">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <span className="text-sm text-gray-500">Upload Image</span>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button type="button" onClick={() => setShowModal(false)} disabled={isSubmitting} className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 disabled:opacity-50">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50">
                            {isSubmitting ? (editingItem ? 'Updating...' : 'Creating...') : (editingItem ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={executeDelete}
                title="Delete Workshop"
                message="Are you sure you want to delete this workshop? This action cannot be undone."
                confirmText="Delete"
                type="danger"
            />
        </AdminLayout>
    );
}
