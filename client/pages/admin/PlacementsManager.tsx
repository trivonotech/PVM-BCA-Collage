import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, Search, Edit, Trash2, X, Upload, Briefcase, GraduationCap, BarChart } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useToast } from "@/components/ui/use-toast";

interface Placement {
    id: string;
    studentName: string;
    company: string;
    package: string;
    course: string;
    type: 'Success Story' | 'Top Student' | 'Regular';
    image?: string;
    quote?: string;
    createdAt?: { seconds: number; nanoseconds: number } | string | number | any;
    updatedAt?: { seconds: number; nanoseconds: number } | string | number | any;
}

interface PlacementStats {
    averagePackage: string;
    highestPackage: string;
    companiesVisited: string;
    studentsPlaced: string;
}

export default function PlacementsManager() {
    const { toast } = useToast();
    const [placements, setPlacements] = useState<Placement[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Placement | null>(null);
    const [imagePreview, setImagePreview] = useState('');

    // Stats Management
    const [showStatsModal, setShowStatsModal] = useState(false);
    const [stats, setStats] = useState<PlacementStats>({
        averagePackage: '4.5 LPA',
        highestPackage: '0 LPA', // Will trigger auto-calc if 0/empty in previous logic, but now we allow override
        companiesVisited: '0+',
        studentsPlaced: '0%'
    });

    // Confirmation Modal States
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        studentName: '',
        company: '',
        package: '',
        course: 'BCA',
        type: 'Regular' as Placement['type'],
        image: '',
        quote: '',
    });

    // Subscribe to Placements
    useEffect(() => {
        const q = query(collection(db, 'placements'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Placement[];
            setPlacements(data);
        });
        return () => unsubscribe();
    }, []);

    // Load Stats
    useEffect(() => {
        const loadStats = async () => {
            try {
                const docRef = doc(db, 'settings', 'placementStats');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setStats(docSnap.data() as PlacementStats);
                }
            } catch (error: unknown) {
                console.error("Error loading stats:", error);
                // Silent error or toast? Silent on load is usually better
            }
        };
        loadStats();
    }, [toast]);

    const handleAdd = () => {
        setEditingItem(null);
        setFormData({
            studentName: '',
            company: '',
            package: '',
            course: 'BCA',
            type: 'Regular',
            image: '',
            quote: '',
        });
        setImagePreview('');
        setShowModal(true);
    };

    const handleEdit = (item: Placement) => {
        setEditingItem(item);
        setFormData({
            studentName: item.studentName,
            company: item.company,
            package: item.package,
            course: item.course,
            type: item.type,
            image: item.image || '',
            quote: item.quote || '',
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
            await deleteDoc(doc(db, 'placements', itemToDelete));
            setShowDeleteConfirm(false);
            setItemToDelete(null);
            toast({
                title: "Deleted",
                description: "Placement record has been deleted.",
            });
        } catch (error: unknown) {
            console.error("Error deleting:", error);
            toast({
                title: "Error",
                description: "Failed to delete placement record.",
                variant: "destructive",
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await updateDoc(doc(db, 'placements', editingItem.id), {
                    ...formData,
                    updatedAt: new Date().toISOString()
                });
                toast({
                    title: "Updated",
                    description: "Placement record updated successfully.",
                });
            } else {
                await addDoc(collection(db, 'placements'), {
                    ...formData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                });
                toast({
                    title: "Created",
                    description: "New placement record added successfully.",
                });
            }
            setShowModal(false);
        } catch (error: unknown) {
            console.error("Error saving:", error);
            toast({
                title: "Error",
                description: "Failed to save placement record.",
                variant: "destructive",
            });
        }
    };

    const handleStatsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await setDoc(doc(db, 'settings', 'placementStats'), stats);
            setShowStatsModal(false);
            toast({
                title: "Stats Updated",
                description: "Placement statistics have been updated successfully.",
            });
        } catch (error: unknown) {
            console.error("Error saving stats:", error);
            toast({
                title: "Error",
                description: "Failed to save stats. Please check your permissions.",
                variant: "destructive",
            });
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setImagePreview(base64);
                setFormData(prev => ({ ...prev, image: base64 }));
            };
            reader.readAsDataURL(file);
        }
    };

    const filteredItems = placements.filter((item) =>
        item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Placement Management</h1>
                        <p className="text-gray-600 mt-1">Manage student placements and success stories</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowStatsModal(true)}
                            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-lg"
                        >
                            <BarChart className="w-5 h-5" />
                            Manage Stats
                        </button>
                        <button
                            onClick={handleAdd}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                            Add New Placement
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by student name or company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
                                        {item.image ? (
                                            <img src={item.image} alt={item.studentName} className="w-full h-full object-cover" />
                                        ) : (
                                            <Briefcase className="w-8 h-8 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{item.studentName}</h3>
                                        <p className="text-blue-600 font-medium">{item.company}</p>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Package</span>
                                        <span className="font-semibold text-gray-900">{item.package}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Course</span>
                                        <span className="font-semibold text-gray-900">{item.course}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Type</span>
                                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">{item.type}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" /> Edit
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(item.id)}
                                        className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                        <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No placement records found</h3>
                        <p className="text-gray-600 mb-6">Start building your placement showcase by adding records.</p>
                        <button
                            onClick={handleAdd}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" /> Add First Placement
                        </button>
                    </div>
                )}
            </div>

            {/* Existing Placement Modal (Add/Edit) */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingItem ? 'Edit Placement' : 'Add New Placement'}
                hideScrollbar={true}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Student Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.studentName}
                            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                            placeholder="e.g. Rahul Sharma"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Company *</label>
                            <input
                                type="text"
                                required
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                                placeholder="e.g. Google"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Package *</label>
                            <input
                                type="text"
                                required
                                value={formData.package}
                                onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                                placeholder="e.g. 12 LPA"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Course</label>
                            <select
                                value={formData.course}
                                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                            >
                                {['BCA', 'BBA', 'B.Com', 'B.Sc', 'M.Sc'].map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as Placement['type'] })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                            >
                                <option value="Regular">Regular</option>
                                <option value="Top Student">Top Student</option>
                                <option value="Success Story">Success Story</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Select <b>Success Story</b> to display in the website's Success Stories section.</p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Student Image</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                            {imagePreview ? (
                                <div className="relative w-fit mx-auto">
                                    <img src={imagePreview} className="h-32 w-32 object-cover rounded-full" />
                                    <button type="button" onClick={() => { setImagePreview(''); setFormData(p => ({ ...p, image: '' })) }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X className="w-4 h-4" /></button>
                                </div>
                            ) : (
                                <label className="cursor-pointer block">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <span className="text-sm text-gray-500">Click to upload</span>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Quote (for Success Story)</label>
                        <textarea
                            value={formData.quote}
                            onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                            rows={3}
                            placeholder="Student's testimonial..."
                        />
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200">Cancel</button>
                        <button type="submit" className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">{editingItem ? 'Update' : 'Create'}</button>
                    </div>
                </form>
            </Modal>

            {/* New Stats Management Modal */}
            <Modal
                isOpen={showStatsModal}
                onClose={() => setShowStatsModal(false)}
                title="Manage Placement Statistics"
                hideScrollbar={true}
            >
                <form onSubmit={handleStatsSubmit} className="space-y-6">
                    <p className="text-gray-600 text-sm">Update the statistics shown on the Placements page.</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Average Package</label>
                            <input
                                type="text"
                                value={stats.averagePackage}
                                onChange={(e) => setStats({ ...stats, averagePackage: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                                placeholder="e.g. 4.5 LPA"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Highest Package</label>
                            <input
                                type="text"
                                value={stats.highestPackage}
                                onChange={(e) => setStats({ ...stats, highestPackage: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                                placeholder="e.g. 12 LPA"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Companies Visited</label>
                            <input
                                type="text"
                                value={stats.companiesVisited}
                                onChange={(e) => setStats({ ...stats, companiesVisited: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                                placeholder="e.g. 50+"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Students Placed</label>
                            <input
                                type="text"
                                value={stats.studentsPlaced}
                                onChange={(e) => setStats({ ...stats, studentsPlaced: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                                placeholder="e.g. 95%"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={() => setShowStatsModal(false)} className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200">Cancel</button>
                        <button type="submit" className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700">Update Stats</button>
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={executeDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this placement record?"
                confirmText="Delete"
                type="danger"
            />
        </AdminLayout>
    );
}
