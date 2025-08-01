import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="nav-bar">
      <div className="nav-buttons">
        <Link to="/" className="nav-btn">
          <i className="icon-home"></i> 主页
        </Link>
        <Link to="/chat" className="nav-btn">
          <i className="icon-chat"></i> AI聊天
        </Link>
        <Link to="/settings" className="nav-btn">
          <i className="icon-settings"></i> 系统设置
        </Link>
      </div>
    </nav>
  );
};

export { NavBar };