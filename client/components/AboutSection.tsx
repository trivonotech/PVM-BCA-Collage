import React from 'react';
import aboutBuilding from '../assets/about-building.png';
import quoteMark from '../assets/quote-mark.png';

export default function AboutSection() {
  return (
    <section className="relative w-full py-12 bg-[#03002E] overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center text-center">

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          About Institute
        </h2>

        {/* Content Box with Quotes */}
        <div className="relative max-w-4xl mx-auto mb-10 px-6 pt-6">
          {/* Quote Marks - Left - Increased opacity for visibility */}
          <img
            src={quoteMark}
            alt="Quote"
            className="absolute -top-4 -left-4 md:-left-24 w-16 h-16 md:w-24 md:h-24 opacity-30 md:opacity-30 brightness-0 invert"
          />
          {/* Note: Increased opacity from 0.1 to 0.3 as user said it was 'missing' */}

          <p className="text-white text-base md:text-xl leading-relaxed font-medium tracking-wide relative z-10">
            Our Institute Is Dedicated To Delivering Quality Education Through Well-Structured Academic Programs, Experienced Faculty, And A Student-Focused Learning Environment. We Aim To Build Strong Academic Foundations While Enhancing Practical Skills That Prepare Students For Real-World Challenges.
          </p>

          {/* Quote Marks - Right */}
          <img
            src={quoteMark}
            alt="Quote"
            className="absolute -bottom-6 -right-4 md:-right-24 w-16 h-16 md:w-24 md:h-24 opacity-30 md:opacity-30 brightness-0 invert rotate-180"
          />
        </div>

        {/* Call to Action Button */}
        <button className="bg-gradient-to-r from-[#FF004D] to-[#FF0076] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm mb-2 relative z-20">
          Read More About The Institute {">>"}
        </button>

      </div>

      {/* Footer Building Illustration - Lowered opacity as requested */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none opacity-20 md:opacity-25">
        <img
          src={aboutBuilding}
          alt="Institute Building"
          className="w-full max-w-[500px] md:max-w-[700px] object-contain ml-0 md:ml-10"
        />
      </div>
    </section>
  );
}
