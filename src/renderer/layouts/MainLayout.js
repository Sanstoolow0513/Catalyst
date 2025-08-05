import React from 'react';
import ArcSidebar from './ArcSidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <ArcSidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export { MainLayout };