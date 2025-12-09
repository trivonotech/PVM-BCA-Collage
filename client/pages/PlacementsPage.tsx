import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Briefcase, Building2, Award, User, TrendingUp } from 'lucide-react';

export default function PlacementsPage() {
    const placementStats = [
        { label: 'Average Package', value: '₹4.5 LPA', icon: TrendingUp },
        { label: 'Highest Package', value: '₹12 LPA', icon: Award },
        { label: 'Companies Visited', value: '50+', icon: Building2 },
        { label: 'Students Placed', value: '95%', icon: User }
    ];

    const recruiters = [
        'TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'IBM',
        'Amazon', 'Flipkart', 'HDFC Bank', 'ICICI Bank', 'Deloitte', 'EY'
    ];

    const successStories = [
        {
            name: 'Rahul Sharma',
            course: 'BBA 2023',
            company: 'Amazon',
            package: '₹10 LPA',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
            quote: 'The placement cell provided excellent training and guidance that helped me crack Amazon interview.'
        },
        {
            name: 'Priya Verma',
            course: 'BCA 2023',
            company: 'Infosys',
            package: '₹6.5 LPA',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
            quote: 'Mock interviews and technical training sessions were incredibly helpful in my placement journey.'
        },
        {
            name: 'Amit Kumar',
            course: 'B.Com 2023',
            company: 'Deloitte',
            package: '₹8 LPA',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
            quote: 'The industry exposure and soft skills training gave me the confidence to succeed in placements.'
        }
    ];

    const topStudents = [
        { name: 'Sneha Patel', company: 'TCS', package: '₹12 LPA', course: 'BCA' },
        { name: 'Arjun Singh', company: 'Wipro', package: '₹9 LPA', course: 'BBA' },
        { name: 'Neha Gupta', company: 'Cognizant', package: '₹8.5 LPA', course: 'B.Com' },
        { name: 'Vikram Rao', company: 'Accenture', package: '₹7.5 LPA', course: 'BCA' }
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
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Placements & Achievements</h1>
                        <p className="text-lg md:text-xl text-blue-200 leading-relaxed">
                            Empowering Students To Achieve Their Career Goals With Top Industry Placements
                        </p>
                    </div>
                </div>
            </section>

            {/* Placement Records */}
            <section className="py-20 bg-[#FDFDFF]">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">
                                Placement Records 2023-24
                            </h2>
                            <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full"></div>
                        </div>

                        <div className="grid md:grid-cols-4 gap-6">
                            {placementStats.map((stat, idx) => (
                                <div key={idx} className="bg-gradient-to-br from-[#BFD8FF] to-[#E5E7EB] rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
                                    <div className="p-4 bg-white rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <stat.icon className="w-8 h-8 text-[#0B0B3B]" />
                                    </div>
                                    <div className="text-4xl font-bold text-[#0B0B3B] mb-2">{stat.value}</div>
                                    <div className="text-gray-700 font-semibold">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Recruiting Partners */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">
                                Our Recruiting Partners
                            </h2>
                            <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full mb-6"></div>
                            <p className="text-gray-600 text-lg">
                                Top companies trust our students for their talent and skills
                            </p>
                        </div>

                        <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                            {recruiters.map((company, idx) => (
                                <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-100 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-[#BFD8FF] to-[#E5E7EB] rounded-xl flex items-center justify-center mx-auto mb-2">
                                            <Building2 className="w-8 h-8 text-[#0B0B3B]" />
                                        </div>
                                        <div className="font-bold text-sm text-[#0B0B3B]">{company}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Success Stories */}
            <section className="py-20 bg-gradient-to-b from-[#FDFDFF] to-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">
                                Student Success Stories
                            </h2>
                            <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full mb-6"></div>
                            <p className="text-gray-600 text-lg">
                                Hear from our successful alumni about their placement journey
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {successStories.map((story, idx) => (
                                <div key={idx} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                                    <div className="h-2 bg-gradient-to-r from-[#0B0B3B] via-[#FF4040] to-[#FACC15]"></div>
                                    <div className="p-8">
                                        <img src={story.image} alt={story.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-[#BFD8FF]" />
                                        <h3 className="text-xl font-bold text-[#0B0B3B] text-center mb-1">{story.name}</h3>
                                        <p className="text-sm text-gray-600 text-center mb-4">{story.course}</p>
                                        <div className="bg-gradient-to-r from-[#BFD8FF] to-[#E5E7EB] rounded-2xl p-4 mb-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <div className="text-xs text-gray-600 mb-1">Placed at</div>
                                                    <div className="font-bold text-[#0B0B3B]">{story.company}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs text-gray-600 mb-1">Package</div>
                                                    <div className="font-bold text-[#FF4040]">{story.package}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 text-sm italic leading-relaxed">"{story.quote}"</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Top Students */}
            <section className="py-20 bg-gradient-to-r from-[#0B0B3B] to-[#1a1a5e]">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                                Top Student Profiles 2023-24
                            </h2>
                            <div className="w-24 h-1 bg-[#FACC15] mx-auto rounded-full mb-6"></div>
                            <p className="text-blue-200 text-lg">
                                Celebrating our highest achievers
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {topStudents.map((student, idx) => (
                                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-colors">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-[#FACC15] rounded-full flex items-center justify-center text-3xl font-bold text-[#0B0B3B]">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-white mb-1">{student.name}</h3>
                                            <p className="text-blue-200 mb-2">{student.course}</p>
                                            <div className="flex items-center gap-4">
                                                <span className="px-4 py-1 bg-white/20 rounded-full text-sm font-bold text-white">
                                                    {student.company}
                                                </span>
                                                <span className="text-[#FACC15] font-bold">
                                                    {student.package}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
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
