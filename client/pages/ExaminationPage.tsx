import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Bell, Calendar, FileText, Download } from 'lucide-react';

export default function ExaminationPage() {
    const examNotices = [
        {
            title: 'Semester 1 Examination Schedule Released',
            date: '10th Dec 2024',
            type: 'Important',
            desc: 'The examination schedule for Semester 1 has been published. Students are requested to check their timetable.'
        },
        {
            title: 'Hall Ticket Download Available',
            date: '8th Dec 2024',
            type: 'Notice',
            desc: 'Hall tickets for upcoming examinations are now available for download from the student portal.'
        },
        {
            title: 'Exam Pattern Changes for BCA',
            date: '5th Dec 2024',
            type: 'Update',
            desc: 'Important changes in the examination pattern for BCA students. Please refer to the detailed notification.'
        }
    ];

    const results = [
        { exam: 'Semester 5 Results', course: 'All Courses', status: 'Declared', date: '1st Dec 2024' },
        { exam: 'Semester 3 Results', course: 'BBA & B.Com', status: 'Declared', date: '25th Nov 2024' },
        { exam: 'Semester 1 Results', course: 'All Courses', status: 'Under Process', date: 'TBA' }
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
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Examination & Results</h1>
                        <p className="text-lg md:text-xl text-blue-200 leading-relaxed">
                            Stay Updated With Examination Schedules, Notices, And Result Announcements
                        </p>
                    </div>
                </div>
            </section>

            {/* Exam Notices */}
            <section className="py-20 bg-[#FDFDFF]">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">
                                Exam Notices
                            </h2>
                            <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full mb-6"></div>
                            <p className="text-gray-600 text-lg">
                                Latest updates and important notifications
                            </p>
                        </div>

                        <div className="space-y-6">
                            {examNotices.map((notice, idx) => (
                                <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-[#FF4040] hover:shadow-xl transition-shadow">
                                    <div className="flex items-start gap-6">
                                        <div className="p-4 bg-gradient-to-br from-[#FFF5F5] to-[#FFE5E5] rounded-2xl">
                                            <Bell className="w-8 h-8 text-[#FF4040]" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                                                <h3 className="text-2xl font-bold text-[#0B0B3B]">{notice.title}</h3>
                                                <span className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${notice.type === 'Important' ? 'bg-[#FF4040] text-white' :
                                                        notice.type === 'Notice' ? 'bg-[#BFD8FF] text-[#0B0B3B]' :
                                                            'bg-[#FACC15] text-[#0B0B3B]'
                                                    }`}>
                                                    {notice.type}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 mb-3 leading-relaxed">{notice.desc}</p>
                                            <p className="text-[#0B0B3B] font-semibold flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                {notice.date}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Academic Calendar */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">
                                Academic Calendar
                            </h2>
                            <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full mb-6"></div>
                            <p className="text-gray-600 text-lg">
                                Complete academic year schedule and important dates
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-gradient-to-br from-[#BFD8FF] to-[#E5E7EB] rounded-3xl p-8 shadow-xl">
                                <h3 className="text-2xl font-bold text-[#0B0B3B] mb-6 flex items-center gap-3">
                                    <Calendar className="w-7 h-7" />
                                    First Semester
                                </h3>
                                <div className="space-y-4">
                                    <div className="bg-white rounded-xl p-4">
                                        <div className="font-bold text-[#0B0B3B] mb-1">Classes Begin</div>
                                        <div className="text-gray-600">1st July - 30th Nov</div>
                                    </div>
                                    <div className="bg-white rounded-xl p-4">
                                        <div className="font-bold text-[#0B0B3B] mb-1">Mid-Term Exams</div>
                                        <div className="text-gray-600">15th Sept - 25th Sept</div>
                                    </div>
                                    <div className="bg-white rounded-xl p-4">
                                        <div className="font-bold text-[#0B0B3B] mb-1">Final Exams</div>
                                        <div className="text-gray-600">15th Nov - 30th Nov</div>
                                    </div>
                                    <div className="bg-white rounded-xl p-4">
                                        <div className="font-bold text-[#0B0B3B] mb-1">Winter Break</div>
                                        <div className="text-gray-600">1st Dec - 15th Dec</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-[#FFF5F5] to-[#FFE5E5] rounded-3xl p-8 shadow-xl">
                                <h3 className="text-2xl font-bold text-[#0B0B3B] mb-6 flex items-center gap-3">
                                    <Calendar className="w-7 h-7" />
                                    Second Semester
                                </h3>
                                <div className="space-y-4">
                                    <div className="bg-white rounded-xl p-4">
                                        <div className="font-bold text-[#0B0B3B] mb-1">Classes Begin</div>
                                        <div className="text-gray-600">16th Dec - 30th April</div>
                                    </div>
                                    <div className="bg-white rounded-xl p-4">
                                        <div className="font-bold text-[#0B0B3B] mb-1">Mid-Term Exams</div>
                                        <div className="text-gray-600">15th Feb - 25th Feb</div>
                                    </div>
                                    <div className="bg-white rounded-xl p-4">
                                        <div className="font-bold text-[#0B0B3B] mb-1">Final Exams</div>
                                        <div className="text-gray-600">15th April - 30th April</div>
                                    </div>
                                    <div className="bg-white rounded-xl p-4">
                                        <div className="font-bold text-[#0B0B3B] mb-1">Summer Break</div>
                                        <div className="text-gray-600">1st May - 30th June</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Result Updates */}
            <section className="py-20 bg-gradient-to-b from-[#FDFDFF] to-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">
                                Result Updates
                            </h2>
                            <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full mb-6"></div>
                            <p className="text-gray-600 text-lg">
                                Check your examination results and download mark sheets
                            </p>
                        </div>

                        <div className="space-y-6 mb-12">
                            {results.map((result, idx) => (
                                <div key={idx} className="bg-white rounded-2xl p-8 shadow-xl border-2 border-[#BFD8FF] hover:shadow-2xl transition-shadow">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-6">
                                            <div className="p-4 bg-gradient-to-br from-[#BFD8FF] to-[#E5E7EB] rounded-2xl">
                                                <FileText className="w-8 h-8 text-[#0B0B3B]" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-[#0B0B3B] mb-1">{result.exam}</h3>
                                                <p className="text-gray-600 mb-1">{result.course}</p>
                                                <p className="text-sm text-gray-500">{result.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-6 py-3 rounded-full font-bold ${result.status === 'Declared'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {result.status}
                                            </span>
                                            {result.status === 'Declared' && (
                                                <button className="px-6 py-3 bg-[#0B0B3B] text-white rounded-full font-bold hover:bg-[#1a1a5e] transition-colors flex items-center gap-2">
                                                    <Download className="w-5 h-5" />
                                                    Download
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Links */}
                        <div className="bg-gradient-to-r from-[#0B0B3B] to-[#1a1a5e] rounded-3xl p-10 shadow-2xl text-white">
                            <h3 className="text-2xl font-bold mb-8 text-center">Quick Links</h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                <button className="bg-white/10 hover:bg-white/20 rounded-2xl p-6 transition-colors text-center">
                                    <Download className="w-10 h-10 mx-auto mb-3" />
                                    <div className="font-bold">Download Hall Ticket</div>
                                </button>
                                <button className="bg-white/10 hover:bg-white/20 rounded-2xl p-6 transition-colors text-center">
                                    <FileText className="w-10 h-10 mx-auto mb-3" />
                                    <div className="font-bold">View Time Table</div>
                                </button>
                                <button className="bg-white/10 hover:bg-white/20 rounded-2xl p-6 transition-colors text-center">
                                    <Bell className="w-10 h-10 mx-auto mb-3" />
                                    <div className="font-bold">Exam Guidelines</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
