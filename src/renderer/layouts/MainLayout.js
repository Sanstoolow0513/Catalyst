import React from 'react';
import { NavBar } from './NavBar';

const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <NavBar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export { MainLayout };