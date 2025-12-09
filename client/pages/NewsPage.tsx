import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Newspaper, Calendar, Megaphone } from 'lucide-react';

export default function NewsPage() {
    const studyNews = [
        {
            title: 'New Study Resources Added to Digital Library',
            date: '5th Dec 2024',
            category: 'Study Resources',
            desc: 'We have added 500+ new e-books and research papers to our digital library covering all major subjects.',
            image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop'
        },
        {
            title: 'Online Course on Data Science Launched',
            date: '1st Dec 2024',
            category: 'Courses',
            desc: 'Free online certification course on Data Science and Machine Learning now available for all students.',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop'
        },
        {
            title: 'Study Groups Formation for Final Year Students',
            date: '28th Nov 2024',
            category: 'Study Support',
            desc: 'Special peer study groups being formed to help final year students prepare for competitive exams.',
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=250&fit=crop'
        }
    ];

    const announcements = [
        {
            title: 'Mid-Semester Break Announced',
            date: '8th Dec 2024',
            type: 'Important',
            desc: 'Mid-semester break scheduled from 20th Dec to 27th Dec 2024. Classes will resume from 28th Dec.'
        },
        {
            title: 'Guest Lecture by Industry Expert',
            date: '6th Dec 2024',
            type: 'Event',
            desc: 'Special guest lecture on "Future of AI" by Dr. Rajesh Kumar from IIT Delhi on 15th December.'
        },
        {
            title: 'Library Timings Extended',
            date: '3rd Dec 2024',
            type: 'Update',
            desc: 'Library will remain open till 10 PM from Monday to Saturday during examination period.'
        }
    ];

    const events = [
        {
            title: 'Annual Tech Fest 2024',
            date: '15th Jan 2024',
            venue: 'Main Campus',
            status: 'Upcoming'
        },
        {
            title: 'Career Guidance Workshop',
            date: '20th Dec 2024',
            venue: 'Auditorium',
            status: 'Upcoming'
        },
        {
            title: 'Sports Tournament',
            date: '10th Dec 2024',
            venue: 'Sports Complex',
            status: 'Ongoing'
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
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">News & Updates</h1>
                        <p className="text-lg md:text-xl text-blue-200 leading-relaxed">
                            Stay Informed With Latest Academic News, Announcements, And Campus Events
                        </p>
                    </div>
                </div>
            </section>

            {/* Study-related News */}
            <section className="py-20 bg-[#FDFDFF]">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">
                                Study-Related News
                            </h2>
                            <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full mb-6"></div>
                            <p className="text-gray-600 text-lg">
                                Latest updates on study resources and academic programs
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {studyNews.map((news, idx) => (
                                <div key={idx} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                                    <img src={news.image} alt={news.title} className="w-full h-48 object-cover" />
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="px-4 py-1 bg-[#BFD8FF] text-[#0B0B3B] rounded-full text-sm font-bold">
                                                {news.category}
                                            </span>
                                            <span className="text-sm text-gray-500">{news.date}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-[#0B0B3B] mb-3">{news.title}</h3>
                                        <p className="text-gray-600 leading-relaxed mb-4">{news.desc}</p>
                                        <button className="text-[#0B0B3B] font-bold hover:text-[#FF4040] transition-colors">
                                            Read More →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Academic Announcements */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">
                                Academic Announcements
                            </h2>
                            <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full mb-6"></div>
                            <p className="text-gray-600 text-lg">
                                Important notifications for all students
                            </p>
                        </div>

                        <div className="space-y-6">
                            {announcements.map((announcement, idx) => (
                                <div key={idx} className="bg-gradient-to-r from-[#BFD8FF] to-[#E5E7EB] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                                    <div className="flex items-start gap-6">
                                        <div className="p-4 bg-white rounded-2xl">
                                            <Megaphone className="w-8 h-8 text-[#0B0B3B]" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                                                <h3 className="text-2xl font-bold text-[#0B0B3B]">{announcement.title}</h3>
                                                <span className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${announcement.type === 'Important' ? 'bg-[#FF4040] text-white' :
                                                        announcement.type === 'Event' ? 'bg-[#FACC15] text-[#0B0B3B]' :
                                                            'bg-[#0B0B3B] text-white'
                                                    }`}>
                                                    {announcement.type}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 mb-3 leading-relaxed">{announcement.desc}</p>
                                            <p className="text-[#0B0B3B] font-semibold flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                {announcement.date}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Events & Notices */}
            <section className="py-20 bg-gradient-to-b from-[#FDFDFF] to-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">
                                Upcoming Events & Notices
                            </h2>
                            <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full mb-6"></div>
                            <p className="text-gray-600 text-lg">
                                Mark your calendar for these important events
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {events.map((event, idx) => (
                                <div key={idx} className="bg-white rounded-3xl p-8 shadow-xl border-2 border-[#BFD8FF] hover:shadow-2xl transition-shadow">
                                    <div className="text-center">
                                        <div className="p-4 bg-gradient-to-br from-[#BFD8FF] to-[#E5E7EB] rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                            <Calendar className="w-8 h-8 text-[#0B0B3B]" />
                                        </div>
                                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-4 ${event.status === 'Upcoming' ? 'bg-green-100 text-green-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {event.status}
                                        </span>
                                        <h3 className="text-xl font-bold text-[#0B0B3B] mb-3">{event.title}</h3>
                                        <p className="text-gray-600 mb-2">{event.date}</p>
                                        <p className="text-sm text-gray-500">📍 {event.venue}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Newsletter Signup */}
                        <div className="mt-16 bg-gradient-to-r from-[#0B0B3B] to-[#1a1a5e] rounded-3xl p-10 shadow-2xl text-white">
                            <div className="max-w-3xl mx-auto text-center">
                                <Newspaper className="w-16 h-16 mx-auto mb-6" />
                                <h3 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h3>
                                <p className="text-blue-200 mb-8">
                                    Get the latest news and updates delivered directly to your inbox
                                </p>
                                <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        className="flex-1 px-6 py-4 rounded-xl text-gray-800 font-medium focus:outline-none focus:ring-4 focus:ring-[#BFD8FF]"
                                    />
                                    <button className="px-8 py-4 bg-[#FF4040] text-white rounded-xl font-bold hover:bg-[#c03030] transition-colors whitespace-nowrap">
                                        Subscribe Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
