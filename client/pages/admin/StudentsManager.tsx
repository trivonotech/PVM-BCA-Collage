import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, Search, Edit, Trash2, X, Upload, Trophy } from 'lucide-react';
import type { Student } from '@/../../shared/types';
import { compressImage } from '@/utils/imageUtils';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';

import { useToast } from "@/components/ui/use-toast";

export default function StudentsManager() {
    const { toast } = useToast();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    // Real-time sync
    useEffect(() => {
        const q = query(collection(db, 'students'), orderBy('rank'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const studentsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Student[];
            setStudents(studentsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching students:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [imagePreview, setImagePreview] = useState('');

    // Confirmation Modal State
    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean;
        studentId: string | null;
    }>({
        isOpen: false,
        studentId: null,
    });

    const [formData, setFormData] = useState({
        rank: '',
        name: '',
        course: '',
        achievement: '',
        image: '',
    });

    const handleAddNew = () => {
        setEditingStudent(null);
        setFormData({ rank: '', name: '', course: '', achievement: '', image: '' });
        setImagePreview('');
        setShowModal(true);
    };

    const handleEdit = (student: Student) => {
        setEditingStudent(student);
        setFormData({
            rank: student.rank,
            name: student.name,
            course: student.course,
            achievement: student.achievement,
            image: student.image || '',
        });
        setImagePreview(student.image || '');
        setShowModal(true);
    };

    const confirmDelete = (id: string) => {
        setConfirmState({ isOpen: true, studentId: id });
    };

    const executeDelete = async () => {
        if (confirmState.studentId) {
            try {
                await deleteDoc(doc(db, 'top_students', confirmState.studentId));
                setConfirmState({ isOpen: false, studentId: null });
                toast({
                    title: "Success",
                    description: "Student deleted successfully",
                    className: "bg-green-500 text-white border-none",
                    duration: 3000,
                });
            } catch (error) {
                console.error("Error deleting student:", error);
                toast({
                    title: "Error",
                    description: "Failed to delete student",
                    variant: "destructive",
                    duration: 3000,
                });
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingStudent) {
                // Update
                const studentRef = doc(db, 'top_students', editingStudent.id);
                await updateDoc(studentRef, {
                    ...formData,
                    updatedAt: serverTimestamp()
                });
            } else {
                // Create
                await addDoc(collection(db, 'top_students'), {
                    ...formData,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
            }
            setShowModal(false);
            toast({
                title: "Success",
                description: "Student saved successfully!",
                className: "bg-green-500 text-white border-none",
                duration: 3000,
            });
        } catch (error) {
            console.error("Error saving student:", error);
            toast({
                title: "Error",
                description: "Failed to save student",
                variant: "destructive",
                duration: 3000,
            });
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const compressedBase64 = await compressImage(file);
                setImagePreview(compressedBase64);
                setFormData({ ...formData, image: compressedBase64 });
            } catch (error) {
                console.error("Image compression failed:", error);
                toast({
                    title: "Error",
                    description: "Failed to process image",
                    variant: "destructive",
                    duration: 3000,
                });
            }
        }
    };

    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Top Students Management</h1>
                        <p className="text-gray-600 mt-1">Manage top performing students</p>
                    </div>
                    <button
                        onClick={handleAddNew}
                        className="bg-yellow-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-yellow-700 transition-colors flex items-center gap-2 shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        Add Student
                    </button>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredStudents.map((student) => (
                        <div key={student.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <div className="h-40 bg-gradient-to-br from-yellow-200 to-yellow-300 relative">
                                {student.image ? (
                                    <img src={student.image} alt={student.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-yellow-600">
                                        {student.name[0]}
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 bg-gray-900 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                                    {student.rank}
                                </div>
                            </div>
                            <div className="p-6 bg-blue-50">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{student.name}</h3>
                                <p className="text-sm text-gray-700 font-medium mb-2">{student.course}</p>
                                <p className="text-sm text-gray-600 mb-4">{student.achievement}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(student)}
                                        className="flex-1 bg-yellow-50 text-yellow-600 px-4 py-2 rounded-lg font-medium hover:bg-yellow-100 transition-colors"
                                    >
                                        <Edit className="w-4 h-4 mx-auto" />
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(student.id)}
                                        className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 mx-auto" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredStudents.length === 0 && (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                        <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No students found</h3>
                        <p className="text-gray-600 mb-6">Add your top performing students</p>
                        <button
                            onClick={handleAddNew}
                            className="bg-yellow-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-yellow-700 transition-colors inline-flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add First Student
                        </button>
                    </div>
                )}
            </div>

            {/* Edit/Add Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingStudent ? 'Edit Student' : 'Add Student'}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Rank *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.rank}
                                onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                                placeholder="e.g., 1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                                placeholder="e.g., MOHIT"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Course *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.course}
                            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                            placeholder="e.g., Environmental Science"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Achievement *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.achievement}
                            onChange={(e) => setFormData({ ...formData, achievement: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                            placeholder="e.g., First Rank in University"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Student Photo (Optional)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                            {imagePreview ? (
                                <div className="relative">
                                    <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImagePreview('');
                                            setFormData({ ...formData, image: '' });
                                        }}
                                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">Upload student photo</p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="student-image"
                            />
                            {!imagePreview && (
                                <label
                                    htmlFor="student-image"
                                    className="mt-4 inline-block bg-yellow-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-yellow-700"
                                >
                                    Choose File
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-yellow-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-yellow-700"
                        >
                            {editingStudent ? 'Update' : 'Add Student'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmState.isOpen}
                onClose={() => setConfirmState({ isOpen: false, studentId: null })}
                onConfirm={executeDelete}
                title="Delete Student"
                message="Are you sure you want to delete this student record? This action cannot be undone."
                confirmText="Delete"
                type="danger"
            />
        </AdminLayout>
    );
}
