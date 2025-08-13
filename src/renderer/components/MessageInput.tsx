import React, { useState, KeyboardEvent } from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px; /* 调整间距 */
  padding: 20px; /* 调整 padding */
  border-top: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.foreground}; /* 使用 foreground 作为背景 */
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 10px; /* 调整间距 */
  align-items: flex-end;
`;

const TextArea = styled.textarea`
  flex: 1;
  min-height: 60px;
  max-height: 120px;
  padding: 15px; /* 调整 padding */
  border: 1px solid ${({ theme }) => theme.inputBorder}; /* 使用新的 inputBorder */
  border-radius: 8px;
  background-color: ${({ theme }) => theme.inputBackground}; /* 使用新的 inputBackground */
  color: ${({ theme }) => theme.textPrimary}; /* 使用新的 textPrimary */
  resize: vertical;
  font-family: inherit;
  font-size: 0.95rem; /* 调整字体大小 */
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.inputFocusBorder}; /* 使用新的 inputFocusBorder */
    box-shadow: 0 0 0 2px ${({ theme }) => theme.accent}40; /* 添加阴影 */
  }
`;

const SendButton = styled.button`
  background-color: ${({ theme }) => theme.accent};
  color: white;
  border: none;
  padding: 15px 25px; /* 调整 padding */
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  height: fit-content;
  transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out; /* 添加过渡 */
  
  &:hover {
    background-color: ${({ theme }) => theme.accentHover}; /* 使用新的 accentHover */
  }
  
  &:disabled {
    opacity: 0.6; /* 调整透明度 */
    cursor: not-allowed;
  }
`;

const ParamsContainer = styled.div`
  display: flex;
  gap: 10px; /* 调整间距 */
  flex-wrap: wrap;
  align-items: center;
`;

const ParamGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px; /* 调整间距 */
`;

const ParamLabel = styled.label`
  font-size: 0.85rem; /* 调整字体大小 */
  color: ${({ theme }) => theme.textSecondary}; /* 使用新的 textSecondary */
  white-space: nowrap;
`;

const ParamInput = styled.input`
  padding: 8px; /* 调整 padding */
  border: 1px solid ${({ theme }) => theme.inputBorder}; /* 使用新的 inputBorder */
  border-radius: 4px;
  background-color: ${({ theme }) => theme.inputBackground}; /* 使用新的 inputBackground */
  color: ${({ theme }) => theme.textPrimary}; /* 使用新的 textPrimary */
  font-size: 0.85rem; /* 调整字体大小 */
  width: 70px; /* 调整宽度 */
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.inputFocusBorder}; /* 使用新的 inputFocusBorder */
    box-shadow: 0 0 0 2px ${({ theme }) => theme.accent}40; /* 添加阴影 */
  }
`;

interface MessageInputProps {
  onSendMessage: (message: string, params: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    max_tokens?: number;
  }) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [top_p, setTopP] = useState(1.0);
  const [top_k, setTopK] = useState(40);
  const [max_tokens, setMaxTokens] = useState(2048);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim(), {
        temperature,
        top_p,
        top_k,
        max_tokens,
      });
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <InputContainer>
      <ParamsContainer>
        <ParamGroup>
          <ParamLabel>Temp:</ParamLabel>
          <ParamInput
            type="number"
            min="0"
            max="2"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            disabled={disabled}
          />
        </ParamGroup>
        <ParamGroup>
          <ParamLabel>Top P:</ParamLabel>
          <ParamInput
            type="number"
            min="0"
            max="1"
            step="0.1"
            value={top_p}
            onChange={(e) => setTopP(parseFloat(e.target.value))}
            disabled={disabled}
          />
        </ParamGroup>
        <ParamGroup>
          <ParamLabel>Top K:</ParamLabel>
          <ParamInput
            type="number"
            min="0"
            max="100"
            step="1"
            value={top_k}
            onChange={(e) => setTopK(parseInt(e.target.value))}
            disabled={disabled}
          />
        </ParamGroup>
        <ParamGroup>
          <ParamLabel>Max Tokens:</ParamLabel>
          <ParamInput
            type="number"
            min="1"
            max="4096"
            step="1"
            value={max_tokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
            disabled={disabled}
          />
        </ParamGroup>
      </ParamsContainer>
      <InputWrapper>
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          disabled={disabled}
        />
        <SendButton onClick={handleSend} disabled={!message.trim() || disabled}>
          Send
        </SendButton>
      </InputWrapper>
    </InputContainer>
  );
};

export default MessageInput;
