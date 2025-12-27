import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useSectionVisibility } from '@/hooks/useSectionVisibility';

interface Student {
    id: string;
    name: string;
    rank: number;
    course: string;
    image?: string;
    year?: string;
    achievement?: string;
}

export default function TopStudents() {
    const { isVisible } = useSectionVisibility();
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState<Student[]>(() => {
        const cached = localStorage.getItem('cache_top_students');
        return cached ? JSON.parse(cached) : [];
    });

    // Fetch Top Students Dynamically
    useEffect(() => {
        const q = query(collection(db, 'top_students'), orderBy('rank'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Student[];
            setStudents(data);
            localStorage.setItem('cache_top_students', JSON.stringify(data));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (!isVisible('topStudents')) return null;

    // Skeleton Loader
    if (loading && students.length === 0) {
        return (
            <section className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="h-12 w-48 bg-gray-200 animate-pulse rounded-lg mb-12"></div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-3xl"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-12 md:mb-16 font-grotesk">
                    Top Student
                </h2>

                {/* Students Grid - Desktop */}
                <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {students.map((student, index) => (
                        <div
                            key={index}
                            className="rounded-3xl border-2 border-blue-400 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                        >
                            <div className="h-40 md:h-48 bg-gradient-to-br from-blue-200 to-blue-300 relative">
                                {student.image ? (
                                    <img src={student.image} alt={`${student.name} - Top Student`} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-blue-600">
                                        {student.name[0]}
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 bg-gray-900 text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-bold text-xs md:text-sm">
                                    {student.rank}
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 md:p-6">
                                <h4 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-2">
                                    {student.name}
                                </h4>
                                <p className="text-center text-sm md:text-base font-medium text-gray-800 mb-2">
                                    {student.course}
                                </p>
                                <p className="text-center text-xs md:text-sm text-gray-700">
                                    {student.achievement}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Students Grid - Mobile */}
                <div className="md:hidden">
                    {/* First Row */}
                    <div className="grid grid-cols-3 gap-3 mb-3">
                        {students.slice(0, 3).map((student, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div className="relative w-24 h-24 mb-3">
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-200 to-blue-300 overflow-hidden shadow-md">
                                        {student.image ? (
                                            <img src={student.image} alt={`${student.name} - Rank ${student.rank}`} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-blue-600">
                                                {student.name[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-xs shadow-md">
                                        {student.rank}
                                    </div>
                                </div>
                                <div className="text-center w-full">
                                    <h4 className="text-sm font-bold text-gray-900 mb-1 truncate px-1">{student.name}</h4>
                                    <p className="text-xs text-gray-600 truncate px-1">{student.course}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Second Row */}
                    <div className="grid grid-cols-3 gap-3 mb-3">
                        {students.slice(3, 6).map((student, index) => (
                            <div key={index + 3} className="flex flex-col items-center">
                                <div className="relative w-24 h-24 mb-3">
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-200 to-blue-300 overflow-hidden shadow-md">
                                        {student.image ? (
                                            <img src={student.image} alt={`${student.name} - Rank ${student.rank}`} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-blue-600">
                                                {student.name[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-xs shadow-md">
                                        {student.rank}
                                    </div>
                                </div>
                                <div className="text-center w-full">
                                    <h4 className="text-sm font-bold text-gray-900 mb-1 truncate px-1">{student.name}</h4>
                                    <p className="text-xs text-gray-600 truncate px-1">{student.course}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Third Row */}
                    <div className="grid grid-cols-6 gap-3">
                        {students.slice(6, 8).map((student, index) => (
                            <div
                                key={index + 6}
                                className="flex flex-col items-center col-span-2"
                                style={{ gridColumnStart: index === 0 ? 2 : 4 }}
                            >
                                <div className="relative w-24 h-24 mb-3">
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-200 to-blue-300 overflow-hidden shadow-md">
                                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-blue-600">
                                            {student.name[0]}
                                        </div>
                                    </div>
                                    <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-xs shadow-md">
                                        {student.rank}
                                    </div>
                                </div>
                                <div className="text-center w-full">
                                    <h4 className="text-sm font-bold text-gray-900 mb-1 truncate px-1">{student.name}</h4>
                                    <p className="text-xs text-gray-600 truncate px-1">{student.course}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
