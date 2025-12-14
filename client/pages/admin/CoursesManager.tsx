import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Plus, Search, Pencil, Trash2, X, GraduationCap, Upload, Image as ImageIcon } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useToast } from "@/components/ui/use-toast"; // Added useToast import
import { compressImage } from '@/utils/imageUtils';

interface Course {
    id: string;
    name: string;
    code: string; // e.g., BCA-101
    duration: string; // e.g., 3 Years
    eligibility: string; // e.g., 12th Pass
    seats: number;
    fees: string;
    description: string;
    image: string; // Base64 or URL
    createdAt?: any;
}

export default function CoursesManager() {
    const { toast } = useToast(); // Initialized useToast
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [formData, setFormData] = useState<Partial<Course>>({
        name: '', code: '', duration: '', eligibility: '', seats: 60, fees: '', description: '', image: ''
    });

    // Delete State
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Image Upload Ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const coursesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Course[];
            setCourses(coursesData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const compressed = await compressImage(file);
            setFormData(prev => ({ ...prev, image: compressed }));
        } catch (error) {
            console.error("Image upload failed:", error);
            toast({
                title: "Error",
                description: "Failed to upload image.",
                variant: "destructive",
                duration: 3000,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCourse) {
                await updateDoc(doc(db, 'courses', editingCourse.id), {
                    ...formData,
                    updatedAt: serverTimestamp()
                });
            } else {
                await addDoc(collection(db, 'courses'), {
                    ...formData,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
            }
            setIsModalOpen(false);
            setEditingCourse(null);
            setFormData({ name: '', code: '', duration: '', eligibility: '', seats: 60, fees: '', description: '', image: '' });
            toast({
                title: "Success",
                description: "Course saved successfully!",
                className: "bg-green-500 text-white border-none",
                duration: 3000,
            });
        } catch (error) {
            console.error("Error saving course:", error);
            toast({
                title: "Error",
                description: "Failed to save course.",
                variant: "destructive",
                duration: 3000,
            });
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteDoc(doc(db, 'courses', deleteId));
            setDeleteId(null);
        } catch (error) {
            console.error("Error deleting course:", error);
        }
    };

    const filteredCourses = courses.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout title="Course Management">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={() => {
                        setEditingCourse(null);
                        setFormData({ name: '', code: '', duration: '', eligibility: '', seats: 60, fees: '', description: '', image: '' });
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Course</span>
                </button>
            </div>

            {/* Courses Grid */}
            {loading ? (
                <div className="text-center py-12">Loading courses...</div>
            ) : filteredCourses.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No courses found. Add one to get started.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map(course => (
                        <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition">
                            {/* Image Header */}
                            <div className="h-40 bg-gray-100 relative overflow-hidden">
                                {course.image ? (
                                    <img src={course.image} alt={course.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <GraduationCap className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition duration-200">
                                    <button
                                        onClick={() => {
                                            setEditingCourse(course);
                                            setFormData(course);
                                            setIsModalOpen(true);
                                        }}
                                        className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm"
                                    >
                                        <Pencil className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(course.id)}
                                        className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full text-white backdrop-blur-sm"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{course.name}</h3>
                                    <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-full uppercase">
                                        {course.code}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 mb-4">
                                    <span>{course.duration}</span>
                                    <span>{course.seats} Seats</span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{course.description}</p>
                                <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                                    <span className="font-semibold text-gray-900">{course.fees}</span>
                                    <span className="text-gray-400">Eligibility: {course.eligibility}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit/Create Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCourse ? 'Edit Course' : 'New Course'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Image Upload */}
                    <div className="flex justify-center">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition overflow-hidden"
                        >
                            {formData.image ? (
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500">Click to upload course image</p>
                                </>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                            <input
                                required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-2 border rounded-lg" placeholder="e.g. Bachelor of Computer Applications"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                            <input
                                required type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })}
                                className="w-full p-2 border rounded-lg" placeholder="e.g. BCA"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                            <input
                                required type="text" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                className="w-full p-2 border rounded-lg" placeholder="e.g. 3 Years"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility</label>
                            <input
                                required type="text" value={formData.eligibility} onChange={e => setFormData({ ...formData, eligibility: e.target.value })}
                                className="w-full p-2 border rounded-lg" placeholder="e.g. 12th Pass (Any Stream)"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Seats</label>
                            <input
                                required type="number" value={formData.seats} onChange={e => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fees (Per Year/Sem)</label>
                            <input
                                required type="text" value={formData.fees} onChange={e => setFormData({ ...formData, fees: e.target.value })}
                                className="w-full p-2 border rounded-lg" placeholder="e.g. ₹25,000 / Sem"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            required rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-2 border rounded-lg" placeholder="Brief details about the course..."
                        />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                        {editingCourse ? 'Update Course' : 'Create Course'}
                    </button>
                </form>
            </Modal>

            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Course"
                message="Are you sure you want to delete this course? This cannot be undone."
            />
        </AdminLayout>
    );
}
