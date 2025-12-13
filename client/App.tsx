import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import BcaCoursePage from "./pages/BcaCoursePage";
import SubmitNewsPage from "./pages/SubmitNewsPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EventsManager from "./pages/admin/EventsManager";
import StudentsManager from "./pages/admin/StudentsManager";
import SettingsManager from "./pages/admin/SettingsManager";
import SectionVisibilityManager from "./pages/admin/SectionVisibilityManager";
import UserManagement from "./pages/admin/UserManagement";
import NewsManager from "./pages/admin/NewsManager";
import ProtectedRoute from "./components/admin/ProtectedRoute";

import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
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
          <Route path="/bca" element={<BcaCoursePage />} />
          <Route path="/submit-news" element={<SubmitNewsPage />} />

          {/* Admin Panel Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/events" element={<ProtectedRoute><EventsManager /></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute><StudentsManager /></ProtectedRoute>} />
          <Route path="/admin/sports" element={<ProtectedRoute><EventsManager /></ProtectedRoute>} />
          <Route path="/admin/workshops" element={<ProtectedRoute><EventsManager /></ProtectedRoute>} />
          <Route path="/admin/news" element={<ProtectedRoute><NewsManager /></ProtectedRoute>} />
          <Route path="/admin/faculty" element={<ProtectedRoute><EventsManager /></ProtectedRoute>} />
          <Route path="/admin/achievements" element={<ProtectedRoute><EventsManager /></ProtectedRoute>} />
          <Route path="/admin/placements" element={<ProtectedRoute><EventsManager /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute><EventsManager /></ProtectedRoute>} />
          <Route path="/admin/visibility" element={<ProtectedRoute><SectionVisibilityManager /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><SettingsManager /></ProtectedRoute>} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
