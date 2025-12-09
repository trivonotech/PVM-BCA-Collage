import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MessageSquare, BookOpen, Link as LinkIcon, HelpCircle } from 'lucide-react';
import { useState } from 'react';

export default function StudentCornerPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        course: '',
        feedbackType: 'suggestion',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Thank you for your feedback! We will get back to you soon.');
    };

    const importantLinks = [
        { name: 'Student Portal Login', url: '#', icon: '🔐' },
        { name: 'E-Library Access', url: '#', icon: '📚' },
        { name: 'Assignment Submission', url: '#', icon: '📝' },
        { name: 'Fee Payment', url: '#', icon: '💳' },
        { name: 'Result Portal', url: '#', icon: '📊' },
        { name: 'Hostel Portal', url: '#', icon: '🏠' }
    ];

    const faqs = [
        {
            question: 'How can I access the digital library?',
            answer: 'You can access the digital library using your student ID and password through the E-Library link in the important links section.'
        },
        {
            question: 'What is the procedure for semester fee payment?',
            answer: 'Visit the Fee Payment portal, log in with your credentials, select the semester, and proceed with online payment.'
        },
        {
            question: 'How do I apply for a scholarship?',
            answer: 'Visit the Admissions page and check the Scholarship Information section for detailed application procedures.'
        },
        {
            question: 'Where can I find my exam results?',
            answer: 'Exam results are published on the Result Portal. You can access it using your student ID and date of birth.'
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
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Student Corner</h1>
                        <p className="text-lg md:text-xl text-blue-200 leading-relaxed">
                            Your Voice Matters - Share Feedback, Get Support, And Access Important Resources
                        </p>
                    </div>
                </div>
            </section>

            {/* Feedback Form */}
            <section className="py-20 bg-[#FDFDFF]">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">
                                Student Feedback & Suggestions
                            </h2>
                            <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full mb-6"></div>
                            <p className="text-gray-600 text-lg">
                                Help us improve by sharing your valuable feedback
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl p-10 shadow-2xl border-2 border-[#BFD8FF]">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[#0B0B3B] font-bold mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#BFD8FF] focus:outline-none"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[#0B0B3B] font-bold mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#BFD8FF] focus:outline-none"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[#0B0B3B] font-bold mb-2">Course</label>
                                        <select
                                            required
                                            value={formData.course}
                                            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#BFD8FF] focus:outline-none"
                                        >
                                            <option value="">Select your course</option>
                                            <option value="BBA">BBA</option>
                                            <option value="B.Com">B.Com</option>
                                            <option value="BCA">BCA</option>
                                            <option value="B.Sc">B.Sc</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[#0B0B3B] font-bold mb-2">Feedback Type</label>
                                        <select
                                            required
                                            value={formData.feedbackType}
                                            onChange={(e) => setFormData({ ...formData, feedbackType: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#BFD8FF] focus:outline-none"
                                        >
                                            <option value="suggestion">Suggestion</option>
                                            <option value="complaint">Complaint</option>
                                            <option value="appreciation">Appreciation</option>
                                            <option value="query">Query</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[#0B0B3B] font-bold mb-2">Your Message</label>
                                    <textarea
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        rows={6}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#BFD8FF] focus:outline-none"
                                        placeholder="Share your thoughts, suggestions, or concerns..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-[#0B0B3B] to-[#1a1a5e] text-white rounded-xl font-bold text-lg hover:shadow-xl transition-shadow"
                                >
                                    Submit Feedback
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Academic Support */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">
                                Academic Support Information
                            </h2>
                            <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full mb-6"></div>
                            <p className="text-gray-600 text-lg">
                                Resources and support services available for students
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-gradient-to-br from-[#BFD8FF] to-[#E5E7EB] rounded-3xl p-8 shadow-xl text-center hover:shadow-2xl transition-shadow">
                                <div className="p-4 bg-white rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <BookOpen className="w-8 h-8 text-[#0B0B3B]" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#0B0B3B] mb-3">Library Services</h3>
                                <p className="text-gray-700 mb-4">
                                    Access to extensive collection of books, journals, and digital resources
                                </p>
                                <p className="text-sm text-gray-600">
                                    📞 Library Help Desk: +91-XXXX-XXXXXX
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-[#FFF5F5] to-[#FFE5E5] rounded-3xl p-8 shadow-xl text-center hover:shadow-2xl transition-shadow">
                                <div className="p-4 bg-white rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <MessageSquare className="w-8 h-8 text-[#FF4040]" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#0B0B3B] mb-3">Counseling Support</h3>
                                <p className="text-gray-700 mb-4">
                                    Professional counseling services for academic and personal guidance
                                </p>
                                <p className="text-sm text-gray-600">
                                    📧 counseling@institute.edu
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-[#FFF9E5] to-[#FFEED5] rounded-3xl p-8 shadow-xl text-center hover:shadow-2xl transition-shadow">
                                <div className="p-4 bg-white rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <HelpCircle className="w-8 h-8 text-[#FACC15]" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#0B0B3B] mb-3">IT Support</h3>
                                <p className="text-gray-700 mb-4">
                                    Technical assistance for portal access and digital resources
                                </p>
                                <p className="text-sm text-gray-600">
                                    📞 IT Helpdesk: +91-XXXX-XXXXXX
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Important Links */}
            <section className="py-20 bg-gradient-to-b from-[#FDFDFF] to-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">
                                Important Student Links
                            </h2>
                            <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full mb-6"></div>
                            <p className="text-gray-600 text-lg">
                                Quick access to essential student portals and services
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {importantLinks.map((link, idx) => (
                                <a
                                    key={idx}
                                    href={link.url}
                                    className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 hover:border-[#BFD8FF] hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center group"
                                >
                                    <div className="text-5xl mb-4">{link.icon}</div>
                                    <h3 className="text-lg font-bold text-[#0B0B3B] group-hover:text-[#FF4040] transition-colors">
                                        {link.name}
                                    </h3>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">
                                Frequently Asked Questions
                            </h2>
                            <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full"></div>
                        </div>

                        <div className="space-y-6">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="bg-gradient-to-r from-[#BFD8FF] to-[#E5E7EB] rounded-2xl p-8 shadow-lg">
                                    <h3 className="text-xl font-bold text-[#0B0B3B] mb-3 flex items-start gap-3">
                                        <span className="text-[#FF4040]">Q:</span>
                                        {faq.question}
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed pl-8">
                                        <span className="font-bold text-[#0B0B3B]">A:</span> {faq.answer}
                                    </p>
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
