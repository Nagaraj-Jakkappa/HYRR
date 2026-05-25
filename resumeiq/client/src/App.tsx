import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ResumesPage from './pages/ResumesPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import ScanPage from './pages/ScanPage';
import ScanResultPage from './pages/ScanResultPage';
import AdminPage from './pages/AdminPage';
import HistoryPage from './pages/HistoryPage';
import ComparePage from './pages/ComparePage';
import SettingsPage from './pages/SettingsPage';
import ReportPage from './pages/ReportPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import Layout from './components/ui/Layout';
import DemoPage from './pages/DemoPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import PricingPage from './pages/PricingPage';

const Protected = ({ children, adminOnly = false }: { children: any; adminOnly?: boolean }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A0A0F]">
      <div className="w-8 h-8 border-2 border-[#5B5FEF] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return children;
};

import React, { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    const theme = localStorage.getItem('hyrr_theme');
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, []);

  return (
    <AuthProvider>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#f1f1f1',
            border: '1px solid rgba(255,255,255,0.08)'
          }
        }}
      />
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/report/:id" element={<ReportPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        {/* --- PROTECTED ROUTES --- */}
        <Route element={<Protected><Layout /></Protected>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/resumes" element={<ResumesPage />} />
          <Route path="/builder" element={<ResumeBuilderPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/compare" element={<ComparePage />} />

          {/* Feature 2: Optimization Scan Flow Routes */}
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/scan/results/:id" element={<ScanResultPage />} />

          <Route path="/settings" element={<SettingsPage />} />

          {/* Admin specific protection */}
          <Route
            path="/admin"
            element={
              <Protected adminOnly>
                <AdminPage />
              </Protected>
            }
          />
        </Route>

        {/* --- 404 NOT FOUND --- */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
  );
};

export default App;