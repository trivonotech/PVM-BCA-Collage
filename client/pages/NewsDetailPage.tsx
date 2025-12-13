import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calendar, User, ArrowLeft, Tag, Newspaper } from 'lucide-react';

interface NewsArticle {
    id: string;
    title: string;
    content: string;
    category: string;
    imageUrl?: string;
    submittedBy: {
        name: string;
        email: string;
        role?: 'student' | 'staff';
        rollNumber?: string;
        department?: string;
        designation?: string;
    };
    status: string;
    submittedAt: any;
    approvedAt?: any;
}

export default function NewsDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [article, setArticle] = useState<NewsArticle | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) return;

            try {
                const docRef = doc(db, 'news', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists() && docSnap.data().status === 'approved') {
                    setArticle({ id: docSnap.id, ...docSnap.data() } as NewsArticle);
                } else {
                    navigate('/news');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching article:', error);
                setLoading(false);
                navigate('/news');
            }
        };

        fetchArticle();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white font-poppins">
                <Header />
                <div className="container mx-auto px-4 py-20">
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!article) {
        return null;
    }

    // Format content with proper spacing - split by newlines and add bullets
    const formatContent = (content: string) => {
        const paragraphs = content.split('\n').filter(p => p.trim());
        return paragraphs.map((para, idx) => (
            <div key={idx} className="mb-6 flex gap-4">
                <div className="flex-shrink-0 mt-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed flex-1">{para}</p>
            </div>
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50 font-poppins">
            <Header />

            {/* Main Content - 50/50 Layout */}
            {/* Main Content - 50/50 Layout */}
            {/* Main Content - 50/50 Layout */}
            {/* Main Content - 50/50 Layout */}
            <section className="py-8 lg:py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
                            {/* LEFT SIDE - Sticky Image & Meta */}
                            <div className="lg:sticky lg:top-32 space-y-4">
                                {/* Back Link - Inside sticky container */}
                                <button
                                    onClick={() => navigate('/news')}
                                    className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium group"
                                >
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    Back to News
                                </button>

                                {/* Image Container */}
                                {article.imageUrl ? (
                                    <div className="rounded-2xl overflow-hidden shadow-2xl">
                                        <img
                                            src={article.imageUrl}
                                            alt={article.title}
                                            className="w-full h-auto max-h-[50vh] object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                                        <Newspaper className="w-16 h-16 text-blue-600 opacity-30" />
                                    </div>
                                )}

                                {/* Meta Card - Directly below image */}
                                <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
                                    <div className="flex items-center gap-3 mb-3 pb-3 border-b">
                                        <Tag className="w-4 h-4 text-blue-600" />
                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                            {article.category}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600 text-sm font-medium">
                                                {article.submittedAt?.toDate().toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <User className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600 text-sm font-medium">By {article.submittedBy.name}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Share Buttons (Sidebar) */}
                                <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
                                    <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Newspaper className="w-4 h-4 text-blue-600" />
                                        Share Article
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                        {/* WhatsApp */}
                                        <button
                                            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + window.location.href)}`, '_blank')}
                                            className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors shadow-sm"
                                            title="Share on WhatsApp"
                                        >
                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                        </button>

                                        {/* Facebook */}
                                        <button
                                            onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                                            className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm"
                                            title="Share on Facebook"
                                        >
                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                        </button>

                                        {/* Twitter/X */}
                                        <button
                                            onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`, '_blank')}
                                            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors shadow-sm"
                                            title="Share on X (Twitter)"
                                        >
                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                        </button>

                                        {/* LinkedIn */}
                                        <button
                                            onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                                            className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-colors shadow-sm"
                                            title="Share on LinkedIn"
                                        >
                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                        </button>

                                        {/* Copy Link */}
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(window.location.href);
                                                const btn = document.getElementById('copy-btn-sidebar');
                                                if (btn) {
                                                    const originalText = btn.innerHTML;
                                                    btn.innerHTML = '<span class="text-xs font-bold text-green-600">Copied!</span>';
                                                    setTimeout(() => btn.innerHTML = originalText, 2000);
                                                }
                                            }}
                                            className="px-4 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 transition-colors gap-2 font-medium shadow-sm flex-1"
                                            title="Copy Link"
                                            id="copy-btn-sidebar"
                                        >
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT SIDE - Content */}
                            <div>
                                {/* Alignment Spacer to match Back Button height + margin */}
                                <div className="hidden lg:block h-[2.5rem]"></div>

                                {/* Title */}
                                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                                    {article.title}
                                </h1>

                                {/* Decorative Line */}
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
                                    <div className="w-6 h-1 bg-purple-600 rounded-full"></div>
                                    <div className="w-3 h-1 bg-pink-600 rounded-full"></div>
                                </div>

                                {/* Article Content */}
                                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                                    {formatContent(article.content)}
                                </div>


                                {/* Author Info */}
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl mb-8">
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                        <User className="w-6 h-6" />
                                        About the Author
                                    </h3>
                                    <div className="grid gap-3">
                                        <div>
                                            <p className="text-blue-100 text-sm mb-1">Name</p>
                                            <p className="font-semibold text-lg">{article.submittedBy.name}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {article.submittedBy.role === 'staff' ? (
                                                <>
                                                    <div>
                                                        <p className="text-blue-100 text-sm mb-1">Designation</p>
                                                        <p className="font-semibold">{article.submittedBy.designation || 'Staff'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-blue-100 text-sm mb-1">Department</p>
                                                        <p className="font-semibold">{article.submittedBy.department || 'N/A'}</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <div>
                                                    <p className="text-blue-100 text-sm mb-1">Roll Number</p>
                                                    <p className="font-semibold">{article.submittedBy.rollNumber || 'N/A'}</p>
                                                </div>
                                            )}

                                            <div>
                                                <p className="text-blue-100 text-sm mb-1">Email</p>
                                                <p className="font-semibold truncate">{article.submittedBy.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => navigate('/news')}
                                        className="flex-1 bg-white border border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-sm"
                                    >
                                        View All News
                                    </button>
                                    <button
                                        onClick={() => navigate('/submit-news')}
                                        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md"
                                    >
                                        Submit News
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
