import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ClipboardCheck, DollarSign, CalendarDays, FileCheck } from 'lucide-react';

export default function AdmissionsPage() {
    const admissionSteps = [
        {
            step: '01',
            title: 'Fill Application Form',
            desc: 'Complete the online or offline application form with accurate details',
            color: 'bg-[#BFD8FF]'
        },
        {
            step: '02',
            title: 'Document Submission',
            desc: 'Submit all required documents including marksheets and certificates',
            color: 'bg-[#FFF5F5]'
        },
        {
            step: '03',
            title: 'Entrance Test (If Applicable)',
            desc: 'Appear for the entrance examination as per the course requirement',
            color: 'bg-[#FFF9E5]'
        },
        {
            step: '04',
            title: 'Merit List Declaration',
            desc: 'Check the merit list published on the official website',
            color: 'bg-[#E5F9E5]'
        },
        {
            step: '05',
            title: 'Fee Payment',
            desc: 'Pay the admission fees within the stipulated time period',
            color: 'bg-[#FFE5F5]'
        },
        {
            step: '06',
            title: 'Admission Confirmation',
            desc: 'Receive admission confirmation and join orientation program',
            color: 'bg-[#E5EFFF]'
        }
    ];

    const scholarships = [
        {
            name: 'Merit-Based Scholarship',
            eligibility: 'Students scoring 80% and above',
            amount: 'Up to 50% fee waiver',
            icon: '🏆'
        },
        {
            name: 'Government Scholarship',
            eligibility: 'As per government criteria',
            amount: 'Varies based on category',
            icon: '🎓'
        },
        {
            name: 'Sports Quota',
            eligibility: 'State/National level players',
            amount: 'Up to 30% fee waiver',
            icon: '⚽'
        },
        {
            name: 'Economically Weaker Section',
            eligibility: 'Annual income below specified limit',
            amount: 'Up to 75% fee waiver',
            icon: '💰'
        }
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
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Admissions</h1>
                        <p className="text-lg md:text-xl text-blue-200 leading-relaxed">
                            Start Your Journey Towards A Bright Future - Admission Process Made Simple
                        </p>
                    </div>
                </div>
            </section>

            {/* Admission Process */}
            <section className="py-20 bg-[#FDFDFF]">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">
                                Admission Process
                            </h2>
                            <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full mb-6"></div>
                            <p className="text-gray-600 text-lg">
                                Follow these simple steps to secure your admission
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {admissionSteps.map((item, idx) => (
                                <div key={idx} className="relative">
                                    <div className={`${item.color} rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full`}>
                                        <div className="text-5xl font-black text-[#0B0B3B] opacity-20 mb-4">
                                            {item.step}
                                        </div>
                                        <h3 className="text-xl font-bold text-[#0B0B3B] mb-3">{item.title}</h3>
                                        <p className="text-gray-700 leading-relaxed">{item.desc}</p>
                                    </div>
                                    {idx < admissionSteps.length - 1 && (
                                        <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-6 bg-[#FACC15] rounded-full transform -translate-y-1/2 z-10">
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xs">→</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Important Dates */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-r from-[#FF4040] to-[#c03030] rounded-3xl p-10 shadow-2xl text-white">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-white rounded-2xl">
                                    <CalendarDays className="w-8 h-8 text-[#FF4040]" />
                                </div>
                                <h2 className="text-3xl font-bold">Important Dates</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white/10 rounded-2xl p-6">
                                    <div className="text-[#FACC15] font-bold mb-2">Application Start Date</div>
                                    <div className="text-2xl font-bold">1st May 2024</div>
                                </div>
                                <div className="bg-white/10 rounded-2xl p-6">
                                    <div className="text-[#FACC15] font-bold mb-2">Application Last Date</div>
                                    <div className="text-2xl font-bold">30th June 2024</div>
                                </div>
                                <div className="bg-white/10 rounded-2xl p-6">
                                    <div className="text-[#FACC15] font-bold mb-2">Entrance Exam Date</div>
                                    <div className="text-2xl font-bold">15th July 2024</div>
                                </div>
                                <div className="bg-white/10 rounded-2xl p-6">
                                    <div className="text-[#FACC15] font-bold mb-2">Merit List Declaration</div>
                                    <div className="text-2xl font-bold">25th July 2024</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Scholarships */}
            <section className="py-20 bg-gradient-to-b from-[#FDFDFF] to-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">
                                Scholarship Information
                            </h2>
                            <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full mb-6"></div>
                            <p className="text-gray-600 text-lg">
                                Financial assistance for deserving students
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {scholarships.map((scholarship, idx) => (
                                <div key={idx} className="bg-white rounded-3xl p-8 shadow-xl border-2 border-[#BFD8FF] hover:shadow-2xl transition-shadow">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="text-5xl">{scholarship.icon}</div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-[#0B0B3B] mb-2">{scholarship.name}</h3>
                                            <div className="space-y-2">
                                                <div className="flex items-start gap-2">
                                                    <span className="text-[#FF4040] font-bold">Eligibility:</span>
                                                    <span className="text-gray-700">{scholarship.eligibility}</span>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <span className="text-[#0B0B3B] font-bold">Amount:</span>
                                                    <span className="text-gray-700">{scholarship.amount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-full mt-4 py-3 bg-gradient-to-r from-[#0B0B3B] to-[#1a1a5e] text-white rounded-xl font-bold hover:shadow-lg transition-shadow">
                                        Apply Now
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Government Scholarship Info */}
                        <div className="mt-12 bg-gradient-to-r from-[#BFD8FF] to-[#E5E7EB] rounded-3xl p-10 shadow-lg">
                            <h3 className="text-2xl font-bold text-[#0B0B3B] mb-6 text-center">
                                Government Scholarship Programs
                            </h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                {[
                                    { name: 'SC/ST Scholarship', provider: 'State Government' },
                                    { name: 'OBC Scholarship', provider: 'State Government' },
                                    { name: 'Minority Scholarship', provider: 'Central Government' }
                                ].map((scheme, idx) => (
                                    <div key={idx} className="bg-white rounded-2xl p-6 text-center">
                                        <DollarSign className="w-10 h-10 text-[#0B0B3B] mx-auto mb-3" />
                                        <div className="font-bold text-[#0B0B3B] mb-1">{scheme.name}</div>
                                        <div className="text-sm text-gray-600">{scheme.provider}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
