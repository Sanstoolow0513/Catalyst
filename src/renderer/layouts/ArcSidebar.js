import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/sidebar.css';

const ArcSidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('chat');

  // 功能区配置
  const sections = [
    { id: 'chat', icon: 'chat.svg', label: '聊天' },
    { id: 'clash', icon: 'clash.svg', label: 'Clash' },
    { id: 'monitor', icon: 'monitor.svg', label: '系统监控' },
    { id: 'install', icon: 'install.svg', label: '软件安装' }
  ];

  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
  };

  return (
    <div 
      className={`arc-sidebar ${expanded ? 'expanded' : ''}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="sidebar-header">
        <div className="app-logo" />
      </div>
      
      <div className="sidebar-sections">
        {sections.map((section) => (
          <NavLink
            key={section.id}
            to={`/${section.id}`}
            className={`section-item ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => handleSectionClick(section.id)}
          >
            <div className="icon-container">
              <img 
                src={`/src/renderer/assets/icons/${section.icon}`} 
                alt={section.label} 
              />
            </div>
            {expanded && <span className="section-label">{section.label}</span>}
          </NavLink>
        ))}
      </div>
      
      <div className="sidebar-footer">
        <button className="settings-button">
          <img src="/src/renderer/assets/icons/settings.svg" alt="设置" />
          {expanded && <span>设置</span>}
        </button>
      </div>
    </div>
  );
};

export default ArcSidebar;