import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './unauthorized/Home';
import LoginPage from './unauthorized/LoginPage';
import SignUp from './unauthorized/SignUp';
import DashboardHome from './dashboard/Dashboard'; // Your main dashboard content
import DashboardLayout from './dashboard/DashboardLayout';
import ForgotPassword from './unauthorized/ForgotPassword';

import { UserAuth } from "./context/AuthContext";
import LogoutButton from './component/SignOut';

function App() {
  const { session } = UserAuth();

  return (
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={session ? <Navigate to="/dashboard" /> : <Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signout" element={<LogoutButton />} />
        <Route path="/update-password" element={<ForgotPassword />} />

        {/* Protected Routes wrapped inside DashboardLayout */}
        {session && (
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />            
          </Route>
        )}

        {/* Catch non-authenticated access to /dashboard */}
        {!session && (
          <Route path="/dashboard/*" element={<Navigate to="/login" />} />
        )}
      </Routes>
  );
}

export default App;
