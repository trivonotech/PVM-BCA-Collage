import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import TopStudents from './TopStudents'; // Reusing the component

export default function HighlightsSection() {
  const [events, setEvents] = useState<any[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fetch Latest 10 Events Dynamically
  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('date', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(data);
    });
    return () => unsubscribe();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-0 md:px-8">
        {/* Event Highlights Section */}
        <div className="mb-8 md:mb-12 bg-slate-600 rounded-none md:rounded-3xl overflow-hidden py-6 md:py-10 relative">
          <div className="px-4 md:px-12">
            {/* Auto-Scrolling Carousel */}
            <div className="relative overflow-hidden">
              {/* Carousel Track */}
              <div className="flex gap-4 md:gap-6 animate-carousel">
                {/* Duplicate events array twice for seamless infinite scroll */}
                {[...events, ...events].map((event, index) => (
                  <div
                    key={`${event.id}-${index}`}
                    className="group relative h-[355px] w-[80vw] md:w-[calc(25%-1.125rem)] shrink-0 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg"
                  >
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                ))}
              </div>

              {/* Left Fade Gradient */}
              <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-slate-600 to-transparent pointer-events-none z-10" />

              {/* Right Fade Gradient */}
              <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-slate-600 to-transparent pointer-events-none z-10" />

              {/* Title Overlaid on Carousel */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <h3 className="font-poppins font-light capitalize drop-shadow-2xl text-center px-4" style={{ fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: '100%', letterSpacing: '0%', color: '#E5E5E5' }}>
                  Event High<span className="text-red-600">light</span>
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* View More Button - Outside Section */}
        <div className="flex justify-center mb-16 md:mb-24">
          <Link to="/student-life" className="flex items-center gap-1 bg-blue-950 hover:bg-blue-900 text-white font-semibold px-10 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <span>View More</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <svg className="w-5 h-5 -ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Reusing TopStudents Component to eliminate duplication */}
        <TopStudents />

      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes carousel {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-carousel {
          animation: carousel 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
