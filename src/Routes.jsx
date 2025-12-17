import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import UserLogin from './pages/user-login';
import AdminPanel from './pages/admin-panel';
import AppointmentManagement from './pages/appointment-management';
import LandingPage from './pages/landing-page';
import UserProfileSettings from './pages/user-profile-settings';
import BusinessDashboard from './pages/business-dashboard';
import BusinessHelpPage from './pages/business-help';
import RegisterPage from './pages/register';
import AboutUsPage from './pages/about-us';
import FeaturesPage from './pages/features';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your route here */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/appointment-management" element={<AppointmentManagement />} />
          <Route path="/landing-page" element={<LandingPage />} />
          <Route path="/user-profile-settings" element={<UserProfileSettings />} />
          <Route path="/business-dashboard" element={<BusinessDashboard />} />
          <Route path="/business-help" element={<BusinessHelpPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/nosotros" element={<AboutUsPage />} />
          <Route path="/funcionalidades" element={<FeaturesPage />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
