import React from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.aside`
  width: 240px;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.sidebar};
  padding: 1rem;
  border-right: 1px solid ${({ theme }) => theme.border};
`;

const NavItem = styled.a`
  display: block;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  margin-bottom: 1rem;
  font-weight: 500;

  &:hover {
    color: ${({ theme }) => theme.accent};
  }
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <NavItem href="#">Home</NavItem>
      <NavItem href="#">System Proxy</NavItem>
      <NavItem href="#">LLM Chat</NavItem>
      <NavItem href="#">Settings</NavItem>
    </SidebarContainer>
  );
};

export default Sidebar;