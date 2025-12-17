import React from 'react';
import NavigationBar from '../../components/layout/NavigationBar';
import HeroSection from './components/HeroSection';
import FeaturesSplitSection from './components/FeaturesSplitSection';
import BusinessSection from './components/BusinessSection';
import FeaturesPreviewSection from './components/FeaturesPreviewSection';
import FooterSection from '../../components/layout/FooterSection';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <NavigationBar />
      <HeroSection />
      <FeaturesSplitSection />
      <BusinessSection />
      <FeaturesPreviewSection />
      <FooterSection />
    </div>
  );
};

export default LandingPage;