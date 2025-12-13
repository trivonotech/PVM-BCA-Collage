import Header from '@/components/Header';
import { Hero as HeroSection } from '@/components/Hero';
import StatsSection from '@/components/StatsSection';
import FeatureCards from '@/components/FeatureCards';
import AboutSection from '@/components/AboutSection';
import AcademicsSection from '@/components/AcademicsSection';
import AdmissionJourney from '@/components/AdmissionJourney';
// import AdmissionSection from '@/components/AdmissionSection'; // Replaced
import HighlightsSection from '@/components/HighlightsSection';
import Footer from '@/components/Footer';

import { useSectionVisibility } from '@/hooks/useSectionVisibility';

export default function Index() {
  const { isVisible } = useSectionVisibility();

  return (
    <div className="min-h-screen bg-white font-poppins">
      <Header />
      {isVisible('homeHero') && <HeroSection />}
      {/* <StatsSection /> */}
      {isVisible('featureCards') && <FeatureCards />}
      {isVisible('aboutSection') && <AboutSection />}
      {isVisible('academicsSnapshot') && <AcademicsSection />}
      {isVisible('admissionJourney') && <AdmissionJourney />}
      {isVisible('eventHighlights') && <HighlightsSection />}
      {/* Top Students section appears missing from Index.tsx but is in Manager. 
          If it's inside another component or missing, I can't wrap it yet. 
          Assuming it might be part of Highlights or separate. leaving it for now. */}
      <Footer />
    </div>
  );
}
