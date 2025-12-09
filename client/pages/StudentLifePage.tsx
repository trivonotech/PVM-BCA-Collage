import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PartyPopper, Trophy, Users, Lightbulb, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

export default function StudentLifePage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const events = [
        { name: 'Annual Fest 2024', date: 'March 2024', category: 'Cultural', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop' },
        { name: 'Sports Day', date: 'February 2024', category: 'Sports', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop' },
        { name: 'Tech Workshop', date: 'January 2024', category: 'Workshop', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop' },
        { name: 'Cultural Night', date: 'December 2023', category: 'Cultural', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop' },
        { name: 'Debate Competition', date: 'November 2023', category: 'Competition', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop' },
        { name: 'Independence Day', date: 'August 2023', category: 'Festival', image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&h=300&fit=crop' }
    ];

    const sports = [
        { name: 'Cricket', facilities: 'Professional Ground', icon: '🏏' },
        { name: 'Basketball', facilities: 'Indoor Court', icon: '🏀' },
        { name: 'Volleyball', facilities: 'Outdoor Court', icon: '🏐' },
        { name: 'Table Tennis', facilities: 'Indoor Tables', icon: '🏓' },
        { name: 'Badminton', facilities: 'Indoor Court', icon: '🏸' },
        { name: 'Athletics', facilities: 'Running Track', icon: '🏃' }
    ];

    const workshops = [
        { title: 'AI & Machine Learning Workshop', date: '15th Jan 2024', speaker: 'Dr. Amit Sharma', status: 'Upcoming' },
        { title: 'Digital Marketing Seminar', date: '22nd Jan 2024', speaker: 'Ms. Priya Verma', status: 'Upcoming' },
        { title: 'Leadership Development Program', date: '28th Jan 2024', speaker: 'Mr. Rajesh Kumar', status: 'Upcoming' }
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
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Student Life & Activities</h1>
                        <p className="text-lg md:text-xl text-blue-200 leading-relaxed">
                            Experience Vibrant Campus Life With Cultural Events, Sports, And Learning Opportunities
                        </p>
                    </div>
                </div>
            </section>

            {/* Festivals & Cultural Events */}
            <section className="py-20 bg-[#FDFDFF]">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">
                                Festivals & Cultural Events
                            </h2>
                            <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full mb-6"></div>
                            <p className="text-gray-600 text-lg">
                                Celebrating diversity and creativity throughout the year
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {events.map((event, idx) => (
                                <div key={idx} className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                                    onClick={() => setSelectedImage(event.image)}>
                                    <img src={event.image} alt={event.name} className="w-full h-64 object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-6">
                                        <div className="text-[#FACC15] text-sm font-bold mb-2">{event.category}</div>
                                        <h3 className="text-white text-xl font-bold mb-1">{event.name}</h3>
                                        <p className="text-blue-200 text-sm">{event.date}</p>
                                    </div>
                                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ImageIcon className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Sports Activities */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">
                                Sports Activities
                            </h2>
                            <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full mb-6"></div>
                            <p className="text-gray-600 text-lg">
                                State-of-the-art sports facilities for holistic development
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {sports.map((sport, idx) => (
                                <div key={idx} className="bg-gradient-to-br from-[#BFD8FF] to-[#E5E7EB] rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                    <div className="text-6xl text-center mb-4">{sport.icon}</div>
                                    <h3 className="text-2xl font-bold text-[#0B0B3B] text-center mb-2">{sport.name}</h3>
                                    <p className="text-gray-700 text-center">{sport.facilities}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 bg-gradient-to-r from-[#FF4040] to-[#c03030] rounded-3xl p-10 shadow-2xl text-white text-center">
                            <Trophy className="w-16 h-16 mx-auto mb-6" />
                            <h3 className="text-3xl font-bold mb-4">Sports Achievements</h3>
                            <p className="text-lg mb-6">Our students have won multiple state and national level championships</p>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-white/20 rounded-2xl p-6">
                                    <div className="text-4xl font-bold mb-2">15+</div>
                                    <div>State Championships</div>
                                </div>
                                <div className="bg-white/20 rounded-2xl p-6">
                                    <div className="text-4xl font-bold mb-2">5+</div>
                                    <div>National Medals</div>
                                </div>
                                <div className="bg-white/20 rounded-2xl p-6">
                                    <div className="text-4xl font-bold mb-2">200+</div>
                                    <div>Active Players</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Workshops & Seminars */}
            <section className="py-20 bg-gradient-to-b from-[#FDFDFF] to-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">
                                Workshops & Seminars
                            </h2>
                            <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full mb-6"></div>
                            <p className="text-gray-600 text-lg">
                                Industry experts sharing knowledge and insights
                            </p>
                        </div>

                        <div className="space-y-6">
                            {workshops.map((workshop, idx) => (
                                <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#BFD8FF] hover:shadow-xl transition-shadow">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-start gap-6">
                                            <div className="p-4 bg-gradient-to-br from-[#BFD8FF] to-[#E5E7EB] rounded-2xl">
                                                <Lightbulb className="w-8 h-8 text-[#0B0B3B]" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-[#0B0B3B] mb-2">{workshop.title}</h3>
                                                <p className="text-gray-600 mb-1">Speaker: <span className="font-semibold">{workshop.speaker}</span></p>
                                                <p className="text-[#FF4040] font-bold">{workshop.date}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="px-6 py-3 bg-[#FACC15] text-[#0B0B3B] rounded-full font-bold whitespace-nowrap">
                                                {workshop.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}>
                    <button className="absolute top-4 right-4 text-white text-4xl font-bold hover:text-gray-300"
                        onClick={() => setSelectedImage(null)}>
                        ×
                    </button>
                    <img src={selectedImage} alt="Full view" className="max-w-full max-h-full object-contain rounded-2xl" />
                </div>
            )}

            <Footer />
        </div>
    );
}
