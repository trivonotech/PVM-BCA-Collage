import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Calendar, Save, Plus, Trash2, GraduationCap, ListOrdered } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { useToast } from "@/components/ui/use-toast";
import { logAdminActivity } from '@/lib/ActivityLogger';

export default function AdmissionsManager() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('dates');
    const [dates, setDates] = useState<any>({
        applicationStart: '',
        applicationEnd: '',
        examDate: '',
        meritDate: ''
    });
    const [steps, setSteps] = useState<any[]>([]);
    const [scholarships, setScholarships] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Load Dates
            const datesSnap = await getDoc(doc(db, 'admissions_content', 'dates'));
            if (datesSnap.exists()) setDates(datesSnap.data());

            // Load Steps
            const stepsSnap = await getDoc(doc(db, 'admissions_content', 'steps'));
            if (stepsSnap.exists()) setSteps(stepsSnap.data().items || []);

            // Load Scholarships
            const scholarSnap = await getDoc(doc(db, 'admissions_content', 'scholarships'));
            if (scholarSnap.exists()) setScholarships(scholarSnap.data().items || []);

        } catch (error) {
            console.error("Error loading admission data:", error);
        } finally {
            setLoading(false);
        }
    };

    const saveData = async (type: string) => {
        setLoading(true);
        try {
            if (type === 'dates') {
                await setDoc(doc(db, 'admissions_content', 'dates'), dates);
                logAdminActivity({
                    action: 'UPDATE_DATA',
                    target: 'Admissions',
                    details: 'Updated Admission Dates'
                });
            } else if (type === 'steps') {
                await setDoc(doc(db, 'admissions_content', 'steps'), { items: steps });
                logAdminActivity({
                    action: 'UPDATE_DATA',
                    target: 'Admissions',
                    details: 'Updated Admission Process Steps'
                });
            } else if (type === 'scholarships') {
                await setDoc(doc(db, 'admissions_content', 'scholarships'), { items: scholarships });
                logAdminActivity({
                    action: 'UPDATE_DATA',
                    target: 'Admissions',
                    details: 'Updated Scholarship Information'
                });
            }
            toast({
                title: "Success",
                description: "Changes saved successfully!",
                className: "bg-green-500 text-white border-none",
                duration: 3000,
            });
        } catch (error) {
            console.error("Error saving:", error);
            toast({
                title: "Error",
                description: "Failed to save changes.",
                className: "bg-red-500 text-white border-none",
                variant: "destructive",
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    // --- Steps Handlers ---
    const addStep = () => {
        setSteps([...steps, { step: `0${steps.length + 1}`, title: '', desc: '', color: 'bg-[#BFD8FF]' }]);
    };
    const updateStep = (index: number, field: string, value: string) => {
        const newSteps = [...steps];
        newSteps[index] = { ...newSteps[index], [field]: value };
        setSteps(newSteps);
    };
    const removeStep = (index: number) => {
        setSteps(steps.filter((_, i) => i !== index));
    };

    // --- Scholarships Handlers ---
    const addScholarship = () => {
        setScholarships([...scholarships, { name: '', eligibility: '', amount: '', link: '', icon: '🎓' }]);
    };
    const updateScholarship = (index: number, field: string, value: string) => {
        const newScholars = [...scholarships];
        newScholars[index] = { ...newScholars[index], [field]: value };
        setScholarships(newScholars);
    };
    const removeScholarship = (index: number) => {
        setScholarships(scholarships.filter((_, i) => i !== index));
    };

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <GraduationCap className="w-8 h-8 text-blue-600" />
                    Admissions Management
                </h1>
                <p className="text-gray-600 mt-2">Manage Dates, Process Steps, and Scholarship Info.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
                <button onClick={() => setActiveTab('dates')} className={`px-4 py-2 font-bold ${activeTab === 'dates' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Important Dates</button>
                <button onClick={() => setActiveTab('steps')} className={`px-4 py-2 font-bold ${activeTab === 'steps' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Admission Process</button>
                <button onClick={() => setActiveTab('scholarships')} className={`px-4 py-2 font-bold ${activeTab === 'scholarships' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Scholarships</button>
            </div>

            {/* Content Dates */}
            {activeTab === 'dates' && (
                <div className="bg-white p-6 rounded-2xl shadow-lg max-w-2xl">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Application Start Date</label>
                            <input type="date" value={dates.applicationStart || ''} onChange={(e) => setDates({ ...dates, applicationStart: e.target.value })} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Application Last Date</label>
                            <input type="date" value={dates.applicationEnd || ''} onChange={(e) => setDates({ ...dates, applicationEnd: e.target.value })} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Entrance Exam Date</label>
                            <input type="date" value={dates.examDate || ''} onChange={(e) => setDates({ ...dates, examDate: e.target.value })} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Merit List Date</label>
                            <input type="date" value={dates.meritDate || ''} onChange={(e) => setDates({ ...dates, meritDate: e.target.value })} className="w-full p-2 border rounded-lg" />
                        </div>
                        <button onClick={() => saveData('dates')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 mt-4 hover:bg-blue-700">
                            <Save className="w-4 h-4" /> Save Dates
                        </button>
                    </div>
                </div>
            )}

            {/* Content Steps */}
            {activeTab === 'steps' && (
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Process Steps</h3>
                        <button onClick={addStep} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-green-700">
                            <Plus className="w-4 h-4" /> Add Step
                        </button>
                    </div>
                    <div className="space-y-4">
                        {steps.map((step, idx) => (
                            <div key={idx} className="flex gap-4 items-start border p-4 rounded-xl bg-gray-50">
                                <div className="w-16">
                                    <label className="text-xs font-bold text-gray-500">Step #</label>
                                    <input type="text" value={step.step} onChange={(e) => updateStep(idx, 'step', e.target.value)} className="w-full p-2 border rounded" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-gray-500">Title</label>
                                    <input type="text" value={step.title} onChange={(e) => updateStep(idx, 'title', e.target.value)} className="w-full p-2 border rounded mb-2" placeholder="Step Title" />
                                    <label className="text-xs font-bold text-gray-500">Description</label>
                                    <textarea value={step.desc} onChange={(e) => updateStep(idx, 'desc', e.target.value)} className="w-full p-2 border rounded" placeholder="Description" rows={2} />
                                </div>
                                <button onClick={() => removeStep(idx)} className="text-red-500 p-2 hover:bg-red-50 rounded bg-white border border-red-200 mt-6">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => saveData('steps')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 mt-6 hover:bg-blue-700">
                        <Save className="w-4 h-4" /> Save Steps
                    </button>
                </div>
            )}

            {/* Content Scholarships */}
            {activeTab === 'scholarships' && (
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Scholarship Programs</h3>
                        <button onClick={addScholarship} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-green-700">
                            <Plus className="w-4 h-4" /> Add Program
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {scholarships.map((sch, idx) => (
                            <div key={idx} className="border p-4 rounded-xl bg-gray-50 relative">
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500">Name</label>
                                        <input type="text" value={sch.name} onChange={(e) => updateScholarship(idx, 'name', e.target.value)} className="w-full p-2 border rounded" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500">Eligibility</label>
                                        <input type="text" value={sch.eligibility} onChange={(e) => updateScholarship(idx, 'eligibility', e.target.value)} className="w-full p-2 border rounded" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500">Amount</label>
                                        <input type="text" value={sch.amount} onChange={(e) => updateScholarship(idx, 'amount', e.target.value)} className="w-full p-2 border rounded" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500">Link URL (Optional)</label>
                                        <input type="text" value={sch.link || ''} onChange={(e) => updateScholarship(idx, 'link', e.target.value)} className="w-full p-2 border rounded" placeholder="https://..." />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500">Icon Emoji</label>
                                        <input type="text" value={sch.icon} onChange={(e) => updateScholarship(idx, 'icon', e.target.value)} className="w-full p-2 border rounded" />
                                    </div>
                                </div>
                                <button onClick={() => removeScholarship(idx)} className="absolute top-2 right-2 text-red-500 p-1 hover:bg-red-50 rounded">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => saveData('scholarships')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 mt-6 hover:bg-blue-700">
                        <Save className="w-4 h-4" /> Save Scholarships
                    </button>
                </div>
            )}
        </AdminLayout>
    );
}
