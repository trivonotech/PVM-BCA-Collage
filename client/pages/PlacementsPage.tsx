import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Briefcase, Building2, Award, User, TrendingUp } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { useSectionVisibility } from '@/hooks/useSectionVisibility';

interface Placement {
    id: string;
    studentName: string;
    company: string;
    package: string;
    course: string;
    type: 'Success Story' | 'Top Student' | 'Regular';
    image?: string;
    quote?: string;
}

interface PlacementStats {
    averagePackage: string;
    highestPackage: string;
    companiesVisited: string;
    studentsPlaced: string;
}

export default function PlacementsPage() {
    const { isVisible } = useSectionVisibility();
    const [placements, setPlacements] = useState<Placement[]>(() => {
        const cached = localStorage.getItem('cache_placement_data');
        return cached ? JSON.parse(cached) : [];
    });
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState<PlacementStats>(() => {
        const cached = localStorage.getItem('cache_placement_stats');
        return cached ? JSON.parse(cached) : {
            averagePackage: '4.5 LPA',
            highestPackage: '0 LPA',
            companiesVisited: '0+',
            studentsPlaced: '95%'
        };
    });
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'placements'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Placement[];
            setPlacements(data);
            localStorage.setItem('cache_placement_data', JSON.stringify(data));
            setLoading(false);
        }, (error) => {
            console.error("Error fetching placements:", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Fetch Manual Stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const docRef = doc(db, 'settings', 'placementStats');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data() as PlacementStats;
                    setStats(data);
                    localStorage.setItem('cache_placement_stats', JSON.stringify(data));
                }
                setStatsLoading(false);
            } catch (error) {
                console.error("Error fetching stats:", error);
                setStatsLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Memoized Derived Data
    const topStudents = useMemo(() => placements.filter(p => p.type === 'Top Student').slice(0, 4), [placements]);
    const successStories = useMemo(() => placements.filter(p => p.type === 'Success Story'), [placements]);
    const recruiters = useMemo(() => [...new Set(placements.map(p => p.company))].sort(), [placements]);

    // Memoized Stats Calculations
    const displayHighest = useMemo(() => {
        if (stats.highestPackage !== '0 LPA' && stats.highestPackage !== '') return stats.highestPackage;

        const highestValue = placements.length > 0
            ? Math.max(...placements.map(p => {
                if (!p.package) return 0;
                const val = parseFloat(p.package.replace(/[^0-9.]/g, ''));
                return isNaN(val) ? 0 : val;
            }))
            : 0;

        return highestValue > 0 ? highestValue + ' LPA' : '0 LPA';
    }, [stats.highestPackage, placements]);

    const displayCompanies = useMemo(() =>
        (stats.companiesVisited !== '0+' && stats.companiesVisited !== '')
            ? stats.companiesVisited
            : `${recruiters.length}+`
        , [stats.companiesVisited, recruiters.length]);

    const placementStats = useMemo(() => [
        { label: 'Average Package', value: stats.averagePackage, icon: TrendingUp },
        { label: 'Highest Package', value: displayHighest, icon: Award },
        { label: 'Companies Visited', value: displayCompanies, icon: Building2 },
        { label: 'Students Placed', value: stats.studentsPlaced, icon: User }
    ], [stats, displayHighest, displayCompanies]);

    return (
        <div className="min-h-screen bg-white font-poppins">
            <Header />

            {isVisible('placementHero') && (
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
            )}

            {isVisible('placementRecords') && (
                <section className="py-20 bg-[#FDFDFF]">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">
                                    Placement Records 2023-24
                                </h2>
                                <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full"></div>
                            </div>

                            {statsLoading && stats.highestPackage === '0 LPA' && placements.length === 0 ? (
                                <div className="grid md:grid-cols-4 gap-6">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-3xl"></div>
                                    ))}
                                </div>
                            ) : (
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
                            )}
                        </div>
                    </div>
                </section>
            )}

            {isVisible('recruitingPartners') && (
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

                            {loading && recruiters.length === 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-2xl"></div>
                                    ))}
                                </div>
                            ) : recruiters.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                    {recruiters.map((company, idx) => (
                                        <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-100 flex items-center justify-center">
                                            <div className="text-center w-full">
                                                <div className="w-16 h-16 bg-gradient-to-br from-[#BFD8FF] to-[#E5E7EB] rounded-xl flex items-center justify-center mx-auto mb-2">
                                                    <Building2 className="w-8 h-8 text-[#0B0B3B]" />
                                                </div>
                                                <div className="font-bold text-sm text-[#0B0B3B] truncate">{company}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500">No recruiting partners added yet.</p>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {isVisible('placementSuccessStories') && (
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

                            {loading && successStories.length === 0 ? (
                                <div className="grid md:grid-cols-3 gap-8">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-3xl"></div>
                                    ))}
                                </div>
                            ) : successStories.length > 0 ? (
                                <div className="grid md:grid-cols-3 gap-8">
                                    {successStories.map((story, idx) => (
                                        <div key={idx} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
                                            <div className="h-2 bg-gradient-to-r from-[#0B0B3B] via-[#FF4040] to-[#FACC15]"></div>
                                            <div className="p-8 flex-1 flex flex-col">
                                                {story.image ? (
                                                    <img src={story.image} alt={story.studentName} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-[#BFD8FF]" />
                                                ) : (
                                                    <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center text-gray-400">
                                                        <User className="w-12 h-12" />
                                                    </div>
                                                )}
                                                <h3 className="text-xl font-bold text-[#0B0B3B] text-center mb-1">{story.studentName}</h3>
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
                                                <p className="text-gray-700 text-sm italic leading-relaxed text-center mt-auto">"{story.quote}"</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                                    <p className="text-gray-500">No success stories shared yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {isVisible('topPlacementProfiles') && (
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

                            {loading && topStudents.length === 0 ? (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {[1, 2].map(i => (
                                        <div key={i} className="h-32 bg-white/10 animate-pulse rounded-2xl"></div>
                                    ))}
                                </div>
                            ) : topStudents.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {topStudents.map((student, idx) => (
                                        <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-colors">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-[#FACC15] rounded-full flex items-center justify-center text-3xl font-bold text-[#0B0B3B] flex-shrink-0">
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-2xl font-bold text-white mb-1">{student.studentName}</h3>
                                                    <p className="text-blue-200 mb-2">{student.course}</p>
                                                    <div className="flex items-center gap-4 flex-wrap">
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
                            ) : (
                                <div className="text-center text-blue-200">
                                    <p>Top student profiles coming soon.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </div>
    );
}
