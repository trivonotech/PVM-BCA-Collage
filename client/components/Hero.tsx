import React from "react";
import heroIllustration from "../assets/hero-illustration.png";
import decoBulb from "../assets/deco-bulb.png";
import decoBook from "../assets/deco-book.png";

export function Hero() {
    return (
        <section className="relative w-full min-h-[90vh] bg-[#FDFDFF] overflow-hidden flex flex-col items-center font-sans pt-10 lg:pt-16">
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(#E5E7EB 1px, transparent 1px), linear-gradient(90deg, #E5E7EB 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    opacity: 0.2
                }}
            />

            {/* Heading Section - Centered at top */}
            <div className="relative z-20 text-center mb-0 lg:mb-10 w-full max-w-5xl px-4">
                <div className="relative inline-block">
                    <img src={decoBulb} className="absolute -left-12 -top-6 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 animate-pulse-slow" alt="Idea" />
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-[#0B0B3B] leading-tight tracking-tight">
                        Education That <span className="whitespace-nowrap">Builds <img src={decoBook} className="inline-block w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 ml-2 -mt-2 lg:-mt-4 align-middle animate-bounce-slow" alt="Book" /></span> <br />
                        <span className="text-[#0B0B3B]">Capable Professionals</span>
                    </h1>
                </div>
                <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-3xl mx-auto mt-6 font-medium leading-relaxed">
                    Undergraduate Programs In Business Administration And Science Designed To Develop Practical Skills, Analytical Thinking, And Career Readiness.
                </p>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 relative z-10 flex-grow flex flex-col lg:flex-row items-end lg:items-center justify-between pointer-events-none">

                {/* Left: Illustration (Boy) */}
                <div className="w-full lg:w-1/2 flex justify-center lg:justify-start pointer-events-auto mt-8 lg:mt-0">
                    <img
                        src={heroIllustration}
                        alt="Student"
                        className="w-full max-w-xs lg:max-w-xl object-contain transform lg:-translate-x-10"
                    />
                </div>

                {/* 'Start Your Journey' Button - Relative on mobile, Absolute on Desktop */}
                <div className="relative w-full flex justify-center mt-6 lg:mt-0 lg:absolute lg:top-[35%] lg:right-24 z-30 pointer-events-auto lg:transform lg:-translate-y-1/2 lg:justify-end lg:w-auto lg:pr-0">
                    <button className="group relative inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-white transition-all duration-200 bg-[#0B0B3B] rounded-full hover:bg-[#1a1a5e] shadow-xl hover:shadow-2xl hover:-translate-y-1">
                        Start Your Journey
                        <span className="ml-2 tracking-widest text-[#FACC15] group-hover:translate-x-1 transition-transform">
                            {">>>>"}
                        </span>
                    </button>
                </div>

                {/* Right: Latest News Card - Fixed at bottom right */}
                <div className="w-full lg:w-auto pointer-events-auto flex justify-center lg:block lg:absolute lg:bottom-8 lg:right-20">
                    <div className="bg-[#FFF5F5] border border-red-100 p-6 rounded-2xl shadow-xl w-full max-w-sm lg:w-[380px] relative z-20 mt-8 lg:mt-0">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-red-100 rounded-md text-red-800">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" /><path d="M18 14h-8" /><path d="M15 18h-5" /><path d="M10 6h8v4h-8V6Z" /></svg>
                            </div>
                            <h3 className="text-[#592B2B] font-bold text-lg">Latest News</h3>
                        </div>
                        <p className="text-[#592B2B] text-xs opacity-80 leading-relaxed mb-4 font-medium">
                            Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry's Standard Dummy Text Ever Since The 1500s
                        </p>
                        <div className="flex justify-end">
                            <button className="text-white text-xs font-bold bg-[#A04040] px-6 py-2 rounded-full hover:bg-[#803030] transition-colors shadow-md">
                                More Detail {">>"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
