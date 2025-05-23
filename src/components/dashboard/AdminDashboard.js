import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AdminLayout from './admin/AdminLayout';
import DashboardOverview from './admin/DashboardOverview';
import ProjectsSection from './admin/ProjectsSection';
import CollaborationPage from './admin/CollaborationPage';
import AdminProfile from './admin/AdminProfile';
import AdminProfileEdit from './admin/AdminProfileEdit';
import MessagesSection from './admin/MessagesSection';
import Activities from './admin/Activities';

const AdminDashboard = () => {
  const location = useLocation();
  const projects = [
    { id: 1, name: 'Website Redesign' },
    { id: 2, name: 'Mobile App Development' },
    { id: 3, name: 'Database Migration' },
    { id: 4, name: 'Security Audit' },
    { id: 5, name: 'UI/UX Improvements' },
  ];

  useEffect(() => {
    // Handle hash navigation when the component mounts or location changes
    if (location.hash) {
      // Wait for components to fully render before scrolling
      setTimeout(() => {
        const element = document.getElementById(location.hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          console.log(`Element with id ${location.hash.substring(1)} not found`);
          // Try again with a longer delay if element not found
          setTimeout(() => {
            const retryElement = document.getElementById(location.hash.substring(1));
            if (retryElement) {
              retryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 500);
        }
      }, 300);
    }
  }, [location]);

  const MainContent = () => (
    <>
      <DashboardOverview />
      <ProjectsSection />
    </>
  );

  return (
    <AdminLayout>
      <Routes>
        <Route path="collaboration" element={<CollaborationPage />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="profile/edit" element={<AdminProfileEdit />} />
        <Route path="messages" element={<MessagesSection />} />
        <Route path="activities" element={<Activities />} />
        <Route path="*" element={<MainContent />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;