import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
    BookOpen,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    GraduationCap,
    MapPin,
    Phone,
    Mail,
    Award,
    Users,
    Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSectionVisibility } from '@/hooks/useSectionVisibility';
import { useToast } from "@/components/ui/use-toast";

export default function CourseDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { isVisible } = useSectionVisibility();
    const { toast } = useToast();
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeSem, setActiveSem] = useState<number>(0);
    const [mobileActiveSem, setMobileActiveSem] = useState<number | null>(null);

    useEffect(() => {
        if (mobileActiveSem !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileActiveSem]);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, 'courses', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setCourse({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load course details. Please try again later.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white font-poppins flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B0B3B]"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-white font-poppins flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-[#0B0B3B] mb-4">Course Not Found</h1>
                <p className="text-gray-600">The requested course could not be loaded.</p>
            </div>
        );
    }

    // Fallback for Syllabus if not present in DB
    const syllabus = course.syllabus || [];
    const hasSyllabus = syllabus.length > 0;

    const headers = ["Sr. No.", "Category of Course", "Course Title", "Course Level", "Credit", "Teaching Hrs.", "SEE Marks", "CCE Marks", "Total Marks", "Exam Duration"];

    return (
        <div className="min-h-screen bg-white font-poppins">
            <Header />

            {/* Hero Section */}
            {isVisible('courseHero') && (
                <section className="relative w-full bg-[#0B0B3B] text-white py-20 overflow-hidden">
                    {/* Background Image or Gradient */}
                    {course.image ? (
                        <>
                            <div
                                className="absolute inset-0 bg-cover bg-center z-0"
                                style={{ backgroundImage: `url(${course.image})` }}
                            />
                            <div className="absolute inset-0 bg-black/60 z-0" /> {/* Dark Overlay */}
                        </>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B3B] to-[#1a1a5e] z-0">
                            <div className="absolute inset-0 opacity-10"
                                style={{
                                    backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                                    backgroundSize: '40px 40px'
                                }}
                            />
                        </div>
                    )}
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <span className="inline-block py-1 px-3 rounded-full bg-[#FF4040] text-white text-sm font-bold mb-4">
                                Undergraduate Program
                            </span>
                            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">{course.name}</h1>
                            <p className="text-lg md:text-xl text-blue-200 leading-relaxed max-w-2xl mx-auto">
                                {course.code && `Course Code: ${course.code}`}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Course Overview & Full Form */}
            {isVisible('courseOverview') && (
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-[#0B0B3B] mb-6">Course Overview</h2>
                                <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-line">
                                    {course.description}
                                </p>

                                <div className="bg-blue-50 p-6 rounded-2xl border-l-4 border-[#0B0B3B] mt-6">
                                    <h3 className="text-xl font-bold text-[#0B0B3B] mb-2">{course.code || "Course"} Details</h3>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">{course.name}</span> is a <span className="font-semibold">{course.duration}</span> undergraduate degree.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-[#FFF9E5] p-6 rounded-2xl text-center">
                                    <Clock className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                                    <h4 className="font-bold text-[#0B0B3B]">Duration</h4>
                                    <p className="text-gray-600">{course.duration}</p>
                                </div>
                                <div className="bg-[#E5F9E5] p-6 rounded-2xl text-center">
                                    <GraduationCap className="w-10 h-10 text-green-500 mx-auto mb-3" />
                                    <h4 className="font-bold text-[#0B0B3B]">Eligibility</h4>
                                    <p className="text-gray-600">{course.eligibility}</p>
                                </div>
                                <div className="bg-[#E5E7EB] p-6 rounded-2xl text-center">
                                    <BookOpen className="w-10 h-10 text-[#0B0B3B] mx-auto mb-3" />
                                    <h4 className="font-bold text-[#0B0B3B]">Format</h4>
                                    <p className="text-gray-600">Theoretical Lectures & Hands-on Labs</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Objectives */}
            {isVisible('courseObjectives') && (
                <section className="py-16 bg-[#FDFDFF]">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-[#0B0B3B] mb-4">Course Objectives</h2>
                                <div className="w-20 h-1 bg-[#FF4040] mx-auto rounded-full"></div>
                            </div>
                            {/* Objectives (Dynamic) */}
                            {course.objectives && course.objectives.length > 0 && (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {course.objectives.map((obj: string, i: number) => (
                                        <div key={i} className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                                            <CheckCircle2 className="w-6 h-6 text-[#0B0B3B] shrink-0 mt-1" />
                                            <p className="text-gray-700">{obj}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Admission Process (Static with Dynamic Eligibility) */}
            {isVisible('courseAdmission') && (
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
                            <div>
                                <h2 className="text-3xl font-bold text-[#0B0B3B] mb-6">Eligibility Criteria</h2>
                                <ul className="space-y-4 mb-8">
                                    {course.eligibilityDetails && course.eligibilityDetails.length > 0 ? (
                                        course.eligibilityDetails.map((detail: string, i: number) => (
                                            <li key={i} className="flex items-center gap-3 text-gray-700 bg-gray-50 p-4 rounded-xl">
                                                <div className="w-2 h-2 rounded-full bg-[#FF4040]"></div>
                                                {detail}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="flex items-center gap-3 text-gray-700 bg-gray-50 p-4 rounded-xl">
                                            <div className="w-2 h-2 rounded-full bg-[#FF4040]"></div>
                                            {course.eligibility || "Eligibility criteria not updated yet."}
                                        </li>
                                    )}
                                </ul>

                                <h2 className="text-3xl font-bold text-[#0B0B3B] mb-6">Admission Process</h2>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0B0B3B] text-white flex items-center justify-center font-bold">1</div>
                                        <div>
                                            <h4 className="text-lg font-bold text-[#0B0B3B]">Fill Admission Form</h4>
                                            <p className="text-gray-600">Complete the offline admission form available at the college office.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0B0B3B] text-white flex items-center justify-center font-bold">2</div>
                                        <div>
                                            <h4 className="text-lg font-bold text-[#0B0B3B]">Submit Documents</h4>
                                            <p className="text-gray-600">Submit all required original documents along with photocopies.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0B0B3B] text-white flex items-center justify-center font-bold">3</div>
                                        <div>
                                            <h4 className="text-lg font-bold text-[#0B0B3B]">Confirm Admission</h4>
                                            <p className="text-gray-600">Pay the fees to confirm your seat.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#F0F7FF] p-8 rounded-3xl border border-blue-100">
                                <h3 className="text-2xl font-bold text-[#0B0B3B] mb-6 flex items-center gap-3">
                                    <FileText className="w-6 h-6" />
                                    Required Documents
                                </h3>
                                <ul className="grid gap-3">
                                    {[
                                        "Passport-size photos",
                                        "School Leaving Certificate (LC)",
                                        "SSC Marksheet",
                                        "HSC Marksheet",
                                        "Aadhar Card",
                                        "Caste Certificate",
                                        "Income Certificate"
                                    ].map((doc, i) => (
                                        <li key={i} className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-lg shadow-sm">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            {doc}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Syllabus - Conditional Rendering */}
            {isVisible('courseSyllabus') && (
                hasSyllabus ? (
                    <section className="py-20 bg-gray-50">
                        <div className="container mx-auto px-4">
                            <div className="max-w-7xl mx-auto">
                                <div className="text-center mb-12">
                                    <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">Course Syllabus</h2>
                                    <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full mb-6"></div>
                                    <p className="text-gray-600">Select a semester to view the detailed academic curriculum</p>
                                </div>

                                {/* Desktop View: Tabs & Table */}
                                <div className="hidden md:block">
                                    {/* Premium Pilled Tabs Navigation */}
                                    <div className="flex justify-center mb-12">
                                        <div className="inline-flex bg-gray-200/50 p-1.5 rounded-2xl overflow-x-auto max-w-full no-scrollbar">
                                            {syllabus.map((sem: any, index: number) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setActiveSem(index)}
                                                    className={`relative px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${activeSem === index
                                                        ? 'bg-white text-[#0B0B3B] shadow-md scale-100'
                                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                                        }`}
                                                >
                                                    {sem.sem}
                                                    {activeSem === index && (
                                                        <motion.div
                                                            layoutId="activeTab"
                                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF4040] mx-4 mb-2 rounded-full hidden"
                                                        />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Premium Tab Content */}
                                    <div className="min-h-[500px]">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={activeSem}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
                                            >
                                                <div className="p-6 md:p-8 bg-gradient-to-r from-blue-50/80 to-transparent border-b border-gray-100">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-[#0B0B3B] text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-900/20">
                                                            {syllabus[activeSem]?.id || activeSem + 1}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-2xl font-bold text-[#0B0B3B]">{syllabus[activeSem]?.sem}</h3>
                                                            <p className="text-gray-500 text-sm font-medium">Detailed Curriculum</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="w-full overflow-x-auto">
                                                    <table className="w-full min-w-[800px] text-left border-collapse">
                                                        <thead>
                                                            <tr className="bg-gray-50/80 sticky top-0 backdrop-blur-sm border-b border-gray-200">
                                                                {headers.map((head, idx) => {
                                                                    const widths = [
                                                                        "w-16 text-center", // SrNo
                                                                        "w-40",             // Category
                                                                        "min-w-[300px]",    // Title
                                                                        "w-24 text-center", // Level
                                                                        "w-20 text-center", // Credit
                                                                        "w-28 text-center", // Hrs
                                                                        "w-24 text-center", // SEE
                                                                        "w-24 text-center", // CCE
                                                                        "w-24 text-center", // Total
                                                                        "w-32 text-center"  // Duration
                                                                    ];
                                                                    return (
                                                                        <th key={idx} className={`p-4 text-xs font-black text-gray-500 uppercase tracking-wider bg-gray-50 border-x border-gray-100/50 ${widths[idx]}`}>
                                                                            {head}
                                                                        </th>
                                                                    );
                                                                })}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {syllabus[activeSem]?.courses?.map((course: any, idx: number) => (
                                                                <tr key={idx} className="group hover:bg-blue-50/30 transition-colors border-b border-gray-100 last:border-0">
                                                                    {/* Explicit Key Mapping for Stability */}
                                                                    {[
                                                                        course.srNo,
                                                                        course.category,
                                                                        course.title,
                                                                        course.level,
                                                                        course.credit,
                                                                        course.teachingHrs,
                                                                        course.seeMarks,
                                                                        course.cceMarks,
                                                                        course.totalMarks,
                                                                        course.duration
                                                                    ].map((val: any, vIdx) => {
                                                                        const aligns = [
                                                                            "text-center", // SrNo
                                                                            "",            // Category
                                                                            "font-bold text-[#0B0B3B]", // Title
                                                                            "text-center", // Level
                                                                            "text-center", // Credit
                                                                            "text-center", // Hrs
                                                                            "text-center", // SEE
                                                                            "text-center", // CCE
                                                                            "text-center", // Total
                                                                            "text-center"  // Duration
                                                                        ];
                                                                        return (
                                                                            <td key={vIdx} className={`p-4 text-sm font-medium text-gray-700 whitespace-pre-wrap leading-relaxed border-x border-gray-50 ${aligns[vIdx]}`}>
                                                                                {val || '-'}
                                                                            </td>
                                                                        );
                                                                    })}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Mobile View: Master-Detail Layout */}
                                <div className="block md:hidden">
                                    <div className="grid gap-4">
                                        {syllabus.map((sem: any, index: number) => (
                                            <div
                                                key={index}
                                                onClick={() => setMobileActiveSem(index)}
                                                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform cursor-pointer flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0B0B3B] flex items-center justify-center font-bold text-lg">
                                                        {sem.id || index + 1}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-[#0B0B3B] text-lg">{sem.sem}</h3>
                                                        <p className="text-gray-500 text-xs font-medium">{sem.courses?.length || 0} Subjects • Click for details</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <AnimatePresence>
                                        {mobileActiveSem !== null && (
                                            <motion.div
                                                initial={{ x: "100%" }}
                                                animate={{ x: 0 }}
                                                exit={{ x: "100%" }}
                                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                                className="fixed inset-0 z-50 bg-[#Fdfdfd] overflow-y-auto"
                                            >
                                                <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-4 z-10 shadow-sm">
                                                    <button
                                                        onClick={() => setMobileActiveSem(null)}
                                                        className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                                                    >
                                                        <h3 className="font-bold text-[#0B0B3B]">Back</h3>
                                                    </button>
                                                    <div>
                                                        <h3 className="font-bold text-[#0B0B3B] text-lg">{syllabus[mobileActiveSem]?.sem}</h3>
                                                    </div>
                                                </div>
                                                <div className="p-4 space-y-4 pb-20">
                                                    {syllabus[mobileActiveSem]?.courses?.map((course: any, idx: number) => (
                                                        <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                                            {/* Simplified Mobile Card for dynamic data validity safety */}
                                                            <h4 className="text-lg font-bold text-[#0B0B3B]">{course.title || "Subject"}</h4>
                                                            <p className="text-sm text-gray-600 mt-2">Credits: {course.credit || "N/A"}</p>
                                                            <div className="flex justify-between mt-4 text-xs font-bold text-gray-400 uppercase border-t pt-3">
                                                                <span>Total Marks</span>
                                                                <span className="text-[#0B0B3B]">{course.totalMarks || "100"}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </section>
                ) : (
                    <section className="py-20 bg-gray-50 text-center">
                        <div className="container mx-auto px-4">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">Course Syllabus</h2>
                            <p className="text-gray-600 text-lg">Detailed syllabus for {course.name} will be available soon.</p>
                        </div>
                    </section>
                )
            )}

            {/* Career Opportunities & Fees (Dynamic) */}
            {isVisible('careerFees') && (
                <section className="py-16 bg-[#FFF9E5]">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
                            <div>
                                <h2 className="text-3xl font-bold text-[#0B0B3B] mb-6">Career Opportunities</h2>
                                {course.careerOpportunities && course.careerOpportunities.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        {course.careerOpportunities.map((career: string, i: number) => (
                                            <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-orange-100 flex items-center gap-3">
                                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                                <span className="font-medium text-[#0B0B3B]">{career}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600">Career opportunities will be updated soon.</p>
                                )}
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-[#0B0B3B] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-bl-full -mr-16 -mt-16 z-0"></div>
                                <h2 className="text-3xl font-bold text-[#0B0B3B] mb-6 relative z-10">Fee Structure</h2>
                                <div className="text-center py-8 relative z-10">
                                    <p className="text-gray-500 uppercase tracking-widest font-semibold text-sm mb-2">Fees</p>
                                    <div className="text-5xl font-extrabold text-[#0B0B3B] mb-2">{course.fees || "TBD"}</div>
                                </div>
                                <div className="mt-6 text-center text-sm text-gray-500 relative z-10">
                                    * Fees are subject to change as per college/university regulations.
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Facilities (Static) */}
            {isVisible('courseFacilities') && (
                <section className="py-16 bg-[#0B0B3B] text-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Facilities Provided</h2>
                            <div className="w-20 h-1 bg-[#FF4040] mx-auto rounded-full"></div>
                        </div>
                        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { icon: Monitor, title: "Modern Labs", desc: "Computer labs with Wi-Fi & digital learning." },
                                { icon: Award, title: "Scholarships", desc: "As per government rules." },
                                { icon: Users, title: "Expert Faculty", desc: "Experienced academic staff." },
                                { icon: GraduationCap, title: "Training", desc: "Preparation for future career." }
                            ].map((fac, i) => (
                                <div key={i} className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-colors">
                                    <fac.icon className="w-10 h-10 text-[#FF4040] mb-4" />
                                    <h4 className="text-xl font-bold mb-2">{fac.title}</h4>
                                    <p className="text-blue-100">{fac.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Contact Section (Static) */}
            {isVisible('courseContact') && (
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto bg-gray-50 rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row">
                            <div className="p-8 md:p-12 md:w-1/2">
                                <h2 className="text-3xl font-bold text-[#0B0B3B] mb-6">Contact for Admission</h2>
                                <h3 className="text-xl font-bold text-[#0B0B3B] mb-6">Shree Patel Vidhyarthi Science College, Keshod</h3>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-5 h-5 text-[#0B0B3B]" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#0B0B3B]">Address</h4>
                                            <p className="text-gray-600">Veraval road, Behind Maruti Suzuki showroom - Keshod</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <Phone className="w-5 h-5 text-[#0B0B3B]" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#0B0B3B]">Phone</h4>
                                            <p className="text-gray-600">9687451774</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-5 h-5 text-[#0B0B3B]" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#0B0B3B]">Email</h4>
                                            <p className="text-gray-600">pvmbcacollege@gmail.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative md:w-1/2 h-[300px] md:h-auto">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3717.689454355406!2d70.24696867384532!3d21.28375677897427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bfd51c1a044a10f%3A0xe5fda820639d2d32!2sPVM%20Computer%20Science%20College%20Keshod!5e0!3m2!1sen!2sin!4v1765452591100!5m2!1sen!2sin"
                                    className="absolute inset-0 w-full h-full border-0"
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </div>
    );
}
