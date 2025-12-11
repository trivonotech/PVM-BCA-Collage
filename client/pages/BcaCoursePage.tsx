import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Award,
  Users,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BcaCoursePage() {
  const [activeSem, setActiveSem] = useState<number>(0);
  const [mobileActiveSem, setMobileActiveSem] = useState<number | null>(null);

  // Exact Data Transcription from Images (Unified Format - Removed Sem No.)
  const headers = ["Sr. No.", "Category of Course", "Course Title", "Course Level", "Credit", "Teaching Hrs.", "SEE Marks", "CCE Marks", "Total Marks", "Exam Duration"];

  const syllabus = [
    {
      sem: "Semester 1",
      id: 1,
      courses: [
        { c1: "1", c2: "Major-1", c3: "Problem solving methodologies and programming in c (theory)", c4: "4.5", c5: "4", c6: "60", c7: "50", c8: "50", c9: "100", c10: "2:30 Hrs" },
        { c1: "2", c2: "MAJOR-2", c3: "PROBLEM SOLVING METHODOLOGIES AND PROGRAMMING IN C (Practical)", c4: "4.5", c5: "4", c6: "120", c7: "50", c8: "50", c9: "100", c10: "2:30 Hrs" },
        { c1: "3", c2: "MINOR-1", c3: "BASICS OF WEB PAGE DEVELOPMENT", c4: "4.5", c5: "4", c6: "60", c7: "50", c8: "50", c9: "100", c10: "2:30 Hrs" },
        { c1: "4", c2: "MDC-1", c3: "Computer fundamentals and emerging technology", c4: "4.5", c5: "4", c6: "60", c7: "50", c8: "50", c9: "100", c10: "2:30 Hrs" },
        { c1: "5", c2: "AEC-1", c3: "ENGLISH/HINDI/GUJARATI/SANSKRIT", c4: "4.5", c5: "2", c6: "30", c7: "25", c8: "25", c9: "50", c10: "2:00 Hrs" },
        { c1: "6", c2: "SEC-1", c3: "OFFICE AUTOMATION", c4: "4.5", c5: "2", c6: "30", c7: "25", c8: "25", c9: "50", c10: "2:00 Hrs" },
        { c1: "7", c2: "VAC-1", c3: "IKS", c4: "4.5", c5: "2", c6: "30", c7: "25", c8: "25", c9: "50", c10: "2:00 Hrs" }
      ]
    },
    {
      sem: "Semester 2",
      id: 2,
      courses: [
        { c1: "1", c2: "Major-3", c3: "Data Structure using C (Theory)", c4: "4.5", c5: "4", c6: "60", c7: "50", c8: "50", c9: "100", c10: "2:30 Hrs" },
        { c1: "2", c2: "Major-4", c3: "Data Structure using C (Practical)", c4: "4.5", c5: "4", c6: "120", c7: "50", c8: "50", c9: "100", c10: "2:30 Hrs" },
        { c1: "3", c2: "Minor-2", c3: "Web Programming using PHP", c4: "4.5", c5: "4", c6: "60", c7: "50", c8: "50", c9: "100", c10: "2:30 Hrs" },
        { c1: "4", c2: "MDC-2", c3: "Computer Organization and Architecture", c4: "4.5", c5: "4", c6: "60", c7: "50", c8: "50", c9: "100", c10: "2:30 Hrs" },
        { c1: "5", c2: "AEC-2", c3: "ENGLISH/HINDI/GUJARATI/SANSKRIT", c4: "4.5", c5: "2", c6: "30", c7: "25", c8: "25", c9: "50", c10: "2:00 Hrs" },
        { c1: "6", c2: "SEC-2", c3: "Basic concepts of Networking and Internet", c4: "4.5", c5: "2", c6: "30", c7: "25", c8: "25", c9: "50", c10: "2:00 Hrs" },
        { c1: "7", c2: "VAC-2", c3: "The student has to select any one from the basket...", c4: "4.5", c5: "2", c6: "30", c7: "25", c8: "25", c9: "50", c10: "2:00 Hrs" }
      ]
    },
    {
      sem: "Semester 3",
      id: 3,
      courses: [
        { c1: "1", c2: "Major-5", c3: "OOP Concepts using C++ (Theory)", c4: "5.0", c5: "Theory 4\nPractical 0", c6: "Theory-60\nPractical-0", c7: "50", c8: "50", c9: "100", c10: "2:00 Hrs" },
        { c1: "2", c2: "Major-6", c3: "OOP Concepts using C++ (Practical)", c4: "5.0", c5: "Theory 0\nPractical 4", c6: "Theory-0\nPractical-120", c7: "50", c8: "50", c9: "100", c10: "2:00 Hrs" },
        { c1: "3", c2: "Major-7", c3: "DBMS - I", c4: "5.0", c5: "Theory 3\nPractical 1", c6: "Theory-45\nPractical-30", c7: "50", c8: "50", c9: "100", c10: "2:00 Hrs" },
        { c1: "4", c2: "MDC-3", c3: "Mathematics", c4: "5.0", c5: "Theory 4\nPractical 0", c6: "Theory-60\nPractical-0", c7: "50", c8: "50", c9: "100", c10: "2:00 Hrs" }
      ]
    },
    {
      sem: "Semester 4",
      id: 4,
      courses: [
        { c1: "1", c2: "Major-8", c3: "Programming in Java (Theory)", c4: "5.0", c5: "Theory 4\nPractical 0", c6: "Theory-60\nPractical-0", c7: "50", c8: "50", c9: "100", c10: "2:00 Hrs" },
        { c1: "2", c2: "Major-9", c3: "Programming in Java (Practical)", c4: "5.0", c5: "Theory 0\nPractical 4", c6: "Theory-0\nPractical-120", c7: "50", c8: "50", c9: "100", c10: "2:00 Hrs" },
        { c1: "3", c2: "Major-10", c3: "DBMS - II", c4: "5.0", c5: "Theory 3\nPractical 1", c6: "Theory-45\nPractical-30", c7: "50", c8: "50", c9: "100", c10: "2:00 Hrs" },
        { c1: "4", c2: "Minor-3", c3: "Programming with C#.Net", c4: "5.0", c5: "Theory 3\nPractical 1", c6: "Theory-45\nPractical-30", c7: "50", c8: "50", c9: "100", c10: "2:00 Hrs" }
      ]
    },
    {
      sem: "Semester 5",
      id: 5,
      courses: [
        { c1: "1", c2: "Major-11", c3: "Advanced Java and J2EE (Theory)", c4: "5.5", c5: "4 (T)", c6: "60 (T)", c7: "50", c8: "50", c9: "100", c10: "2:00 Hrs." },
        { c1: "2", c2: "Major-12", c3: "Digital Applications of IKS using J2EE", c4: "5.5", c5: "4 (P)", c6: "120 (P)", c7: "50", c8: "50", c9: "100", c10: "2:00 Hrs." },
        { c1: "3", c2: "Major-13", c3: "Web Development Using ASP.NET", c4: "5.5", c5: "3 (T)\n1 (P)", c6: "45 (T)\n30 (P)", c7: "50", c8: "50", c9: "100", c10: "2:00 Hrs." },
        { c1: "4", c2: "Minor-4", c3: "In House Project Development", c4: "5.5", c5: "4 (P)", c6: "120 (P)", c7: "50", c8: "50", c9: "100", c10: "2:00 Hrs." },
        { c1: "5", c2: "Minor-5", c3: "Programming in Python", c4: "5.5", c5: "3 (T)\n1 (P)", c6: "45 (T)\n30 (P)", c7: "50", c8: "50", c9: "100", c10: "2:00 Hrs." }
      ]
    },
    {
      sem: "Semester 6",
      id: 6,
      courses: [
        { c1: "1", c2: "Major-14", c3: "Mobile Programming Using Android (Java) (Theory)", c4: "5.5", c5: "Theory- 04", c6: "Theory- 60", c7: "50", c8: "50", c9: "100", c10: "2:00 Hrs." },
        { c1: "2", c2: "Major-15", c3: "Mobile Programming Using Android (Java) (Practical)", c4: "5.5", c5: "Practical- 04", c6: "Practical- 120", c7: "50", c8: "50", c9: "100", c10: "2:00 Hrs." },
        { c1: "3", c2: "Major-16", c3: "Web Development Using React.js", c4: "5.5", c5: "Theory- 03\nPractical- 01", c6: "Theory- 45\nPractical- 30", c7: "50", c8: "50", c9: "100", c10: "2:00 Hrs." },
        { c1: "4", c2: "Minor-6", c3: "Advanced Python Programming for AI and Machine Learning", c4: "5.5", c5: "Theory- 03\nPractical- 01", c6: "Theory- 45\nPractical- 30", c7: "50", c8: "50", c9: "100", c10: "2:00 Hrs." }
      ]
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
            <span className="inline-block py-1 px-3 rounded-full bg-[#FF4040] text-white text-sm font-bold mb-4">
              Undergraduate Program
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Bachelor of Computer Applications</h1>
            <p className="text-lg md:text-xl text-blue-200 leading-relaxed max-w-2xl mx-auto">
              Master the world of computers, software, and modern technology.
            </p>
          </div>
        </div>
      </section>

      {/* Course Overview & Full Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#0B0B3B] mb-6">Course Overview</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                BCA (Bachelor of Computer Applications) is a three-year undergraduate program designed to introduce students to the world of computers, software, and modern technology. The course prepares learners to understand and solve real-life technological challenges that arise in today’s rapidly changing digital environment.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                This degree forms a strong foundation in computer science and is ideal for students who want to explore fields such as software engineering, information technology, cybersecurity, networking, and system management.
              </p>
              <div className="bg-blue-50 p-6 rounded-2xl border-l-4 border-[#0B0B3B] mt-6">
                <h3 className="text-xl font-bold text-[#0B0B3B] mb-2">BCA Full Form</h3>
                <p className="text-gray-700">
                  <span className="font-semibold">BCA</span> stands for <span className="font-semibold">Bachelor of Computer Applications</span>. It is a 3-year undergraduate degree that offers both theoretical concepts and hands-on experience in computer science.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-[#FFF9E5] p-6 rounded-2xl text-center">
                <Clock className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                <h4 className="font-bold text-[#0B0B3B]">Duration</h4>
                <p className="text-gray-600">3 Years (6 Semesters)</p>
              </div>
              <div className="bg-[#E5F9E5] p-6 rounded-2xl text-center">
                <GraduationCap className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <h4 className="font-bold text-[#0B0B3B]">Eligibility</h4>
                <p className="text-gray-600">12th Pass (Any Stream)</p>
              </div>
              <div className="bg-[#E5E7EB] p-6 rounded-2xl text-center">
                <BookOpen className="w-10 h-10 text-[#0B0B3B] mx-auto mb-3" />
                <h4 className="font-bold text-[#0B0B3B]">Format</h4>
                <p className="text-gray-600">Theoretical Lectures & Hands-on Labs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="py-16 bg-[#FDFDFF]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#0B0B3B] mb-4">Course Objectives</h2>
              <div className="w-20 h-1 bg-[#FF4040] mx-auto rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Essential knowledge and practical skills for software development.",
                "Enhance logical thinking, programming abilities, and problem-solving skills.",
                "Modern teaching methods and industry-oriented practices.",
                "Promote creativity, innovation, and excellence in solution development.",
                "Understanding of computer fundamentals, system concepts, and IT tools.",
                "Develop communication, teamwork, leadership, and analytical skills.",
                "Prepare learners to identify real-world problems and create solutions."
              ].map((obj, i) => (
                <div key={i} className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                  <CheckCircle2 className="w-6 h-6 text-[#0B0B3B] shrink-0 mt-1" />
                  <p className="text-gray-700">{obj}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Admission Process & Eligibility */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-[#0B0B3B] mb-6">Eligibility Criteria</h2>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-700 bg-gray-50 p-4 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-[#FF4040]"></div>
                  12th Pass in any stream (Science / Commerce / Arts)
                </li>
                <li className="flex items-center gap-3 text-gray-700 bg-gray-50 p-4 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-[#FF4040]"></div>
                  Minimum 45% marks (as per college rules)
                </li>
                <li className="flex items-center gap-3 text-gray-700 bg-gray-50 p-4 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-[#FF4040]"></div>
                  Basic computer knowledge preferred (not compulsory)
                </li>
              </ul>

              <h2 className="text-3xl font-bold text-[#0B0B3B] mb-6">Admission Process</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0B0B3B] text-white flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="text-lg font-bold text-[#0B0B3B]">Fill Admission Form</h4>
                    <p className="text-gray-600">Complete the offline admission form available at the college office.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0B0B3B] text-white flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="text-lg font-bold text-[#0B0B3B]">Submit Documents</h4>
                    <p className="text-gray-600">Submit all required original documents along with photocopies.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0B0B3B] text-white flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="text-lg font-bold text-[#0B0B3B]">Confirm Admission</h4>
                    <p className="text-gray-600">Pay the fees (Rs. 15,000) to confirm your seat.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#F0F7FF] p-8 rounded-3xl border border-blue-100">
              <h3 className="text-2xl font-bold text-[#0B0B3B] mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6" />
                Required Documents
              </h3>
              <p className="text-gray-600 mb-4 text-sm">Students must bring all original documents along with 3 photocopies of each.</p>
              <ul className="grid gap-3">
                {[
                  "Passport-size photos",
                  "School Leaving Certificate (LC)",
                  "SSC Marksheet",
                  "HSC Marksheet",
                  "Aadhar Card",
                  "Caste Certificate",
                  "Income Certificate",
                  "Criminal Certificate (if required)",
                  "Migration Certificate (if applicable)"
                ].map((doc, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-lg shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 bg-[#0B0B3B] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Facilities Provided</h2>
            <div className="w-20 h-1 bg-[#FF4040] mx-auto rounded-full"></div>
          </div>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Monitor, title: "Modern Labs", desc: "100+ computers with Wi-Fi & digital learning." },
              { icon: Award, title: "Scholarships", desc: "100% for SC/ST, others as per govt rules." },
              { icon: Users, title: "Expert Faculty", desc: "21+ years of experience & excellent results." },
              { icon: GraduationCap, title: "Training", desc: "Competitive exam & IT field preparation." }
            ].map((fac, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-colors">
                <fac.icon className="w-10 h-10 text-[#FF4040] mb-4" />
                <h4 className="text-xl font-bold mb-2">{fac.title}</h4>
                <p className="text-blue-100">{fac.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-blue-200">
            + Hostel facilities, Sports playgrounds, and various development competitions.
          </p>
        </div>
      </section>

      {/* Syllabus - Premium Horizontal Tabs Design */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B0B3B] mb-4">Course Syllabus</h2>
              <div className="w-24 h-1 bg-[#FF4040] mx-auto rounded-full mb-6"></div>
              <p className="text-gray-600">Select a semester to view the detailed academic curriculum</p>
            </div>

            {/* Desktop View: Tabs & Table (Hidden on Mobile) */}
            <div className="hidden md:block">
              {/* Premium Pilled Tabs Navigation */}
              <div className="flex justify-center mb-12">
                <div className="inline-flex bg-gray-200/50 p-1.5 rounded-2xl overflow-x-auto max-w-full no-scrollbar">
                  {syllabus.map((sem, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveSem(index)}
                      className={`relative px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${activeSem === index
                        ? 'bg-white text-[#0B0B3B] shadow-md scale-100'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                        }`}
                    >
                      {sem.sem}
                      {activeSem === index && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF4040] mx-4 mb-2 rounded-full hidden"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Premium Tab Content */}
              <div className="min-h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSem}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
                  >
                    <div className="p-6 md:p-8 bg-gradient-to-r from-blue-50/80 to-transparent border-b border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#0B0B3B] text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-900/20">
                          {syllabus[activeSem].id}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-[#0B0B3B]">{syllabus[activeSem].sem}</h3>
                          <p className="text-gray-500 text-sm font-medium">Detailed Curriculum</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full overflow-x-auto">
                      <table className="w-full min-w-[800px] text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50/80 sticky top-0 backdrop-blur-sm border-b border-gray-200">
                            {headers.map((head, idx) => (
                              <th key={idx} className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap bg-gray-50">
                                {head}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {syllabus[activeSem].courses.map((course: any, idx) => (
                            <tr key={idx} className="group hover:bg-blue-50/30 transition-colors border-b border-gray-100 last:border-0">
                              {Object.values(course).map((val: any, vIdx) => (
                                <td key={vIdx} className="p-5 text-sm font-medium text-gray-700 whitespace-pre-wrap leading-relaxed">
                                  <span className={vIdx === 2 ? "font-bold text-[#0B0B3B]" : ""}>{val}</span>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile View: Master-Detail Layout */}
            <div className="block md:hidden">
              {/* Master View: List of Semesters */}
              <div className="grid gap-4">
                {syllabus.map((sem, index) => (
                  <div
                    key={index}
                    onClick={() => setMobileActiveSem(index)}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0B0B3B] flex items-center justify-center font-bold text-lg">
                        {sem.id}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#0B0B3B] text-lg">{sem.sem}</h3>
                        <p className="text-gray-500 text-xs font-medium">{sem.courses.length} Subjects • Click for details</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="m9 18 6-6-6-6" /></svg>
                    </div>
                  </div>
                ))}
              </div>

              {/* Detail View: Full Screen Overlay */}
              <AnimatePresence>
                {mobileActiveSem !== null && (
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed inset-0 z-50 bg-[#Fdfdfd] overflow-y-auto"
                  >
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-4 z-10 shadow-sm">
                      <button
                        onClick={() => setMobileActiveSem(null)}
                        className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0B0B3B]"><path d="m15 18-6-6 6-6" /></svg>
                      </button>
                      <div>
                        <h3 className="font-bold text-[#0B0B3B] text-lg">{syllabus[mobileActiveSem].sem}</h3>
                        <p className="text-xs text-gray-500">Detailed Syllabus</p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-4 pb-20">
                      {syllabus[mobileActiveSem].courses.map((course: any, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
                          {/* Header: Category & Title */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <span className="bg-blue-50 text-[#0B0B3B] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                {course.c2}
                              </span>
                              <span className="text-gray-400 text-xs font-semibold">#{course.c1}</span>
                            </div>
                            <h4 className="text-lg font-bold text-[#0B0B3B] leading-tight">{course.c3}</h4>
                          </div>

                          {/* Key Stats Row */}
                          <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-50">
                            <div className="text-center">
                              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">Level</p>
                              <p className="text-sm font-bold text-gray-700">{course.c4}</p>
                            </div>
                            <div className="text-center border-l border-gray-100">
                              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">Credit</p>
                              <p className="text-sm font-bold text-gray-700">{course.c5}</p>
                            </div>
                            <div className="text-center border-l border-gray-100">
                              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">Duration</p>
                              <p className="text-sm font-bold text-gray-700">{course.c10}</p>
                            </div>
                          </div>

                          {/* Teaching Hrs Details */}
                          <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-xs text-center text-gray-600 font-medium">
                              <span className="text-gray-400 mr-1">Teaching Hrs:</span>
                              {course.c6.replace(/\n/g, ", ")}
                            </p>
                          </div>

                          {/* Marks Grid */}
                          <div className="grid grid-cols-3 gap-2">
                            <div className="bg-orange-50 rounded-xl p-2 text-center">
                              <p className="text-[10px] text-orange-400 font-bold mb-1">SEE</p>
                              <p className="text-sm font-bold text-[#0B0B3B]">{course.c7}</p>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-2 text-center">
                              <p className="text-[10px] text-blue-400 font-bold mb-1">CCE</p>
                              <p className="text-sm font-bold text-[#0B0B3B]">{course.c8}</p>
                            </div>
                            <div className="bg-green-50 rounded-xl p-2 text-center">
                              <p className="text-[10px] text-green-500 font-bold mb-1">Total</p>
                              <p className="text-sm font-bold text-[#0B0B3B]">{course.c9}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* Career Opportunities & Fees */}
      <section className="py-16 bg-[#FFF9E5]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-[#0B0B3B] mb-6">Career Opportunities</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Software Developer", "Web Developer", "App Developer",
                  "IT Support Engineer", "Database Administrator", "Computer Operator",
                  "Network Administrator", "Cyber Security Assistant"
                ].map((career, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-orange-100 flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="font-medium text-[#0B0B3B]">{career}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-gray-700">
                Or pursue higher studies like <span className="font-bold">MCA, MSc(IT), MBA</span>.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-[#0B0B3B] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-bl-full -mr-16 -mt-16 z-0"></div>
              <h2 className="text-3xl font-bold text-[#0B0B3B] mb-6 relative z-10">Fee Structure</h2>
              <div className="text-center py-8 relative z-10">
                <p className="text-gray-500 uppercase tracking-widest font-semibold text-sm mb-2">Yearly Fees</p>
                <div className="text-5xl font-extrabold text-[#0B0B3B] mb-2">₹ 30,000</div>
                <p className="text-gray-600 font-medium">₹ 15,000 per semester</p>
              </div>
              <div className="mt-6 text-center text-sm text-gray-500 relative z-10">
                * Fees are subject to change as per college/university regulations.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto bg-gray-50 rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row">
            <div className="p-8 md:p-12 md:w-1/2">
              <h2 className="text-3xl font-bold text-[#0B0B3B] mb-6">Contact for Admission</h2>
              <h3 className="text-xl font-bold text-[#0B0B3B] mb-6">Shree Patel Vidhyarthi Science College, Keshod</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#0B0B3B]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0B0B3B]">Address</h4>
                    <p className="text-gray-600">Veraval road, Behind Maruti Suzuki showroom - Keshod</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#0B0B3B]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0B0B3B]">Phone</h4>
                    <p className="text-gray-600">9687451774</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#0B0B3B]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0B0B3B]">Email</h4>
                    <p className="text-gray-600">pvmbcacollege@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative md:w-1/2 h-[300px] md:h-auto">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3717.689454355406!2d70.24696867384532!3d21.28375677897427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bfd51c1a044a10f%3A0xe5fda820639d2d32!2sPVM%20Computer%20Science%20College%20Keshod!5e0!3m2!1sen!2sin!4v1765452591100!5m2!1sen!2sin"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
