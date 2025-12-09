import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Award, Target, Eye, Trophy, Shield, Star } from 'lucide-react';

export default function AboutPage() {
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
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">About Us</h1>
                        <p className="text-lg md:text-xl text-blue-200 leading-relaxed">
                            Building Tomorrow's Leaders Through Quality Education And Holistic Development
                        </p>
                    </div>
                </div>
            </section>

            {/* Institute Overview */}
            <section className="py-20 bg-[#FDFDFF]">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">
                                Institute Overview
                            </h2>
                            <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full"></div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    Established with a vision to provide world-class education, our institute has been at the forefront of academic excellence for over a decade. We are committed to nurturing young minds and transforming them into capable professionals ready to face global challenges.
                                </p>
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    Our state-of-the-art infrastructure, experienced faculty, and industry-aligned curriculum ensure that students receive comprehensive education that balances theoretical knowledge with practical skills.
                                </p>
                                <div className="grid grid-cols-2 gap-6 pt-4">
                                    <div className="bg-[#BFD8FF] p-6 rounded-2xl text-center">
                                        <div className="text-4xl font-bold text-[#0B0B3B] mb-2">10+</div>
                                        <div className="text-sm font-semibold text-gray-700">Years of Excellence</div>
                                    </div>
                                    <div className="bg-[#FFF5F5] p-6 rounded-2xl text-center">
                                        <div className="text-4xl font-bold text-[#FF4040] mb-2">5000+</div>
                                        <div className="text-sm font-semibold text-gray-700">Alumni Network</div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="bg-gradient-to-br from-[#BFD8FF] to-[#E5E7EB] rounded-3xl p-8 shadow-2xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop"
                                        alt="Campus"
                                        className="w-full h-80 object-cover rounded-2xl shadow-lg"
                                    />
                                </div>
                                <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-[#FACC15] rounded-full opacity-20 blur-2xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Vision Card */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B3B] to-[#1a1a5e] rounded-3xl transform group-hover:scale-105 transition-transform duration-300"></div>
                                <div className="relative bg-gradient-to-br from-[#0B0B3B] to-[#1a1a5e] rounded-3xl p-10 shadow-2xl">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-4 bg-[#BFD8FF] rounded-2xl">
                                            <Eye className="w-8 h-8 text-[#0B0B3B]" />
                                        </div>
                                        <h3 className="text-3xl font-bold text-white">Our Vision</h3>
                                    </div>
                                    <p className="text-blue-100 leading-relaxed text-lg">
                                        To be a globally recognized institution that shapes future leaders through innovative education, research excellence, and character development, while fostering creativity, critical thinking, and social responsibility.
                                    </p>
                                    <div className="mt-8 flex gap-3">
                                        <div className="w-3 h-3 bg-[#FACC15] rounded-full animate-pulse"></div>
                                        <div className="w-3 h-3 bg-[#BFD8FF] rounded-full animate-pulse delay-100"></div>
                                        <div className="w-3 h-3 bg-[#FF4040] rounded-full animate-pulse delay-200"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Mission Card */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#FF4040] to-[#c03030] rounded-3xl transform group-hover:scale-105 transition-transform duration-300"></div>
                                <div className="relative bg-gradient-to-br from-[#FF4040] to-[#c03030] rounded-3xl p-10 shadow-2xl">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-4 bg-white rounded-2xl">
                                            <Target className="w-8 h-8 text-[#FF4040]" />
                                        </div>
                                        <h3 className="text-3xl font-bold text-white">Our Mission</h3>
                                    </div>
                                    <ul className="space-y-4 text-red-50">
                                        <li className="flex items-start gap-3">
                                            <span className="text-[#FACC15] mt-1">✓</span>
                                            <span className="leading-relaxed">Provide quality education with modern teaching methodologies</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-[#FACC15] mt-1">✓</span>
                                            <span className="leading-relaxed">Develop industry-ready professionals with practical skills</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-[#FACC15] mt-1">✓</span>
                                            <span className="leading-relaxed">Foster innovation, research, and creative thinking</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-[#FACC15] mt-1">✓</span>
                                            <span className="leading-relaxed">Build strong industry partnerships for placements</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Achievements & Accreditations */}
            <section className="py-20 bg-gradient-to-b from-[#FDFDFF] to-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">
                                Achievements & Accreditations
                            </h2>
                            <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full mb-6"></div>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                Recognized for excellence and committed to maintaining the highest standards of education
                            </p>
                        </div>

                        {/* Achievements Grid */}
                        <div className="grid md:grid-cols-3 gap-8 mb-16">
                            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-[#BFD8FF] hover:shadow-2xl transition-shadow group">
                                <div className="p-4 bg-gradient-to-br from-[#BFD8FF] to-[#E5E7EB] rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Trophy className="w-8 h-8 text-[#0B0B3B]" />
                                </div>
                                <h4 className="text-xl font-bold text-[#0B0B3B] mb-3">Best Institute Award</h4>
                                <p className="text-gray-600 leading-relaxed">
                                    Recognized as the Best Educational Institute for Academic Excellence in 2023
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-[#FFF5F5] hover:shadow-2xl transition-shadow group">
                                <div className="p-4 bg-gradient-to-br from-[#FFF5F5] to-[#FFE5E5] rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Shield className="w-8 h-8 text-[#FF4040]" />
                                </div>
                                <h4 className="text-xl font-bold text-[#0B0B3B] mb-3">NAAC Accredited</h4>
                                <p className="text-gray-600 leading-relaxed">
                                    Accredited by National Assessment and Accreditation Council with A+ Grade
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-[#FFF9E5] hover:shadow-2xl transition-shadow group">
                                <div className="p-4 bg-gradient-to-br from-[#FFF9E5] to-[#FFEED5] rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Star className="w-8 h-8 text-[#FACC15]" />
                                </div>
                                <h4 className="text-xl font-bold text-[#0B0B3B] mb-3">100% Placement</h4>
                                <p className="text-gray-600 leading-relaxed">
                                    Achieved 100% placement record for the batch 2022-23 with top companies
                                </p>
                            </div>
                        </div>

                        {/* Accreditation Logos */}
                        <div className="bg-gradient-to-r from-[#BFD8FF] to-[#FFF5F5] rounded-3xl p-12">
                            <h3 className="text-2xl font-bold text-[#0B0B3B] text-center mb-8">
                                Our Accreditations & Affiliations
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {['NAAC', 'UGC', 'AICTE', 'ISO'].map((accred, idx) => (
                                    <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                                        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl font-bold text-gray-600">{accred}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
