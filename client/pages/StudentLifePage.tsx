import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Trophy, Lightbulb, Image as ImageIcon, X, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import type { Event } from '@/../../shared/types';
import { useSectionVisibility } from '@/hooks/useSectionVisibility';
import { getEventStatus } from "@/lib/utils";

export default function StudentLifePage() {
    const { isVisible } = useSectionVisibility();
    const [selectedImage, setSelectedImage] = useState<Event | null>(null);
    const [events, setEvents] = useState<Event[]>(() => {
        const cached = localStorage.getItem('cache_sl_events');
        return cached ? JSON.parse(cached) : [];
    });
    const [workshops, setWorkshops] = useState<any[]>(() => {
        const cached = localStorage.getItem('cache_sl_workshops');
        return cached ? JSON.parse(cached) : [];
    });
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<string[]>(() => {
        const cached = localStorage.getItem('cache_sl_categories');
        return cached ? JSON.parse(cached) : ['All'];
    });
    const [selectedCategory, setSelectedCategory] = useState('All');

    const [workshopsLoading, setWorkshopsLoading] = useState(true);

    // Fetch Workshops
    useEffect(() => {
        const q = query(collection(db, 'workshops'), orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setWorkshops(data);
            localStorage.setItem('cache_sl_workshops', JSON.stringify(data));
            setWorkshopsLoading(false);
        }, (err) => {
            console.error(err);
            setWorkshopsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Fetch Events
    useEffect(() => {
        const q = query(collection(db, 'events'), orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const eventsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Event[];
            setEvents(eventsData);
            localStorage.setItem('cache_sl_events', JSON.stringify(eventsData));
            setLoading(false);
        }, (error) => {
            console.error("Error fetching events:", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Fetch Categories
    useEffect(() => {
        const q = query(collection(db, 'event_categories'), orderBy('name'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const cats = snapshot.docs.map(doc => doc.data().name as string);
            if (cats.length > 0) {
                const updatedCats = ['All', ...cats];
                setCategories(updatedCats);
                localStorage.setItem('cache_sl_categories', JSON.stringify(updatedCats));
            }
        });
        return () => unsubscribe();
    }, []);

    // Lock Scroll
    useEffect(() => {
        if (selectedImage) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedImage]);

    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            if (!event || !event.category) return false;
            // Explicitly exclude categories containing "Workshop" (case-insensitive)
            if (String(event.category).toLowerCase().includes('workshop')) return false;

            if (selectedCategory === 'All') return true;
            return String(event.category).trim().toLowerCase() === String(selectedCategory).trim().toLowerCase();
        });
    }, [events, selectedCategory]);

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectedImage) return;
        const currentIndex = filteredEvents.findIndex(ev => ev.id === selectedImage.id);
        if (currentIndex === -1) return;
        const nextIndex = (currentIndex + 1) % filteredEvents.length;
        setSelectedImage(filteredEvents[nextIndex]);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectedImage) return;
        const currentIndex = filteredEvents.findIndex(ev => ev.id === selectedImage.id);
        if (currentIndex === -1) return;
        const prevIndex = (currentIndex - 1 + filteredEvents.length) % filteredEvents.length;
        setSelectedImage(filteredEvents[prevIndex]);
    };

    const sports = useMemo(() => [
        { name: 'Cricket', facilities: 'Professional Ground', icon: '🏏' },
        { name: 'Basketball', facilities: 'Indoor Court', icon: '🏀' },
        { name: 'Volleyball', facilities: 'Outdoor Court', icon: '🏐' },
        { name: 'Table Tennis', facilities: 'Indoor Tables', icon: '🏓' },
        { name: 'Badminton', facilities: 'Indoor Court', icon: '🏸' },
        { name: 'Athletics', facilities: 'Running Track', icon: '🏃' }
    ], []);


    return (
        <div className="min-h-screen bg-white font-poppins">
            <Header />

            {/* Hero Section */}
            {isVisible('studentLifeHero') && (
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
            )}

            {/* Festivals & Cultural Events */}
            {isVisible('festivalsEvents') && (
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

                            {/* Category Filter */}
                            <div className="flex flex-wrap justify-center gap-3 mb-12">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${selectedCategory === category
                                            ? 'bg-[#0B0B3B] text-white shadow-lg scale-105'
                                            : 'bg-white text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {loading && events.length === 0 ? (
                                    <>
                                        {[1, 2, 3, 4, 5, 6].map((i) => (
                                            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-3xl"></div>
                                        ))}
                                    </>
                                ) : filteredEvents.length === 0 ? (
                                    <div className="col-span-3 text-center py-12 bg-gray-50 rounded-3xl">
                                        <p className="text-gray-500 text-lg">No events found in this category.</p>
                                    </div>
                                ) : (
                                    filteredEvents.map((event, idx) => (
                                        <div key={idx} className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                                            onClick={() => setSelectedImage(event)}>
                                            <img src={event.image} alt={event.name} className="w-full h-64 object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-6">
                                                <div className="text-[#FACC15] text-sm font-bold mb-1">{event.category}</div>
                                                <h3 className="text-white text-xl font-bold mb-0.5">{event.name}</h3>
                                                <p className="text-blue-200 text-sm">{event.date}</p>
                                            </div>
                                            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ImageIcon className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Sports Activities */}
            {isVisible('sportsActivities') && (
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
            )}

            {/* Workshops & Seminars */}
            {isVisible('workshopsSeminars') && (
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
                                {workshopsLoading && workshops.length === 0 ? (
                                    <>
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-2xl"></div>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {workshops.map((workshop) => {
                                            const status = getEventStatus(workshop.date);
                                            return (
                                                <div key={workshop.id} className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#BFD8FF] hover:shadow-xl transition-shadow">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                        <div className="flex items-start gap-6">
                                                            <div className="p-4 bg-gradient-to-br from-[#BFD8FF] to-[#E5E7EB] rounded-2xl overflow-hidden w-24 h-24 flex items-center justify-center shrink-0">
                                                                {workshop.image ? (
                                                                    <img src={workshop.image} alt={workshop.title} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <Lightbulb className="w-8 h-8 text-[#0B0B3B]" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h3 className="text-2xl font-bold text-[#0B0B3B] mb-2">{workshop.title}</h3>
                                                                <p className="text-gray-600 mb-1">Speaker: <span className="font-semibold">{workshop.speaker}</span></p>
                                                                <p className="text-[#FF4040] font-bold">{workshop.date}</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className={`px-6 py-3 rounded-full font-bold whitespace-nowrap ${status === 'Upcoming' ? 'bg-[#FACC15] text-[#0B0B3B]' : 'bg-gray-200 text-gray-600'}`}>
                                                                {status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {workshops.length === 0 && (
                                            <div className="text-center py-10 bg-gray-50 rounded-2xl">
                                                <p className="text-gray-500">No workshops scheduled at the moment.</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Premium Lightbox Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300"
                    onClick={() => setSelectedImage(null)}>

                    {/* Top Controls */}
                    <div className="absolute top-6 right-6 flex items-center gap-4 z-[220]">
                        <a
                            href={selectedImage.image}
                            download={`${selectedImage.name}.png`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full backdrop-blur-md transition-all group border border-white/10"
                        >
                            <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="font-medium text-sm">Download</span>
                        </a>
                        <button
                            className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full backdrop-blur-md transition-all group border border-white/10"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                        </button>
                    </div>

                    {/* Navigation Buttons */}
                    {filteredEvents.length > 1 && (
                        <>
                            <button
                                onClick={handlePrev}
                                className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-[220] p-4 rounded-full bg-black/20 hover:bg-black/60 text-white/70 hover:text-white backdrop-blur-md border border-white/5 transition-all hover:scale-110 group outline-none"
                            >
                                <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-[220] p-4 rounded-full bg-black/20 hover:bg-black/60 text-white/70 hover:text-white backdrop-blur-md border border-white/5 transition-all hover:scale-110 group outline-none"
                            >
                                <ChevronRight className="w-8 h-8 md:w-10 md:h-10 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </>
                    )}

                    {/* Main Image Container */}
                    <div
                        className="relative w-full h-full flex flex-col items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            key={selectedImage.id}
                            src={selectedImage.image}
                            alt={selectedImage.name}
                            className="max-h-[85vh] md:max-h-[90vh] max-w-full object-contain shadow-2xl animate-in zoom-in-95 duration-500 rounded-sm"
                        />
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
