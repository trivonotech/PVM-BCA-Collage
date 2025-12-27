import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import AcademicsPage from "./pages/AcademicsPage";
import AdmissionsPage from "./pages/AdmissionsPage";
import StudentLifePage from "./pages/StudentLifePage";
import ExaminationPage from "./pages/ExaminationPage";
import PlacementsPage from "./pages/PlacementsPage";
import NewsPage from "./pages/NewsPage";
import NewsDetailPage from "./pages/NewsDetailPage";
import StudentCornerPage from "./pages/StudentCornerPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import CourseDetailPage from "./pages/CourseDetailPage";
import SubmitNewsPage from "./pages/SubmitNewsPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EventsManager from "./pages/admin/EventsManager";
import StudentsManager from "./pages/admin/StudentsManager";
import InquiriesManager from "./pages/admin/InquiriesManager";
import SettingsManager from "./pages/admin/SettingsManager";
import SectionVisibilityManager from "./pages/admin/SectionVisibilityManager";
import UserManagement from "./pages/admin/UserManagement";
import SubscribersManager from "./pages/admin/SubscribersManager";
import NewsManager from "./pages/admin/NewsManager";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import PlaceholderPage from "./pages/admin/PlaceholderPage";
import PlacementsManager from "./pages/admin/PlacementsManager";
import SEOManager from "./pages/admin/SEOManager";
import BackupManager from "./pages/admin/BackupManager";


import ScrollToTop from "./components/ScrollToTop";

import { usePageTracker } from "@/hooks/usePageTracker";
import { lazy, Suspense } from "react";
import { GlobalErrorBoundary } from "@/components/GlobalErrorBoundary";
import { SecurityMonitor } from "@/components/SecurityMonitor";
import SchemaData from "@/components/SchemaData";

const PageContentManager = lazy(() => import("./pages/admin/PageContentManager"));
const AdmissionsManager = lazy(() => import("./pages/admin/AdmissionsManager"));
const CoursesManager = lazy(() => import("./pages/admin/CoursesManager"));
const WorkshopsManager = lazy(() => import("./pages/admin/WorkshopsManager"));
const SystemHealth = lazy(() => import("@/pages/admin/SystemHealth"));

const PageEditor = lazy(() => import("./pages/admin/editors/PageEditor"));

const queryClient = new QueryClient();

function AppContent() {
  usePageTracker();
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/academics" element={<AcademicsPage />} />
          <Route path="/admissions" element={<AdmissionsPage />} />
          <Route path="/student-life" element={<StudentLifePage />} />
          <Route path="/examinations" element={<ExaminationPage />} />
          <Route path="/placements" element={<PlacementsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/student-corner" element={<StudentCornerPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/submit-news" element={<SubmitNewsPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />

          {/* Admin Panel Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

          <Route path="/admin/events" element={<ProtectedRoute><EventsManager pageTitle="Events Management" /></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute><StudentsManager /></ProtectedRoute>} />
          <Route path="/admin/admissions" element={<ProtectedRoute><AdmissionsManager /></ProtectedRoute>} />
          <Route path="/admin/sports" element={<ProtectedRoute><EventsManager pageTitle="Sports Management" defaultCategory="Sports" /></ProtectedRoute>} />
          <Route path="/admin/workshops" element={<ProtectedRoute><WorkshopsManager /></ProtectedRoute>} />
          <Route path="/admin/news" element={<ProtectedRoute><NewsManager /></ProtectedRoute>} />
          <Route path="/admin/faculty" element={<ProtectedRoute><PlaceholderPage title="Faculty Management" /></ProtectedRoute>} />
          <Route path="/admin/achievements" element={<ProtectedRoute><EventsManager pageTitle="Achievements Management" defaultCategory="Achievement" /></ProtectedRoute>} />
          <Route path="/admin/placements" element={<ProtectedRoute><PlacementsManager /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute><CoursesManager /></ProtectedRoute>} />
          <Route path="/admin/pages" element={<ProtectedRoute><PageContentManager /></ProtectedRoute>} />
          <Route path="/admin/visibility" element={<ProtectedRoute><SectionVisibilityManager /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><SettingsManager /></ProtectedRoute>} />
          <Route path="/admin/system" element={<ProtectedRoute><SystemHealth /></ProtectedRoute>} />
          <Route path="/admin/inquiries" element={<ProtectedRoute><InquiriesManager /></ProtectedRoute>} />
          <Route path="/admin/subscribers" element={<ProtectedRoute><SubscribersManager /></ProtectedRoute>} />
          <Route path="/admin/seo" element={<ProtectedRoute><SEOManager /></ProtectedRoute>} />
          <Route path="/admin/backup" element={<ProtectedRoute><BackupManager /></ProtectedRoute>} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <SecurityMonitor>
          <GlobalErrorBoundary>
            <SchemaData />
            <AppContent />
          </GlobalErrorBoundary>
        </SecurityMonitor>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
