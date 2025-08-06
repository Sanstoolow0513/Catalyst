import React from 'react';
import ArcSidebar from './ArcSidebar';
import CommandPalette from '../components/CommandPalette';
import { CommandPaletteProvider } from '../hooks/useCommandPalette';

const MainLayout = ({ children }) => {
  return (
    <CommandPaletteProvider>
      <div className="app-container">
        <ArcSidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
      {/* 全局命令面板（Portal 挂载，快捷键：Ctrl/Cmd + K） */}
      <CommandPalette />
    </CommandPaletteProvider>
  );
};

export { MainLayout };