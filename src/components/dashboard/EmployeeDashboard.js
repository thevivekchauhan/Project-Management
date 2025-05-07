import { Routes, Route } from 'react-router-dom';
import EmployeeLayout from './employee/EmployeeLayout';
import Dashboard from './employee/Dashboard';

const EmployeeDashboard = () => {
  return (
    <EmployeeLayout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </EmployeeLayout>
  );
};

export default EmployeeDashboard; 