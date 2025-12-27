import Header from '@/components/Header';
import { Hero as HeroSection } from '@/components/Hero';
import StatsSection from '@/components/StatsSection';
import FeatureCards from '@/components/FeatureCards';
import AboutSection from '@/components/AboutSection';
import AcademicsSection from '@/components/AcademicsSection';
import AdmissionJourney from '@/components/AdmissionJourney';
// import AdmissionSection from '@/components/AdmissionSection'; // Replaced
import EventHighlights from '@/components/EventHighlights';
import TopStudents from '@/components/TopStudents';
import Footer from '@/components/Footer';

import { useSectionVisibility } from '@/hooks/useSectionVisibility';

export default function Index() {
  const { isVisible } = useSectionVisibility();

  return (
    <div className="min-h-screen bg-white font-poppins">
      <Header />
      {isVisible('homeHero') && <HeroSection />}
      {isVisible('homeStats') && <StatsSection />}
      {isVisible('featureCards') && <FeatureCards />}
      {isVisible('aboutSection') && <AboutSection />}
      {isVisible('academicsSnapshot') && <AcademicsSection />}
      {isVisible('admissionJourney') && <AdmissionJourney />}
      {isVisible('eventHighlights') && <EventHighlights />}
      {isVisible('topStudents') && <TopStudents />}
      <Footer />
    </div>
  );
}
