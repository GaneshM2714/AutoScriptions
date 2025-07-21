// src/pages/HomePage.jsx
import HeroSection from './components/HeroSection';
import FeatureSection from './components/FeatureSection';
import HowItWorksSection from './components/HowItWorks';
import CallToActionBanner from './components/CallToActionBanner';
import Footer from './components/Footer';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <HowItWorksSection />
      <CallToActionBanner />
      <Footer />
    </>
  );
}
