import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Plus, Search, Pencil, Trash2, X, GraduationCap, Upload, Image as ImageIcon, ChevronDown, ChevronUp, GripVertical, FileText } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useToast } from "@/components/ui/use-toast";
import { compressImage } from '@/utils/imageUtils';

// --- Types ---
interface Subject {
    srNo: string;
    category: string;
    title: string;
    level: string;
    credit: string;
    teachingHrs: string;
    seeMarks: string;
    cceMarks: string;
    totalMarks: string;
    duration: string;
}

interface SyllabusSemester {
    id: number;
    sem: string; // "Semester 1"
    courses: Subject[];
}

interface Course {
    id: string;
    name: string;
    code: string;
    duration: string;
    eligibility: string; // Short text
    eligibilityDetails: string[]; // Detailed list
    seats: number;
    fees: string;
    description: string;
    image: string;
    objectives: string[];
    careerOpportunities: string[];
    syllabus: SyllabusSemester[];
    createdAt?: unknown;
}

// --- Components ---

const DynamicListInput = ({ label, items, onChange, placeholder }: { label: string, items: string[], onChange: (items: string[]) => void, placeholder: string }) => {
    const [newItem, setNewItem] = useState('');

    const addItem = () => {
        if (newItem.trim()) {
            onChange([...items, newItem.trim()]);
            setNewItem('');
        }
    };

    const removeItem = (index: number) => {
        onChange(items.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
                    className="flex-1 p-2 border rounded-lg"
                    placeholder={placeholder}
                />
                <button type="button" onClick={addItem} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add</button>
            </div>
            <ul className="space-y-2">
                {items.map((item, index) => (
                    <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <span className="text-sm text-gray-700">{item}</span>
                        <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">
                            <X className="w-4 h-4" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const SyllabusEditor = ({ syllabus, onChange }: { syllabus: SyllabusSemester[], onChange: (s: SyllabusSemester[]) => void }) => {

    const addSemester = () => {
        const nextId = syllabus.length + 1;
        onChange([...syllabus, { id: nextId, sem: `Semester ${nextId}`, courses: [] }]);
    };

    const removeSemester = (index: number) => {
        onChange(syllabus.filter((_, i) => i !== index));
    };

    const updateSemesterName = (index: number, name: string) => {
        const newSyllabus = [...syllabus];
        newSyllabus[index].sem = name;
        onChange(newSyllabus);
    };

    const addSubject = (semIndex: number) => {
        const newSyllabus = [...syllabus];
        const nextSr = newSyllabus[semIndex].courses.length + 1;
        newSyllabus[semIndex].courses.push({
            srNo: nextSr.toString(),
            category: 'Major', // Default
            title: '',
            level: '4.5',
            credit: '4',
            teachingHrs: '60',
            seeMarks: '50',
            cceMarks: '50',
            totalMarks: '100',
            duration: '2:30 Hrs'
        });
        onChange(newSyllabus);
    };

    const removeSubject = (semIndex: number, subjectIndex: number) => {
        const newSyllabus = [...syllabus];
        newSyllabus[semIndex].courses = newSyllabus[semIndex].courses.filter((_, i) => i !== subjectIndex);
        onChange(newSyllabus);
    };

    const updateSubject = (semIndex: number, subjectIndex: number, field: keyof Subject, value: string) => {
        const newSyllabus = [...syllabus];
        newSyllabus[semIndex].courses[subjectIndex] = {
            ...newSyllabus[semIndex].courses[subjectIndex],
            [field]: value
        };
        onChange(newSyllabus);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Syllabus Configuration</h3>
                <button type="button" onClick={addSemester} className="flex items-center gap-2 bg-[#0B0B3B] text-white px-4 py-2 rounded-lg hover:bg-[#1a1a5e]">
                    <Plus className="w-4 h-4" /> Add Semester
                </button>
            </div>

            {syllabus.map((sem, semIndex) => (
                <div key={sem.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                    <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                        <input
                            type="text"
                            value={sem.sem}
                            onChange={(e) => updateSemesterName(semIndex, e.target.value)}
                            className="font-bold text-gray-800 bg-transparent border-none focus:ring-0 text-lg"
                        />
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={() => removeSemester(semIndex)} className="text-red-500 p-2 hover:bg-red-50 rounded-full">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="p-4 overflow-x-auto no-scrollbar">
                        <div className="min-w-[1000px]">
                            <div className="grid grid-cols-[50px_100px_2fr_50px_50px_80px_60px_60px_60px_80px_40px] gap-2 font-bold text-xs text-gray-500 uppercase mb-2 px-2">
                                <div>Sr</div>
                                <div>Cat</div>
                                <div>Title</div>
                                <div>Lvl</div>
                                <div>Cr</div>
                                <div>Hrs</div>
                                <div>SEE</div>
                                <div>CCE</div>
                                <div>Tot</div>
                                <div>Dur</div>
                                <div></div>
                            </div>
                            <div className="space-y-2">
                                {sem.courses.map((subject, subIndex) => (
                                    <div key={subIndex} className="grid grid-cols-[50px_100px_2fr_50px_50px_80px_60px_60px_60px_80px_40px] gap-2 items-center bg-gray-50/50 p-2 rounded-lg hover:bg-gray-100 transition">
                                        <input type="text" className="w-full text-xs p-1 border rounded" value={subject.srNo} onChange={e => updateSubject(semIndex, subIndex, 'srNo', e.target.value)} />
                                        <input type="text" className="w-full text-xs p-1 border rounded" value={subject.category} onChange={e => updateSubject(semIndex, subIndex, 'category', e.target.value)} />
                                        <textarea rows={1} className="w-full text-xs p-1 border rounded resize-none" value={subject.title} onChange={e => updateSubject(semIndex, subIndex, 'title', e.target.value)} />
                                        <input type="text" className="w-full text-xs p-1 border rounded" value={subject.level} onChange={e => updateSubject(semIndex, subIndex, 'level', e.target.value)} />
                                        <input type="text" className="w-full text-xs p-1 border rounded" value={subject.credit} onChange={e => updateSubject(semIndex, subIndex, 'credit', e.target.value)} />
                                        <input type="text" className="w-full text-xs p-1 border rounded" value={subject.teachingHrs} onChange={e => updateSubject(semIndex, subIndex, 'teachingHrs', e.target.value)} />
                                        <input type="text" className="w-full text-xs p-1 border rounded" value={subject.seeMarks} onChange={e => updateSubject(semIndex, subIndex, 'seeMarks', e.target.value)} />
                                        <input type="text" className="w-full text-xs p-1 border rounded" value={subject.cceMarks} onChange={e => updateSubject(semIndex, subIndex, 'cceMarks', e.target.value)} />
                                        <input type="text" className="w-full text-xs p-1 border rounded" value={subject.totalMarks} onChange={e => updateSubject(semIndex, subIndex, 'totalMarks', e.target.value)} />
                                        <input type="text" className="w-full text-xs p-1 border rounded" value={subject.duration} onChange={e => updateSubject(semIndex, subIndex, 'duration', e.target.value)} />
                                        <button type="button" onClick={() => removeSubject(semIndex, subIndex)} className="text-red-400 hover:text-red-600">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button type="button" onClick={() => addSubject(semIndex)} className="mt-4 text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                            <Plus className="w-3 h-3" /> Add Subject
                        </button>
                    </div>
                </div>
            ))}

            {syllabus.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400">
                    No semesters added. Click "Add Semester" to begin.
                </div>
            )}
        </div>
    );
};


// --- Main Page Component ---

export default function CoursesManager() {
    const { toast } = useToast();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [formData, setFormData] = useState<Partial<Course>>({
        name: '', code: '', duration: '', eligibility: '', seats: 60, fees: '', description: '', image: '',
        objectives: [], careerOpportunities: [], syllabus: [], eligibilityDetails: []
    });

    // Delete State
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Image Upload Ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

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
            toast({ title: "Error", description: "Failed to upload image.", variant: "destructive" });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const coursePayload = {
                ...formData,
                updatedAt: serverTimestamp()
            };

            if (editingCourse) {
                await updateDoc(doc(db, 'courses', editingCourse.id), coursePayload);
            } else {
                await addDoc(collection(db, 'courses'), {
                    ...coursePayload,
                    createdAt: serverTimestamp()
                });
            }
            setIsModalOpen(false);
            setEditingCourse(null);
            resetForm();
            toast({ title: "Success", description: "Course saved successfully!", className: "bg-green-500 text-white border-none" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to save course.", variant: "destructive" });
        }
    };

    const resetForm = () => {
        setFormData({
            name: '', code: '', duration: '', eligibility: '', seats: 60, fees: '', description: '', image: '',
            objectives: [], careerOpportunities: [], syllabus: [], eligibilityDetails: []
        });
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteDoc(doc(db, 'courses', deleteId));
            setDeleteId(null);
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete course.", variant: "destructive" });
        }
    };

    const openEdit = (course: Course) => {
        setEditingCourse(course);
        setFormData({
            ...course,
            // Ensure arrays exist if migrating from old data
            objectives: course.objectives || [],
            careerOpportunities: course.careerOpportunities || [],
            syllabus: course.syllabus || [],
            eligibilityDetails: course.eligibilityDetails || []
        });
        setIsModalOpen(true);
    };

    const filteredCourses = courses.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
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
                        resetForm();
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
                                    <button onClick={() => openEdit(course)} className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm">
                                        <Pencil className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => setDeleteId(course.id)} className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full text-white backdrop-blur-sm">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{course.name}</h3>
                                    <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-full uppercase whitespace-nowrap shrink-0">
                                        {course.code}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 mb-4">
                                    <span>{course.duration}</span>
                                    <span>{course.seats} Seats</span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{course.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit/Create Modal (Large) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{editingCourse ? 'Edit Course' : 'Create New Course'}</h2>
                                <p className="text-sm text-gray-500">Manage course details, curriculum, and metadata.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition">
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Body (Scrollable) */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar">
                            <form id="course-form" onSubmit={handleSubmit} className="space-y-8">

                                {/* Section 1: Basic Info */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-[#0B0B3B] border-b pb-2">Basic Information</h3>
                                    <div className="flex gap-6 items-start">
                                        {/* Image Upload */}
                                        <div className="w-48 shrink-0">
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition overflow-hidden"
                                            >
                                                {formData.image ? (
                                                    <div className="relative w-full h-full group">
                                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setFormData({ ...formData, image: '' });
                                                                }}
                                                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                                                title="Remove Image"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                                                        <p className="text-xs text-gray-500 text-center px-2">Click to upload Image</p>
                                                    </>
                                                )}
                                            </div>
                                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                        </div>

                                        {/* Fields */}
                                        <div className="flex-1 grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded-lg" placeholder="e.g. Bachelor of Computer Applications" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                                                <input required type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} className="w-full p-2 border rounded-lg" placeholder="e.g. BCA" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                                <input required type="text" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full p-2 border rounded-lg" placeholder="e.g. 3 Years" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Total Seats</label>
                                                <input required type="number" value={formData.seats} onChange={e => setFormData({ ...formData, seats: parseInt(e.target.value) })} className="w-full p-2 border rounded-lg" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Fees</label>
                                                <input required type="text" value={formData.fees} onChange={e => setFormData({ ...formData, fees: e.target.value })} className="w-full p-2 border rounded-lg" placeholder="e.g. ₹25,000 / Sem" />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                                                <textarea required rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border rounded-lg" placeholder="Brief overview..." />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility (Short)</label>
                                                <input required type="text" value={formData.eligibility} onChange={e => setFormData({ ...formData, eligibility: e.target.value })} className="w-full p-2 border rounded-lg" placeholder="e.g. 12th Pass" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Detailed Lists */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-[#0B0B3B] border-b pb-2">Course Details</h3>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <DynamicListInput
                                            label="Course Objectives"
                                            placeholder="Add an objective..."
                                            items={formData.objectives || []}
                                            onChange={items => setFormData({ ...formData, objectives: items })}
                                        />
                                        <div className="space-y-8">
                                            <DynamicListInput
                                                label="Career Opportunities"
                                                placeholder="Add a career role..."
                                                items={formData.careerOpportunities || []}
                                                onChange={items => setFormData({ ...formData, careerOpportunities: items })}
                                            />
                                            <DynamicListInput
                                                label="Eligibility Criteria (Detailed)"
                                                placeholder="Add requirement..."
                                                items={formData.eligibilityDetails || []}
                                                onChange={items => setFormData({ ...formData, eligibilityDetails: items })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Syllabus */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-[#0B0B3B] border-b pb-2">Academic Curriculum</h3>
                                    <SyllabusEditor
                                        syllabus={formData.syllabus || []}
                                        onChange={s => setFormData({ ...formData, syllabus: s })}
                                    />
                                </div>

                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 z-10">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2 rounded-xl text-gray-700 font-bold hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="course-form"
                                className="px-6 py-2 rounded-xl bg-[#0B0B3B] text-white font-bold hover:bg-[#1a1a5e] transition shadow-lg shadow-blue-900/20"
                            >
                                {editingCourse ? 'Save Changes' : 'Create Course'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
