import React from 'react';
import admissionGirl from '../assets/admission-girl.png';
import admissionSteps from '../assets/admission-steps.png';

export default function AdmissionJourney() {
    return (
        <section className="py-16 bg-[#FFF0F5] overflow-hidden font-sans">
            <div className="container mx-auto px-4">

                {/* Mobile Heading */}
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0B0B3B] mb-8 md:mb-16 text-center md:text-left block lg:hidden">
                    Your Admission Journey
                </h2>

                <div className="flex flex-col-reverse lg:flex-row items-center justify-between relative gap-12 lg:gap-0">

                    {/* Left Side: Timeline Image (Content) */}
                    <div className="w-full lg:w-1/2 relative z-10 pl-4 lg:pl-10">

                        {/* Desktop Heading */}
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#36348E] mb-8 lg:mb-12 hidden lg:block">
                            Your Admission Journey
                        </h2>

                        {/* Steps Image */}
                        <div className="mb-10 w-full max-w-md">
                            <img
                                src={admissionSteps}
                                alt="Admission Steps: 1. Apply Online, 2. Verify Documents, 3. Confirm Admission"
                                className="w-full h-auto object-contain"
                            />
                        </div>

                        {/* Button */}
                        <div className="mt-8 flex justify-center lg:justify-start">
                            <button className="bg-[#36348E] text-[#FACC15] font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2">
                                Start Your Journey <span className="tracking-widest">{">>>>"}</span>
                            </button>
                        </div>

                    </div>

                    {/* Right Side: Illustration (Image) */}
                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-end lg:mt-0 relative">
                        <img
                            src={admissionGirl}
                            alt="Admission Journey"
                            className="w-full max-w-md lg:max-w-xl object-contain"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
}
