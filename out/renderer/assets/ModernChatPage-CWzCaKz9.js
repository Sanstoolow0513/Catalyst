import { j as jsxRuntimeExports } from "./mui-vendor-CTE_O7gT.js";
import { r as reactExports, d as dt, l as lt, m as mt } from "./styled-components-eg0Rzwc1.js";
import { b as useConfig } from "./index-C-fhFnDy.js";
import { k as MessageSquare, j as Sparkles, u as Trash2, D as Download, U as User, B as Bot, v as LoaderCircle, w as Send } from "./icons-CcncyDR1.js";
import { m as motion } from "./animation-DwHr2ej_.js";
import "./react-vendor-BS-dYsv0.js";
import "./routing-oDjbPx8E.js";
const pulse = mt`
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
`;
const ModernChatContainer = dt.div`
  height: 100%;
  background: ${(props) => props.theme.background};
  position: relative;
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
  overflow: hidden;
`;
const MainLayout = dt.div`
  display: flex;
  height: 100%;
  position: relative;
  z-index: 1;
  margin: 0;
  padding: 24px;
  gap: 24px;
  width: 100%;
  box-sizing: border-box;
`;
const ChatArea = dt.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.surface};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: ${(props) => props.theme.borderRadius.large};
  box-shadow: ${(props) => props.theme.card.shadow};
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  position: relative;
`;
const ChatHeader = dt.div`
  padding: ${(props) => props.theme.spacing.lg};
  background: ${(props) => props.theme.surface};
  border-bottom: 1px solid ${(props) => props.theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ChatTitle = dt.h1`
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
  color: ${(props) => props.theme.textPrimary};
  display: flex;
  align-items: center;
  gap: 12px;
`;
const ChatActions = dt.div`
  display: flex;
  gap: 12px;
`;
const ModernButton = dt(motion.button)`
  padding: ${(props) => {
  switch (props.$size) {
    case "sm":
      return "8px 16px";
    case "lg":
      return "12px 24px";
    default:
      return "10px 20px";
  }
}};
  border-radius: ${(props) => props.theme.borderRadius.small};
  font-size: ${(props) => {
  switch (props.$size) {
    case "sm":
      return "12px";
    case "lg":
      return "14px";
    default:
      return "13px";
  }
}};
  font-weight: 500;
  transition: all ${(props) => props.theme.transition.normal} ease;
  cursor: pointer;
  border: 1px solid ${(props) => props.theme.border};
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
  
  ${(props) => {
  switch (props.$variant) {
    case "primary":
      return lt`
          background: ${(props2) => props2.theme.primary.main};
          color: ${props.theme.primary.contrastText};
          border-color: ${(props2) => props2.theme.primary.main};
          box-shadow: ${(props2) => props2.theme.button.shadow};
          
          &:hover {
            background: ${(props2) => props2.theme.primary.dark};
            border-color: ${(props2) => props2.theme.primary.dark};
            box-shadow: ${(props2) => props2.theme.button.shadowHover};
          }
        `;
    case "secondary":
      return lt`
          background: ${(props2) => props2.theme.secondary.main};
          color: ${(props2) => props2.theme.secondary.contrastText};
          border-color: ${(props2) => props2.theme.secondary.main};
          box-shadow: ${(props2) => props2.theme.button.shadow};
          
          &:hover {
            background: ${(props2) => props2.theme.secondary.dark};
            border-color: ${(props2) => props2.theme.secondary.dark};
            box-shadow: ${(props2) => props2.theme.button.shadowHover};
          }
        `;
    default:
      return lt`
          background: ${(props2) => props2.theme.surface};
          color: ${(props2) => props2.theme.textSecondary};
          border-color: ${(props2) => props2.theme.border};
          box-shadow: ${(props2) => props2.theme.button.shadow};
          
          &:hover {
            background: ${(props2) => props2.theme.surfaceVariant};
            border-color: ${(props2) => props2.theme.borderLight};
            box-shadow: ${(props2) => props2.theme.button.shadowHover};
          }
        `;
  }
}}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
`;
const MessageArea = dt.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
  
  &::-webkit-scrollbar {
    width: 6px;
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.name === "dark" ? "rgba(59, 130, 246, 0.3)" : "rgba(37, 99, 235, 0.3)"};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme.name === "dark" ? "rgba(59, 130, 246, 0.5)" : "rgba(37, 99, 235, 0.5)"};
  }
  
  -ms-overflow-style: none;
  scrollbar-width: thin;
`;
const MessageContainer = dt(motion.div)`
  display: flex;
  ${(props) => props.$role === "user" ? "justify-content: flex-end" : "justify-content: flex-start"};
  scroll-behavior: smooth;
  max-width: 100%;
`;
const MessageBubble = dt(motion.div)`
  max-width: 70%;
  padding: 16px 20px;
  border-radius: ${(props) => props.theme.borderRadius.large};
  position: relative;
  word-wrap: break-word;
  overflow-wrap: break-word;
  border: 1px solid ${(props) => props.theme.border};
  
  ${(props) => {
  if (props.$role === "user") {
    return lt`
        background: ${(props2) => props2.theme.primary.main};
        color: ${(props2) => props2.theme.primary.contrastText};
        border-color: ${(props2) => props2.theme.primary.main};
        box-shadow: ${(props2) => props2.theme.button.shadow};
        border-bottom-right-radius: ${(props2) => props2.theme.borderRadius.small};
      `;
  } else if (props.$role === "assistant") {
    return lt`
        background: ${(props2) => props2.theme.surfaceVariant};
        color: ${(props2) => props2.theme.textPrimary};
        border-color: ${(props2) => props2.theme.border};
        box-shadow: ${(props2) => props2.theme.button.shadow};
        border-bottom-left-radius: ${(props2) => props2.theme.borderRadius.small};
      `;
  } else {
    return lt`
        background: ${(props2) => props2.theme.surfaceVariant};
        color: ${(props2) => props2.theme.textSecondary};
        border-color: ${(props2) => props2.theme.borderLight};
        font-style: italic;
        border-radius: ${(props2) => props2.theme.borderRadius.medium};
      `;
  }
}}
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${(props) => props.theme.button.shadowHover};
  }
`;
const MessageHeader = dt.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => props.theme.textSecondary};
`;
const MessageContent = dt.div`
  line-height: 1.6;
  word-wrap: break-word;
  overflow-wrap: break-word;
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
  
  /* 优化长文本和代码块 */
  white-space: pre-wrap;
  word-break: break-word;
  
  code {
    background: ${(props) => props.theme.surfaceVariant};
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
    font-size: 0.9em;
    color: ${(props) => props.theme.textPrimary};
  }
  
  pre {
    background: ${(props) => props.theme.surfaceVariant};
    padding: 12px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 8px 0;
    border: 1px solid ${(props) => props.theme.border};
    font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
    
    /* 隐藏代码块的滚动条 */
    &::-webkit-scrollbar {
      height: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: ${(props) => props.theme.border};
      border-radius: 2px;
    }
  }
  
  /* 优化链接样式 */
  a {
    color: ${(props) => props.theme.primary.main};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  /* 优化列表样式 */
  ul, ol {
    margin: 8px 0;
    padding-left: 20px;
  }
  
  li {
    margin: 4px 0;
  }
`;
const InputArea = dt.div`
  padding: ${(props) => props.theme.spacing.lg};
  background: ${(props) => props.theme.surface};
  border-top: 1px solid ${(props) => props.theme.border};
  flex-shrink: 0;
`;
const InputContainer = dt(motion.div)`
  display: flex;
  gap: 12px;
  align-items: flex-end;
  background: ${(props) => props.theme.surfaceVariant};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: ${(props) => props.theme.borderRadius.large};
  padding: ${(props) => props.theme.spacing.md};
  box-shadow: ${(props) => props.theme.input.shadow};
  
  &:focus-within {
    border-color: ${(props) => props.theme.input.borderFocus};
    box-shadow: ${(props) => props.theme.button.shadowHover};
  }
`;
const ChatInput = dt.textarea`
  flex: 1;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.input.background};
  color: ${(props) => props.theme.input.text};
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  outline: none;
  padding: 12px 16px;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  max-height: 120px;
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
  transition: all ${(props) => props.theme.transition.normal} ease;
  
  scroll-behavior: smooth;
  
  &::placeholder {
    color: ${(props) => props.theme.input.placeholder};
  }
  
  &:focus {
    border-color: ${(props) => props.theme.input.borderFocus};
    box-shadow: ${(props) => props.theme.button.shadowHover};
  }
  
  &::-webkit-scrollbar {
    width: 6px;
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.borderLight};
    border-radius: 3px;
  }
  
  -ms-overflow-style: none;
  scrollbar-width: thin;
`;
const SendButton = dt(motion.button)`
  width: 48px;
  height: 48px;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  border: 1px solid ${(props) => props.$disabled ? props.theme.borderLight : props.theme.primary.main};
  background: ${(props) => props.$disabled ? props.theme.surfaceVariant : props.theme.primary.main};
  color: ${(props) => props.$disabled ? props.theme.textTertiary : props.theme.primary.contrastText};
  cursor: ${(props) => props.$disabled ? "not-allowed" : "pointer"};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${(props) => props.theme.transition.normal} ease;
  box-shadow: ${(props) => props.$disabled ? "none" : props.theme.button.shadow};
  
  &:hover:not(:disabled) {
    background: ${(props) => props.theme.primary.dark};
    border-color: ${(props) => props.theme.primary.dark};
    box-shadow: ${(props) => props.theme.button.shadowHover};
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;
const LoadingDots = dt.div`
  display: flex;
  gap: 4px;
  align-items: center;
  
  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(props) => props.theme.primary.main};
    animation: ${pulse} 1.4s ease-in-out infinite;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
    &:nth-child(3) { animation-delay: 0s; }
  }
`;
const ModernChatPage = () => {
  const { isConfigValid, getLLMRequestConfig, isLoading: configLoading } = useConfig();
  const [messages, setMessages] = reactExports.useState([]);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [inputMessage, setInputMessage] = reactExports.useState("");
  const handleSendMessage = reactExports.useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return;
    if (!isConfigValid) {
      setError("请先在 LLM 配置页面设置有效的配置");
      return;
    }
    const userMessage = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setError(null);
    try {
      const config = getLLMRequestConfig();
      if (!config) {
        throw new Error("无法获取有效的LLM配置");
      }
      const configResult = await window.electronAPI.llm.setProviderConfig({
        provider: config.provider,
        baseUrl: config.baseUrl,
        apiKey: config.apiKey
      });
      if (!configResult.success) {
        throw new Error(configResult.error || "Failed to set provider config");
      }
      const params = {
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        top_p: config.topP
      };
      const request = {
        provider: config.provider,
        model: config.model,
        messages: [{ role: "system", content: config.systemPrompt }, ...messages, userMessage],
        params
      };
      const result = await window.electronAPI.llm.generateCompletion(request);
      if (result.success && result.data) {
        const assistantMessage = { role: "assistant", content: result.data };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        setError(result.error || "Failed to get response from LLM");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(`An unexpected error occurred: ${errorMessage}`);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading, isConfigValid, messages]);
  const clearMessages = reactExports.useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);
  const handleKeyPress = reactExports.useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ModernChatContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(MainLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    ChatArea,
    {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, delay: 0.3 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(ChatHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(ChatTitle, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 24 }),
            "AI 助手",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 20, style: { animation: "pulse 2s ease-in-out infinite" } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(ChatActions, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(ModernButton, { $variant: "ghost", $size: "sm", onClick: clearMessages, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 }),
              "清空"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(ModernButton, { $variant: "secondary", $size: "sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 16 }),
              "导出"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(MessageArea, { children: [
          reactExports.useMemo(() => messages.map((message, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            MessageContainer,
            {
              $role: message.role,
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.4, delay: index * 0.1 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                MessageBubble,
                {
                  $role: message.role,
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(MessageHeader, { children: [
                      message.role === "user" ? /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { size: 14 }),
                      message.role === "user" ? "您" : "AI助手"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MessageContent, { children: message.content })
                  ]
                }
              )
            },
            index
          )), [messages]),
          isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
            MessageContainer,
            {
              $role: "assistant",
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.4 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(MessageBubble, { $role: "assistant", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(MessageHeader, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { size: 14 }),
                  "AI助手"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(LoadingDots, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
                ] })
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(InputArea, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            InputContainer,
            {
              whileHover: { scale: 1.01 },
              whileTap: { scale: 0.99 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ChatInput,
                  {
                    value: inputMessage,
                    onChange: (e) => setInputMessage(e.target.value),
                    onKeyPress: handleKeyPress,
                    placeholder: "输入您的问题...",
                    disabled: isLoading,
                    rows: 1
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SendButton,
                  {
                    onClick: handleSendMessage,
                    disabled: !inputMessage.trim() || isLoading,
                    whileHover: { scale: 1.1 },
                    whileTap: { scale: 0.9 },
                    children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 20, style: { animation: "pulse 1s ease-in-out infinite" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 20 })
                  }
                )
              ]
            }
          ),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            marginTop: "12px",
            color: "#ef4444",
            fontSize: "14px",
            fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
            background: "rgba(239, 68, 68, 0.1)",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid rgba(239, 68, 68, 0.2)"
          }, children: error })
        ] })
      ]
    }
  ) }) });
};
export {
  ModernChatPage as default
};
