import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, Share2 } from 'lucide-react';

export default function HighlightsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const students = [
    { rank: '1', name: 'MOHIT', course: 'Environmental Science', achievement: 'achievement' },
    { rank: '2', name: 'PRIYA', course: 'BBA', achievement: 'achievement' },
    { rank: '3', name: 'ARJUN', course: 'BBA', achievement: 'achievement' },
    { rank: '4', name: 'SOPHIA', course: 'Computer Science', achievement: 'achievement' },
    { rank: '5', name: 'ADITYA', course: 'Environmental Science', achievement: 'achievement' },
    { rank: '6', name: 'NEHA', course: 'BBA', achievement: 'achievement' },
    { rank: '7', name: 'RAHUL', course: 'Engineering', achievement: 'achievement' },
    { rank: '8', name: 'ANANYA', course: 'Science', achievement: 'achievement' },
  ];



  const events = [
    {
      id: 1,
      name: 'Annual Tech Fest 2024',
      date: 'March 15, 2024',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      name: 'Convocation Ceremony',
      date: 'April 02, 2024',
      image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      name: 'Sports Day Final',
      date: 'February 20, 2024',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 4,
      name: 'Science Exhibition',
      date: 'January 10, 2024',
      image: 'https://images.unsplash.com/photo-1564325724739-bae0bd08762c?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 5,
      name: 'Cultural Fest 2024',
      date: 'March 25, 2024',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 6,
      name: 'Annual Day Celebration',
      date: 'December 15, 2023',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 7,
      name: 'Tech Workshop Series',
      date: 'February 10, 2024',
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 8,
      name: 'Alumni Meet 2024',
      date: 'January 20, 2024',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    },
  ];

  /* Auto-play Effect - purely CSS based now, simplified component */

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
                    {/* Dark overlay - light persistent overlay for text readability if needed, or removed active hover state */}
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
          <button className="flex items-center gap-1 bg-blue-950 hover:bg-blue-900 text-white font-semibold px-10 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <span>View More</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <svg className="w-5 h-5 -ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-12 md:mb-16 font-grotesk px-4 md:px-0">
          Top Student
        </h2>

        {/* Students Grid - Desktop */}
        <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 md:px-0">
          {students.map((student, index) => (
            <div
              key={index}
              className="rounded-3xl border-2 border-blue-400 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              {/* Student Image */}
              <div className="h-40 md:h-48 bg-gradient-to-br from-blue-200 to-blue-300 relative">
                <div className="absolute top-3 right-3 bg-gray-900 text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-bold text-xs md:text-sm">
                  {student.rank}
                </div>
              </div>

              {/* Student Info */}
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
        <div className="md:hidden px-4">
          {/* First Row - 3 Students */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            {students.slice(0, 3).map((student, index) => (
              <div
                key={index}
                className="flex flex-col items-center"
              >
                {/* Circular Photo */}
                <div className="relative w-24 h-24 mb-3">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-200 to-blue-300 overflow-hidden shadow-md">
                    {/* Photo placeholder - you can add actual images here */}
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-blue-600">
                      {student.name[0]}
                    </div>
                  </div>
                  {/* Rank Badge */}
                  <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-xs shadow-md">
                    {student.rank}
                  </div>
                </div>

                {/* Student Info */}
                <div className="text-center w-full">
                  <h4 className="text-sm font-bold text-gray-900 mb-1 truncate px-1">
                    {student.name}
                  </h4>
                  <p className="text-xs text-gray-600 truncate px-1">
                    {student.course}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Second Row - 3 Students */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            {students.slice(3, 6).map((student, index) => (
              <div
                key={index + 3}
                className="flex flex-col items-center"
              >
                {/* Circular Photo */}
                <div className="relative w-24 h-24 mb-3">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-200 to-blue-300 overflow-hidden shadow-md">
                    {/* Photo placeholder - you can add actual images here */}
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-blue-600">
                      {student.name[0]}
                    </div>
                  </div>
                  {/* Rank Badge */}
                  <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-xs shadow-md">
                    {student.rank}
                  </div>
                </div>

                {/* Student Info */}
                <div className="text-center w-full">
                  <h4 className="text-sm font-bold text-gray-900 mb-1 truncate px-1">
                    {student.name}
                  </h4>
                  <p className="text-xs text-gray-600 truncate px-1">
                    {student.course}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Third Row - 2 Students Centered */}
          <div className="grid grid-cols-6 gap-3">
            {students.slice(6, 8).map((student, index) => (
              <div
                key={index + 6}
                className="flex flex-col items-center col-span-2"
                style={{ gridColumnStart: index === 0 ? 2 : 4 }}
              >
                {/* Circular Photo */}
                <div className="relative w-24 h-24 mb-3">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-200 to-blue-300 overflow-hidden shadow-md">
                    {/* Photo placeholder - you can add actual images here */}
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-blue-600">
                      {student.name[0]}
                    </div>
                  </div>
                  {/* Rank Badge */}
                  <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-xs shadow-md">
                    {student.rank}
                  </div>
                </div>

                {/* Student Info */}
                <div className="text-center w-full">
                  <h4 className="text-sm font-bold text-gray-900 mb-1 truncate px-1">
                    {student.name}
                  </h4>
                  <p className="text-xs text-gray-600 truncate px-1">
                    {student.course}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
