import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Inquiry submitted:', formData);
        alert('Thank you for your inquiry! We will contact you soon.');
    };

    const contactInfo = [
        {
            icon: MapPin,
            title: 'Address',
            details: 'Main Campus Road, Education City, State - 123456',
            color: 'from-[#BFD8FF] to-[#E5E7EB]'
        },
        {
            icon: Phone,
            title: 'Phone',
            details: '+91-XXXX-XXXXXX\n+91-YYYY-YYYYYY',
            color: 'from-[#FFF5F5] to-[#FFE5E5]'
        },
        {
            icon: Mail,
            title: 'Email',
            details: 'admissions@institute.edu\ninfo@institute.edu',
            color: 'from-[#FFF9E5] to-[#FFEED5]'
        },
        {
            icon: Clock,
            title: 'Office Hours',
            details: 'Mon - Fri: 9:00 AM - 5:00 PM\nSat: 9:00 AM - 1:00 PM',
            color: 'from-[#E5F9E5] to-[#D5F5D5]'
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
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Contact Us</h1>
                        <p className="text-lg md:text-xl text-blue-200 leading-relaxed">
                            Get In Touch With Us - We're Here To Help With Your Queries And Admissions
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Information Cards */}
            <section className="py-20 bg-[#FDFDFF]">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-4 gap-6">
                            {contactInfo.map((info, idx) => (
                                <div key={idx} className={`bg-gradient-to-br ${info.color} rounded-3xl p-8 shadow-xl text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}>
                                    <div className="p-4 bg-white rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <info.icon className="w-8 h-8 text-[#0B0B3B]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#0B0B3B] mb-3">{info.title}</h3>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">{info.details}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Inquiry Form & Map */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12">
                            {/* Inquiry Form */}
                            <div>
                                <div className="mb-8">
                                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B0B3B] mb-4">
                                        Send Us An Inquiry
                                    </h2>
                                    <div className="w-24 h-1 bg-[#FF4040] rounded-full mb-4"></div>
                                    <p className="text-gray-600">
                                        Fill out the form below and we'll get back to you as soon as possible
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-[#0B0B3B] font-bold mb-2">Full Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#BFD8FF] focus:outline-none"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[#0B0B3B] font-bold mb-2">Email *</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#BFD8FF] focus:outline-none"
                                                placeholder="your.email@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[#0B0B3B] font-bold mb-2">Phone *</label>
                                            <input
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#BFD8FF] focus:outline-none"
                                                placeholder="+91-XXXXXXXXXX"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[#0B0B3B] font-bold mb-2">Subject *</label>
                                        <select
                                            required
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#BFD8FF] focus:outline-none"
                                        >
                                            <option value="">Select a subject</option>
                                            <option value="admission">Admission Inquiry</option>
                                            <option value="courses">Course Information</option>
                                            <option value="placement">Placement Information</option>
                                            <option value="general">General Inquiry</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[#0B0B3B] font-bold mb-2">Message *</label>
                                        <textarea
                                            required
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            rows={6}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#BFD8FF] focus:outline-none"
                                            placeholder="Tell us about your inquiry..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-gradient-to-r from-[#0B0B3B] to-[#1a1a5e] text-white rounded-xl font-bold text-lg hover:shadow-xl transition-shadow"
                                    >
                                        Send Inquiry
                                    </button>
                                </form>
                            </div>

                            {/* Map & Additional Info */}
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B0B3B] mb-4">
                                        Find Us On Map
                                    </h2>
                                    <div className="w-24 h-1 bg-[#FF4040] rounded-full mb-6"></div>

                                    {/* Google Map Embed */}
                                    <div className="relative w-full h-96 bg-gradient-to-br from-[#BFD8FF] to-[#E5E7EB] rounded-3xl overflow-hidden shadow-xl">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093747!2d144.9537353159042!3d-37.81720974201434!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sEnvato!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            className="rounded-3xl"
                                        />
                                    </div>
                                </div>

                                {/* Quick Contact Card */}
                                <div className="bg-gradient-to-r from-[#FF4040] to-[#c03030] rounded-3xl p-8 shadow-2xl text-white">
                                    <h3 className="text-2xl font-bold mb-6">Quick Contacts</h3>
                                    <div className="space-y-4">
                                        <div className="bg-white/20 rounded-xl p-4">
                                            <div className="font-bold mb-1">Admission Office</div>
                                            <div className="text-sm">📞 +91-XXXX-XXXXXX</div>
                                        </div>
                                        <div className="bg-white/20 rounded-xl p-4">
                                            <div className="font-bold mb-1">Academic Queries</div>
                                            <div className="text-sm">📧 academic@institute.edu</div>
                                        </div>
                                        <div className="bg-white/20 rounded-xl p-4">
                                            <div className="font-bold mb-1">Placement Cell</div>
                                            <div className="text-sm">📧 placement@institute.edu</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visit Us Section */}
            <section className="py-20 bg-gradient-to-b from-[#FDFDFF] to-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B0B3B] mb-6">
                            Visit Our Campus
                        </h2>
                        <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full mb-8"></div>
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            We welcome you to visit our campus and experience the vibrant learning environment.
                            Our admission counselors are available to guide you through our programs and facilities.
                        </p>
                        <div className="flex flex-col md:flex-row gap-6 justify-center">
                            <button className="px-8 py-4 bg-[#0B0B3B] text-white rounded-xl font-bold hover:bg-[#1a1a5e] transition-colors shadow-lg">
                                Schedule A Campus Tour
                            </button>
                            <button className="px-8 py-4 bg-white border-2 border-[#0B0B3B] text-[#0B0B3B] rounded-xl font-bold hover:bg-[#BFD8FF] transition-colors shadow-lg">
                                Download Brochure
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
