import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

import Dashboard from './pages/Dashboard/Dashboard';
import Birth from './pages/Birth/Birth';
import Death from './pages/Death/Death';
import Marriage from './pages/Marriage/Marriage';
import Divorce from './pages/Divorce/Divorce';
import Reports from './pages/Reports/Reports';
import Users from './pages/Users/Users';
import Settings from './pages/Settings/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/birth" element={<Birth />} />
          <Route path="/death" element={<Death />} />
          <Route path="/marriage" element={<Marriage />} />
          <Route path="/divorce" element={<Divorce />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
