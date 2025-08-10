import React, { useContext } from 'react';
import styled from 'styled-components';
import MainLayout from './layouts/MainLayout';
import { ThemeContext } from './contexts/ThemeContext';
import SystemProxyPage from './pages/SystemProxyPage';

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  margin: 0;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.accent};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    opacity: 0.9;
  }
`;

function App() {
  const themeContext = useContext(ThemeContext);
  
  if (!themeContext) {
    // This should never happen if the provider is correctly set up
    return <div>Error: Theme context is not available.</div>;
  }

  const { toggleTheme } = themeContext;

  return (
    <MainLayout>
      <Header>
        <Title>My App</Title>
        <Button onClick={toggleTheme}>Toggle Theme</Button>
      </Header>
      <SystemProxyPage />
    </MainLayout>
  );
}

export default App;
