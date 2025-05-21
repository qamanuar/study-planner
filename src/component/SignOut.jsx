// LogoutButton.jsx (or inside Sidebar.jsx or DashboardLayout.jsx)

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

function LogoutButton() {
  const { signOut } = UserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login'); // Redirect to login after logout
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-white bg-red-600 w-4/5 hover:text-white hover:bg-red-700 hover:text-gray-100 transition rounded-xl py-1 px-2"
    >
      Logout
    </button>
  );
}

export default LogoutButton;
