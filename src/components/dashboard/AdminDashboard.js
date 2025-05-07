import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AdminLayout from './admin/AdminLayout';
import DashboardOverview from './admin/DashboardOverview';
import ProjectsSection from './admin/ProjectsSection';
import TasksSection from './admin/TasksSection';
import CollaborationPage from './admin/CollaborationPage';
import AdminProfile from './admin/AdminProfile';
import AdminProfileEdit from './admin/AdminProfileEdit';

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
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location]);

  const MainContent = () => (
    <>
      <DashboardOverview />
      <ProjectsSection />
      <TasksSection projects={projects} />
    </>
  );

  return (
    <AdminLayout>
      <Routes>
        <Route path="collaboration" element={<CollaborationPage />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="profile/edit" element={<AdminProfileEdit />} />
        <Route path="*" element={<MainContent />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;