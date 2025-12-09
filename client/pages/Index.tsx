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

export default function Index() {
  return (
    <div className="min-h-screen bg-white font-poppins">
      <Header />
      <HeroSection />
      {/* <StatsSection /> */}
      <FeatureCards />
      <AboutSection />
      <AcademicsSection />
      <AdmissionJourney />
      <HighlightsSection />
      <Footer />
    </div>
  );
}
