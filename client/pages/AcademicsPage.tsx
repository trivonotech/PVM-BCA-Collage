import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BookOpen, Download, Calendar, FileText, GraduationCap } from 'lucide-react';

export default function AcademicsPage() {
    const courses = [
        {
            name: 'Bachelor of Business Administration (BBA)',
            duration: '3 Years',
            seats: 120,
            eligibility: '10+2 with minimum 50%',
            color: 'from-[#BFD8FF] to-[#E5E7EB]'
        },
        {
            name: 'Bachelor of Commerce (B.Com)',
            duration: '3 Years',
            seats: 100,
            eligibility: '10+2 with minimum 45%',
            color: 'from-[#FFF5F5] to-[#FFE5E5]'
        },
        {
            name: 'Bachelor of Computer Applications (BCA)',
            duration: '3 Years',
            seats: 80,
            eligibility: '10+2 with Mathematics',
            color: 'from-[#FFF9E5] to-[#FFEED5]'
        },
        {
            name: 'Bachelor of Science (B.Sc)',
            duration: '3 Years',
            seats: 90,
            eligibility: '10+2 with Science stream',
            color: 'from-[#E5F9E5] to-[#D5F5D5]'
        }
    ];

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
            <section className="relative w-full bg-gradient-to-br from-[#0B0B3B] to-[#1a1a5e] text-white py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Academics</h1>
                        <p className="text-lg md:text-xl text-blue-200 leading-relaxed">
                            Comprehensive Programs Designed For Industry Readiness And Career Success
                        </p>
                    </div>
                </div>
            </section>

            {/* Courses Offered */}
            <section className="py-20 bg-[#FDFDFF]">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">
                                Courses Offered
                            </h2>
                            <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full"></div>
                        </div>

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
                                        <button className="w-full py-3 bg-[#0B0B3B] text-white rounded-xl font-bold hover:bg-[#1a1a5e] transition-colors">
                                            View Details →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Study Materials */}
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

            {/* Academic Calendar */}
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

            {/* Online Resources */}
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

            <Footer />
        </div>
    );
}
