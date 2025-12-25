import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Newspaper, Calendar, Megaphone, PlusCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useSectionVisibility } from '@/hooks/useSectionVisibility';
import { useToast } from "@/components/ui/use-toast";

interface NewsArticle {
    id: string;
    title: string;
    content: string;
    category: string;
    imageUrl?: string;
    submittedBy: {
        name: string;
        email: string;
        rollNumber?: string;
        role?: 'student' | 'staff';
        department?: string;
        designation?: string;
    };
    status: string;
    submittedAt: any;
}

export default function NewsPage() {
    const { isVisible } = useSectionVisibility();
    const { toast } = useToast();
    const [approvedNews, setApprovedNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [subscriberEmail, setSubscriberEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subscriberEmail.trim() || submitting) return;

        setSubmitting(true);
        try {
            // Check if already subscribed
            const q = query(collection(db, 'subscribers'), where('email', '==', subscriberEmail.trim().toLowerCase()));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                toast({
                    title: "Already Subscribed",
                    description: "This email is already on our list!",
                    variant: "default",
                });
                setSubscriberEmail('');
                setSubmitting(false);
                return;
            }

            // Add to subscribers
            await addDoc(collection(db, 'subscribers'), {
                email: subscriberEmail.trim().toLowerCase(),
                subscribedAt: serverTimestamp(),
                status: 'active'
            });

            toast({
                title: "Success!",
                description: "You've successfully subscribed to our newsletter.",
            });
            setSubscriberEmail('');
        } catch (error) {
            console.error('Subscription error:', error);
            toast({
                title: "Error",
                description: "Something went wrong. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    // Fetch only approved news from Firestore
    useEffect(() => {
        const q = query(
            collection(db, 'news'),
            where('status', '==', 'approved')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as NewsArticle[];
            setApprovedNews(newsData);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching approved news:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Legacy static data for announcements and events (keep as-is)
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
            {isVisible('newsHero') && (
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
                            <p className="text-lg md:text-xl text-blue-200 leading-relaxed mb-8">
                                Stay Informed With Latest Academic News, Announcements, And Campus Events
                            </p>
                            <Link
                                to="/submit-news"
                                className="inline-flex items-center gap-2 bg-[#FF4040] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#c03030] transition-all shadow-lg hover:shadow-xl"
                            >
                                <PlusCircle className="w-5 h-5" />
                                Submit Your News
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Study-related News (Dynamic from Firebase) */}
            {/* Study-related News (Dynamic from Firebase) */}
            {isVisible('latestNews') && (
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

                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="text-gray-600 mt-4">Loading news...</p>
                                </div>
                            ) : approvedNews.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-3xl">
                                    <p className="text-gray-500 text-lg mb-4">No news articles yet</p>
                                    <Link
                                        to="/submit-news"
                                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                                    >
                                        <PlusCircle className="w-5 h-5" />
                                        Be the first to submit news!
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-3 gap-8">
                                    {approvedNews.map((news) => (
                                        <div key={news.id} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                                            {news.imageUrl && (
                                                <img src={news.imageUrl} alt={news.title} className="w-full h-48 object-cover" />
                                            )}
                                            {!news.imageUrl && (
                                                <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                                    <Newspaper className="w-16 h-16 text-blue-600 opacity-50" />
                                                </div>
                                            )}
                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="px-4 py-1 bg-[#BFD8FF] text-[#0B0B3B] rounded-full text-sm font-bold">
                                                        {news.category}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {news.submittedAt?.toDate().toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold text-[#0B0B3B] mb-3">{news.title}</h3>
                                                <div className="text-sm text-gray-500 mb-4">
                                                    <p>By: {news.submittedBy.name}</p>
                                                </div>
                                                <Link
                                                    to={`/news/${news.id}`}
                                                    className="text-[#0B0B3B] font-bold hover:text-[#FF4040] transition-colors"
                                                >
                                                    Read More →
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

            {/* Academic Announcements */}
            {/* Academic Announcements */}
            {isVisible('pressReleases') && (
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
            )}

            {/* Events & Notices */}
            {/* Events & Notices */}
            {isVisible('upcomingEvents') && (
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
                                    <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
                                        <input
                                            type="email"
                                            required
                                            value={subscriberEmail}
                                            onChange={(e) => setSubscriberEmail(e.target.value)}
                                            placeholder="Enter your email address"
                                            className="flex-1 px-6 py-4 rounded-xl text-gray-800 font-medium focus:outline-none focus:ring-4 focus:ring-[#BFD8FF]"
                                        />
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="px-8 py-4 bg-[#FF4040] text-white rounded-xl font-bold hover:bg-[#c03030] transition-colors whitespace-nowrap disabled:opacity-50"
                                        >
                                            {submitting ? 'Subscribing...' : 'Subscribe Now'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </div>
    );
}
