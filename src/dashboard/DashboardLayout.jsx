import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../component/Sidebar';

function DashboardLayout() {
  return (
    <div className="flex">
      {/* <Sidebars /> */}
      <main className="flex-1 justify-center items-center">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
