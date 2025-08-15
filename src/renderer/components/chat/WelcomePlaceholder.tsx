import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const PlaceholderContainer = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  color: ${({ theme }) => theme.textTertiary};
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 16px;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  max-width: 400px;
  line-height: 1.6;
`;

const WelcomePlaceholder = () => {
  return (
    <PlaceholderContainer
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Title>欢迎使用 AI 对话</Title>
      <Subtitle>
        请在左侧配置面板中填写提供商、Base URL、API Key 和模型名称，然后开始对话。
      </Subtitle>
    </PlaceholderContainer>
  );
};

export default WelcomePlaceholder;