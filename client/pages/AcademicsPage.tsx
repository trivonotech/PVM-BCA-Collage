import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BookOpen, Download, Calendar, FileText, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSectionVisibility } from '@/hooks/useSectionVisibility';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, collection, query, orderBy, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from "@/components/ui/use-toast";

export default function AcademicsPage() {
    const { isVisible } = useSectionVisibility();
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState<any>(() => {
        const cached = localStorage.getItem('cache_academics_content');
        return cached ? JSON.parse(cached) : null;
    });
    const [courses, setCourses] = useState<any[]>(() => {
        const cached = localStorage.getItem('cache_courses');
        return cached ? JSON.parse(cached) : [];
    });
    const { toast } = useToast();

    // Enriched Data for Auto-Seeding
    // NOTE: Added 'link' property to BCA to preserve the custom page connection
    const INITIAL_COURSES = [
        {
            id: 'bba-course',
            name: 'Bachelor of Business Administration (BBA)',
            code: 'BBA',
            duration: '3 Years',
            seats: 120,
            eligibility: '10+2 with minimum 50%',
            fees: '₹15,000 / Sem',
            description: 'The BBA program empowers students with fundamental business knowledge, leadership skills, and practical insights into the corporate world.',
            color: 'from-[#BFD8FF] to-[#E5E7EB]',
            // No custom link, will default to # or dynamic page
        },
        {
            id: 'bcom-course',
            name: 'Bachelor of Commerce (B.Com)',
            code: 'B.Com',
            duration: '3 Years',
            seats: 100,
            eligibility: '10+2 with minimum 45%',
            fees: '₹12,000 / Sem',
            description: 'Our B.Com course focuses on financial accounting, business laws, economics, and taxation.',
            color: 'from-[#FFF5F5] to-[#FFE5E5]',
        },
        {
            id: 'bca-course',
            name: 'Bachelor of Computer Applications (BCA)',
            code: 'BCA',
            duration: '3 Years',
            seats: 80,
            eligibility: '10+2 with Mathematics or Computer Science',
            fees: '₹18,000 / Sem',
            description: 'BCA is designed for aspiring tech professionals. It covers programming, database management, web development, and software engineering.',
            color: 'from-[#FFF9E5] to-[#FFEED5]',
        },
        {
            id: 'bsc-course',
            name: 'Bachelor of Science (B.Sc)',
            code: 'B.Sc',
            duration: '3 Years',
            seats: 90,
            eligibility: '10+2 with Science stream',
            fees: '₹16,500 / Sem',
            description: 'The B.Sc program offers specialization in Physics, Chemistry, and Mathematics.',
            color: 'from-[#E5F9E5] to-[#D5F5D5]',
        }
    ];

    useEffect(() => {
        const fetchAndSeedCourses = async () => {
            try {
                // Fetch all existing courses
                const q = query(collection(db, 'courses'));
                const querySnapshot = await getDocs(q);

                const existingCourses = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                const existingIds = new Set(existingCourses.map(c => c.id));

                // Check which default courses are missing
                const coursesToAdd = INITIAL_COURSES.filter(course => !existingIds.has(course.id));

                // If we have missing courses, add them in parallel
                if (coursesToAdd.length > 0) {
                    const addPromises = coursesToAdd.map(async (course) => {
                        const courseData = {
                            ...course,
                            createdAt: serverTimestamp()
                        };
                        try {
                            await setDoc(doc(db, 'courses', course.id), courseData);
                            return { ...courseData, id: course.id };
                        } catch (err) {
                            console.error(`Failed to add course ${course.id}:`, err);
                            return null;
                        }
                    });

                    const addedResults = await Promise.all(addPromises);
                    const addedCourses = addedResults.filter((c): c is any => c !== null);

                    if (addedCourses.length > 0) {
                        toast({
                            title: "Courses Updated",
                            description: `${addedCourses.length} default courses were added.`,
                            className: "bg-green-600 text-white border-none"
                        });

                        const allCourses = [...existingCourses, ...addedCourses];
                        setCourses(allCourses);
                        localStorage.setItem('cache_courses', JSON.stringify(allCourses));
                    } else {
                        setCourses(existingCourses);
                        localStorage.setItem('cache_courses', JSON.stringify(existingCourses));
                    }
                } else {
                    setCourses(existingCourses);
                    localStorage.setItem('cache_courses', JSON.stringify(existingCourses));
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching/seeding courses:", error);
                setLoading(false);
            }
        };

        fetchAndSeedCourses();
    }, []);

    // Also fetch content
    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'page_content', 'page_academics'), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setContent(data);
                localStorage.setItem('cache_academics_content', JSON.stringify(data));
            }
        });
        return () => unsub();
    }, []);

    // Link helper
    const getCourseLink = (course: any) => {
        return `/courses/${course.id}`;
    };

    const studyMaterials = [
        { title: 'Semester 1 Notes', subject: 'All Subjects', size: '25 MB' },
        { title: 'Semester 2 Notes', subject: 'All Subjects', size: '28 MB' },
        { title: 'Previous Year Papers', subject: 'All Courses', size: '15 MB' },
        { title: 'Reference Books List', subject: 'General', size: '2 MB' }
    ];

    return (
        <div className="min-h-screen bg-white font-poppins">
            <Header />

            {/* Hero Section */}
            {isVisible('academicsHero') && (
                <section className="relative w-full bg-gradient-to-br from-[#0B0B3B] to-[#1a1a5e] text-white py-20 overflow-hidden">
                    <div className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}
                    />
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
                                {content?.title || "Academics"}
                            </h1>
                            <p className="text-lg md:text-xl text-blue-200 leading-relaxed">
                                {content?.subtitle || "Comprehensive Programs Designed For Industry Readiness And Career Success"}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Courses Offered */}
            {isVisible('coursesList') && (
                <section className="py-20 bg-[#FDFDFF]">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">
                                    Courses Offered
                                </h2>
                                <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full"></div>
                            </div>

                            {loading && courses.length === 0 ? (
                                <div className="grid md:grid-cols-2 gap-8">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-3xl"></div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-8">
                                    {courses.map((course, idx) => (
                                        <div key={idx} className="group">
                                            <div className={`bg-gradient-to-br ${course.color} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}>
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="p-3 bg-white rounded-2xl shadow-md">
                                                        <GraduationCap className="w-6 h-6 text-[#0B0B3B]" />
                                                    </div>
                                                    <span className="px-4 py-2 bg-white rounded-full text-sm font-bold text-[#0B0B3B]">
                                                        {course.duration}
                                                    </span>
                                                </div>
                                                <h3 className="text-2xl font-bold text-[#0B0B3B] mb-4">{course.name}</h3>
                                                <div className="space-y-3 mb-6">
                                                    <div className="flex items-center gap-3 text-gray-700">
                                                        <span className="font-semibold">Seats:</span>
                                                        <span>{course.seats}</span>
                                                    </div>
                                                    <div className="flex items-start gap-3 text-gray-700">
                                                        <span className="font-semibold">Eligibility:</span>
                                                        <span>{course.eligibility}</span>
                                                    </div>
                                                </div>
                                                <Link to={getCourseLink(course)} className="block w-full">
                                                    <button className="w-full py-3 bg-[#0B0B3B] text-white rounded-xl font-bold hover:bg-[#1a1a5e] transition-colors">
                                                        View Details →
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Study Materials */}
            {isVisible('departmentInfo') && (
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">
                                    Study Materials
                                </h2>
                                <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full mb-6"></div>
                                <p className="text-gray-600 text-lg">
                                    Download course materials, notes, and resources
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {studyMaterials.map((material, idx) => (
                                    <div key={idx} className="flex items-center gap-6 bg-gradient-to-r from-[#BFD8FF] to-[#E5E7EB] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                                        <div className="p-4 bg-white rounded-2xl">
                                            <FileText className="w-8 h-8 text-[#0B0B3B]" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-lg font-bold text-[#0B0B3B] mb-1">{material.title}</h4>
                                            <p className="text-sm text-gray-600">{material.subject} • {material.size}</p>
                                        </div>
                                        <button className="p-3 bg-[#0B0B3B] text-white rounded-xl hover:bg-[#1a1a5e] transition-colors">
                                            <Download className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Academic Calendar */}
            {isVisible('syllabusSection') && (
                <section className="py-20 bg-gradient-to-b from-[#FDFDFF] to-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">
                                    Academic Calendar & Exam Schedule
                                </h2>
                                <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full"></div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Academic Calendar */}
                                <div className="bg-gradient-to-br from-[#0B0B3B] to-[#1a1a5e] rounded-3xl p-8 shadow-2xl text-white">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-[#BFD8FF] rounded-2xl">
                                            <Calendar className="w-6 h-6 text-[#0B0B3B]" />
                                        </div>
                                        <h3 className="text-2xl font-bold">Academic Calendar</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="border-l-4 border-[#FACC15] pl-4">
                                            <div className="font-bold text-[#FACC15] mb-1">June 2024</div>
                                            <div>New Session Begins</div>
                                        </div>
                                        <div className="border-l-4 border-[#BFD8FF] pl-4">
                                            <div className="font-bold text-[#BFD8FF] mb-1">November 2024</div>
                                            <div>Mid-Term Examinations</div>
                                        </div>
                                        <div className="border-l-4 border-[#FF6B6B] pl-4">
                                            <div className="font-bold text-[#FF6B6B] mb-1">December 2024</div>
                                            <div>Winter Break</div>
                                        </div>
                                        <div className="border-l-4 border-[#FACC15] pl-4">
                                            <div className="font-bold text-[#FACC15] mb-1">April 2025</div>
                                            <div>Final Examinations</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Exam Schedule */}
                                <div className="bg-gradient-to-br from-[#FF4040] to-[#c03030] rounded-3xl p-8 shadow-2xl text-white">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-white rounded-2xl">
                                            <BookOpen className="w-6 h-6 text-[#FF4040]" />
                                        </div>
                                        <h3 className="text-2xl font-bold">Upcoming Exams</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-white/10 rounded-2xl p-4">
                                            <div className="font-bold mb-2">Semester 1 - Theory</div>
                                            <div className="text-sm opacity-90">15th Nov - 30th Nov 2024</div>
                                        </div>
                                        <div className="bg-white/10 rounded-2xl p-4">
                                            <div className="font-bold mb-2">Semester 1 - Practical</div>
                                            <div className="text-sm opacity-90">5th Dec - 10th Dec 2024</div>
                                        </div>
                                        <div className="bg-white/10 rounded-2xl p-4">
                                            <div className="font-bold mb-2">Semester 3 - Theory</div>
                                            <div className="text-sm opacity-90">20th Nov - 5th Dec 2024</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Online Resources */}
            {isVisible('departmentInfo') && (
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">
                                    Online Resources & Downloads
                                </h2>
                                <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full"></div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {[
                                    { title: 'E-Library Access', desc: 'Access thousands of digital books and journals', icon: BookOpen },
                                    { title: 'Video Lectures', desc: 'Recorded lectures by expert faculty', icon: FileText },
                                    { title: 'Assignment Portal', desc: 'Submit and track your assignments online', icon: Download }
                                ].map((resource, idx) => (
                                    <div key={idx} className="bg-gradient-to-br from-[#BFD8FF] to-[#E5E7EB] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
                                        <div className="p-4 bg-white rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                            <resource.icon className="w-8 h-8 text-[#0B0B3B]" />
                                        </div>
                                        <h4 className="text-xl font-bold text-[#0B0B3B] mb-3">{resource.title}</h4>
                                        <p className="text-gray-600 mb-4">{resource.desc}</p>
                                        <button className="px-6 py-2 bg-[#0B0B3B] text-white rounded-full font-bold hover:bg-[#1a1a5e] transition-colors">
                                            Access Now
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </div>
    );
}
