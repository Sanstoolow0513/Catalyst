import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  padding: 2rem;
  text-align: center;
  background: ${props => props.theme.surface};
  border-radius: ${props => props.theme.borderRadius.large};
  border: 1px solid ${props => props.theme.error.main};
  margin: 2rem;
`;

const ErrorTitle = styled.h2`
  color: ${props => props.theme.error.main};
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.textSecondary};
  margin-bottom: 1rem;
`;

const ErrorDetails = styled.pre`
  background: ${props => props.theme.surfaceVariant};
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  text-align: left;
  font-size: 0.875rem;
  overflow-x: auto;
  margin-top: 1rem;
`;

const RetryButton = styled.button`
  background: ${props => props.theme.primary.main};
  color: ${props => props.theme.primary.contrastText};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  
  &:hover {
    background: ${props => props.theme.primary.dark};
  }
`;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <ErrorTitle>出现错误</ErrorTitle>
          <ErrorMessage>
            抱歉，应用程序遇到了一个错误。请刷新页面或重试。
          </ErrorMessage>
          <RetryButton onClick={this.handleRetry}>
            重试
          </RetryButton>
          {this.state.error && this.state.errorInfo && (
            <ErrorDetails>
              <strong>错误详情:</strong>
              <br />
              {this.state.error.toString()}
              <br />
              <br />
              <strong>组件堆栈:</strong>
              <br />
              {this.state.errorInfo.componentStack}
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;