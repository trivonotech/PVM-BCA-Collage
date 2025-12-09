import React, { useState, useRef } from 'react';

export default function AcademicsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const courses = [
    {
      title: 'Environmental Science',
      duration: '4 Years',
      description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.',
    },
    {
      title: 'BBA',
      duration: '4 Years',
      description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.',
    },
    {
      title: 'BBA',
      duration: '4 Years',
      description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.',
    },
  ];

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const firstCard = carouselRef.current.children[0] as HTMLElement;
      const cardWidth = firstCard.offsetWidth;
      // Gap-12 is 48px
      const gap = 48;
      const totalCardSpace = cardWidth + gap;

      const index = Math.round(scrollLeft / totalCardSpace);
      setActiveIndex(index);
    }
  };

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const firstCard = carouselRef.current.children[0] as HTMLElement;
      const cardWidth = firstCard.offsetWidth;
      const gap = 48; // gap-12
      const totalCardSpace = cardWidth + gap;

      carouselRef.current.scrollTo({
        left: index * totalCardSpace,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-0 md:px-8">
        {/* Header - Added px-4 for mobile to match padding since container has px-0 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12 md:mb-16 px-4 md:px-0">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 font-grotesk">
              Academics Snapshot
            </h2>
          </div>
          <a href="#" className="inline-flex items-center gap-2 text-gray-900 font-medium text-sm md:text-base hover:gap-3 transition-all">
            view more
            <svg className="w-3 h-4 md:w-4 md:h-5" viewBox="0 0 8 15" fill="none">
              <path
                d="M0.894531 14.2996C0.793251 14.3026 0.692069 14.2847 0.597656 14.2468C0.503399 14.209 0.41757 14.1521 0.344727 14.0798C0.27181 14.0075 0.213576 13.9205 0.172852 13.825C0.132189 13.7295 0.109253 13.6265 0.106445 13.5222C0.103696 13.418 0.120811 13.3141 0.15625 13.2166C0.191679 13.1191 0.245834 13.0302 0.314453 12.9539L0.313476 12.9529L5.48437 7.20386L0.314452 1.45483L0.264647 1.39526C0.21774 1.33324 0.17989 1.26383 0.152343 1.19019C0.115724 1.09218 0.0984489 0.987588 0.100585 0.882569C0.102764 0.777456 0.12434 0.673287 0.165038 0.576905C0.205828 0.480422 0.265298 0.393037 0.338866 0.320069C0.412429 0.247125 0.499405 0.189857 0.594725 0.1521C0.69 0.1144 0.791537 0.0965453 0.893553 0.100342C0.995677 0.104153 1.096 0.12982 1.18848 0.174561C1.28071 0.21922 1.36338 0.282162 1.43164 0.360108L1.43164 0.361084L7.09277 6.65601C7.22662 6.80471 7.2998 7.00103 7.2998 7.20386C7.2998 7.40669 7.22663 7.603 7.09277 7.75171L1.43066 14.0476C1.3619 14.124 1.2795 14.186 1.1875 14.2292C1.09541 14.2726 0.995742 14.2965 0.894531 14.2996Z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>

        {/* Course Cards Grid/Carousel */}
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto gap-12 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:items-stretch snap-x snap-mandatory no-scrollbar hide-scrollbar py-4 md:pb-0 px-4 md:px-0"
        >
          {courses.map((course, index) => (
            <div
              key={index}
              className="rounded-3xl shadow-sm hover:shadow-lg transition-shadow w-[calc(100vw-2rem)] md:w-full shrink-0 snap-center flex flex-col"
            >
              {/* Card Content */}
              <div className="bg-[#BFD8FF] p-6 md:p-8 flex-grow flex flex-col rounded-3xl overflow-hidden">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                  {course.title}
                </h3>

                <p className="text-lg md:text-xl font-medium text-gray-800 mb-3">
                  {course.duration}
                </p>

                <p className="text-sm md:text-base text-gray-700 mb-6 leading-relaxed flex-grow">
                  {course.description}
                </p>

                {/* Seats Info - Dark Blue Section */}
                <div className="-mx-6 md:-mx-8 -mb-8 mt-auto">
                  <div className="bg-[#0B0B3B] px-6 md:px-8 py-4 flex items-center justify-between">
                    <div className="flex gap-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-2 h-2 md:w-3 md:h-3 bg-white/30 rounded-full" />
                      ))}
                    </div>
                    <span className="text-sm text-white/70 font-medium">Seats</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Dots (Mobile Only) */}
        <div className="flex justify-center gap-2 mt-4 md:hidden">
          {courses.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-gray-900 w-6' : 'bg-gray-300'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
