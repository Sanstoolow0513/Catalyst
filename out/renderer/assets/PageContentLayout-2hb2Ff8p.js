import { d as dt, a as React } from "./styled-components-eg0Rzwc1.js";
import { j as jsxRuntimeExports } from "./mui-vendor-CTE_O7gT.js";
import { m as motion } from "./animation-DwHr2ej_.js";
import { X, I as Info, p as CircleX, i as CircleCheckBig } from "./icons-CcncyDR1.js";
const PageContainer = dt.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
  width: 100%;
  background-color: ${(props) => props.theme?.background || "#F9FAFB"};
  color: ${(props) => props.theme?.textPrimary || "#111827"};
  padding: ${(props) => props.theme?.spacing?.xl || "32px"};
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme?.border || "#E5E7EB"};
    border-radius: 4px;
    
    &:hover {
      background: ${(props) => props.theme?.textTertiary || "#9CA3AF"};
    }
  }
`;
const StyledButton = dt(motion.button)`
  text-transform: none;
  font-weight: 500;
  border-radius: ${(props) => props.theme.borderRadius.small};
  transition: all ${(props) => props.theme.transition.fast} ease;
  position: relative;
  overflow: hidden;
  border: none;
  cursor: pointer;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  /* 变体样式 */
  ${(props) => {
  switch (props.variant) {
    case "primary":
      return `
          background-color: ${props.theme.primary.main};
          color: ${props.theme.primary.contrastText};
          &:hover:not(:disabled) {
            background-color: ${props.theme.primary.dark};
          }
          &:disabled {
            background-color: ${props.theme.border};
            color: ${props.theme.textTertiary};
            cursor: not-allowed;
          }
        `;
    case "secondary":
      return `
          background-color: ${props.theme.secondary.main};
          color: ${props.theme.secondary.contrastText};
          &:hover:not(:disabled) {
            background-color: ${props.theme.secondary.dark};
          }
          &:disabled {
            background-color: ${props.theme.border};
            color: ${props.theme.textTertiary};
            cursor: not-allowed;
          }
        `;
    case "danger":
      return `
          background-color: ${props.theme.error.main};
          color: ${props.theme.error.contrastText};
          &:hover:not(:disabled) {
            background-color: ${props.theme.error.dark};
          }
          &:disabled {
            background-color: ${props.theme.border};
            color: ${props.theme.textTertiary};
            cursor: not-allowed;
          }
        `;
    case "ghost":
      return `
          background-color: transparent;
          color: ${props.theme.textPrimary};
          border: 1px solid ${props.theme.border};
          &:hover:not(:disabled) {
            background-color: ${props.theme.surfaceVariant};
            border-color: ${props.theme.primary.main};
            color: ${props.theme.primary.main};
          }
          &:disabled {
            background-color: transparent;
            color: ${props.theme.textTertiary};
            border-color: ${props.theme.borderLight};
            cursor: not-allowed;
          }
        `;
    case "outline":
      return `
          background-color: transparent;
          color: ${props.theme.primary.main};
          border: 1px solid ${props.theme.primary.main};
          &:hover:not(:disabled) {
            background-color: ${props.theme.primary.main};
            color: ${props.theme.primary.contrastText};
          }
          &:disabled {
            background-color: transparent;
            color: ${props.theme.textTertiary};
            border-color: ${props.theme.border};
            cursor: not-allowed;
          }
        `;
    default:
      return `
          background-color: ${props.theme.primary.main};
          color: ${props.theme.primary.contrastText};
          &:hover:not(:disabled) {
            background-color: ${props.theme.primary.dark};
          }
          &:disabled {
            background-color: ${props.theme.border};
            color: ${props.theme.textTertiary};
            cursor: not-allowed;
          }
        `;
  }
}}
  
  /* 尺寸样式 */
  ${(props) => {
  switch (props.size) {
    case "small":
      return `
          padding: 6px 12px;
          font-size: 0.875rem;
          min-height: 32px;
        `;
    case "medium":
      return `
          padding: 8px 16px;
          font-size: 1rem;
          min-height: 40px;
        `;
    case "large":
      return `
          padding: 12px 24px;
          font-size: 1.125rem;
          min-height: 48px;
        `;
    default:
      return `
          padding: 8px 16px;
          font-size: 1rem;
          min-height: 40px;
        `;
  }
}}
  
  /* 全宽样式 */
  ${(props) => props.fullWidth && `
    width: 100%;
  `}
  
  /* 加载状态 */
  ${(props) => props.$loading && `
    color: transparent;
    pointer-events: none;
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      top: 50%;
      left: 50%;
      margin-left: -8px;
      margin-top: -8px;
      border: 2px solid ${props.theme.primary.contrastText};
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 0.8s linear infinite;
    }
  `}
  
  /* 加载动画 */
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
const Button = React.memo(({
  children,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  $loading = false,
  disabled = false,
  startIcon,
  endIcon,
  type = "button",
  onClick,
  className,
  ...props
}) => {
  const isServicePage = React.useMemo(() => {
    return ["/proxy-management", "/chat", "/dev-environment"].some(
      (path) => window.location.pathname.includes(path)
    );
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    StyledButton,
    {
      variant,
      size,
      fullWidth,
      $loading,
      disabled,
      type,
      onClick,
      className,
      whileHover: isServicePage ? void 0 : { scale: $loading || disabled ? 1 : 1.01, zIndex: $loading || disabled ? 0 : 1 },
      whileTap: isServicePage ? void 0 : { scale: $loading || disabled ? 1 : 0.99, zIndex: $loading || disabled ? 0 : 1 },
      transition: isServicePage ? { duration: 0.15 } : { duration: 0.2 },
      ...props,
      children: [
        $loading ? null : startIcon,
        children,
        $loading ? null : endIcon
      ]
    }
  );
});
const StyledCard = dt(motion.div)`
  background-color: ${(props) => props.theme.card.background};
  border: 1px solid ${(props) => props.theme.card.border};
    border-radius: ${(props) => {
  switch (props.$borderRadius) {
    case "none":
      return "0";
    case "small":
      return props.theme.borderRadius.small;
    case "medium":
      return props.theme.borderRadius.medium;
    case "large":
      return props.theme.borderRadius.large;
    default:
      return props.theme.borderRadius.medium;
  }
}};
  
  /* 变体样式 */
  ${(props) => {
  switch (props.$variant) {
    case "elevated":
      return `
          box-shadow: ${props.theme.card.shadow};
          border: none;
          background: ${props.theme.card.background};
        `;
    case "outlined":
      return `
          border: 1px solid ${props.theme.card.border};
          background-color: ${props.theme.card.background};
        `;
    case "filled":
      return `
          background-color: ${props.theme.surfaceVariant};
          border: none;
        `;
    case "gradient":
      return `
          background: ${props.$gradient || props.theme.gradient.primary};
          border: none;
          color: white;
          box-shadow: ${props.theme.shadow.cardHover};
        `;
    case "glass": {
      const glassOpacity = props.$glassIntensity === "light" ? "0.1" : props.$glassIntensity === "medium" ? "0.2" : "0.3";
      return `
          background: rgba(255, 255, 255, ${glassOpacity});
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        `;
    }
    case "floating":
      return `
          background: ${props.theme.card.background};
          border: none;
          box-shadow: ${props.theme.shadow.xl};
          transform: translateY(0);
          transition: all 0.3s ease;
        `;
    case "neumorphic": {
      const isDark = props.theme.name === "dark";
      return `
          background: ${props.theme.background};
          border: none;
          box-shadow: ${isDark ? "inset 0 2px 4px rgba(255, 255, 255, 0.1), 0 4px 8px rgba(0, 0, 0, 0.3)" : "inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(255, 255, 255, 0.8)"};
        `;
    }
    default:
      return `
          box-shadow: ${props.theme.card.shadow};
          border: none;
          background: ${props.theme.card.background};
        `;
  }
}}
  
  /* 内边距样式 */
  ${(props) => {
  switch (props.$padding) {
    case "none":
      return "padding: 0;";
    case "small":
      return "padding: 12px;";
    case "large":
      return "padding: 24px;";
    case "medium":
    default:
      return "padding: 16px;";
  }
}}
  
  /* 悬停效果 */
  ${(props) => props.$hoverable && `
    transition: all ${props.theme.transition.normal} ease;
    cursor: pointer;
    
    &:hover {
      transform: translateY(-2px) scale(1.01);
      ${props.$variant === "glass" ? `
        backdrop-filter: blur(15px);
        background: rgba(255, 255, 255, ${props.$glassIntensity === "light" ? "0.15" : props.$glassIntensity === "medium" ? "0.25" : "0.35"});
      ` : `
        box-shadow: ${(props2) => props2.theme.name === "dark" ? "0 8px 32px rgba(0, 0, 0, 0.3)" : "0 8px 32px rgba(0, 0, 0, 0.2)"};
      `}
    }
  `}
  
  /* 可点击效果 */
  ${(props) => props.$clickable && `
    cursor: pointer;
    transition: all ${props.theme.transition.fast} ease;
    
    &:active {
      transform: scale(0.98);
    }
  `}
  
`;
const Card = React.memo(({
  children,
  $variant = "elevated",
  $padding = "medium",
  $borderRadius = "medium",
  $hoverable = false,
  $clickable = false,
  $gradient,
  $glassIntensity = "medium",
  onClick,
  className,
  ...props
}) => {
  const isServicePage = React.useMemo(() => {
    return ["/proxy-management", "/chat", "/dev-environment"].some(
      (path) => window.location.pathname.includes(path)
    );
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    StyledCard,
    {
      $variant,
      $padding,
      $borderRadius,
      $hoverable,
      $clickable,
      $gradient,
      $glassIntensity,
      onClick,
      className,
      initial: isServicePage ? void 0 : { opacity: 0, y: 20 },
      animate: isServicePage ? void 0 : { opacity: 1, y: 0 },
      transition: isServicePage ? { duration: 0.15 } : { duration: 0.3 },
      whileHover: $hoverable && !isServicePage ? {
        scale: 1.02,
        y: -2,
        zIndex: 1
      } : void 0,
      whileTap: $clickable ? { scale: 0.98, zIndex: 1 } : void 0,
      ...props,
      children
    }
  );
});
dt.button`
  padding: ${(props) => {
  switch (props.$variant) {
    case "card":
      return "16px 24px";
    case "segment":
      return "12px 20px";
    default:
      return "12px 24px";
  }
}};
  border: ${(props) => {
  switch (props.$variant) {
    case "card":
      return props.$active ? `2px solid ${props.theme.primary.main}` : "2px solid transparent";
    case "segment":
      return props.$active ? "none" : "1px solid transparent";
    default:
      return "none";
  }
}};
  background: ${(props) => {
  switch (props.$variant) {
    case "card":
      return props.$active ? props.theme.surface : "transparent";
    case "segment":
      return props.$active ? props.theme.primary.main : "transparent";
    default:
      return "none";
  }
}};
  color: ${(props) => {
  if (props.$variant === "segment") {
    return props.$active ? "#FFFFFF" : props.theme.textSecondary;
  }
  return props.$active ? props.theme.primary.main : props.theme.textSecondary;
}};
  font-weight: 600;
  cursor: pointer;
  border-radius: ${(props) => {
  switch (props.$variant) {
    case "card":
      return props.theme.borderRadius.medium;
    case "segment":
      return props.theme.borderRadius.small;
    default:
      return "0";
  }
}};
  transition: all ${(props) => props.theme.transition.fast} ease;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  box-shadow: ${(props) => props.$variant === "card" && props.$active ? "0 2px 8px rgba(0, 0, 0, 0.1)" : "none"};
  
  &:hover {
    color: ${(props) => props.$variant === "segment" ? props.$active ? "#FFFFFF" : props.theme.primary.main : props.theme.primary.main};
    background: ${(props) => {
  if (props.$variant === "segment") {
    return props.$active ? props.theme.primary.main : props.theme.primary.light + "20";
  }
  return props.$variant === "card" ? props.theme.surface : "transparent";
}};
    transform: ${(props) => props.$variant === "card" ? "translateY(-1px)" : "none"};
    box-shadow: ${(props) => props.$variant === "card" ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "none"};
  }
  
  &:active {
    transform: ${(props) => props.$variant === "card" ? "translateY(0)" : "none"};
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: ${(props) => props.$variant === "default" ? "-2px" : "0"};
    left: 0;
    right: 0;
    height: ${(props) => props.$variant === "default" ? "3px" : "0"};
    background: ${(props) => props.theme.primary.main};
    border-radius: ${(props) => props.$variant === "default" ? "2px 2px 0 0" : "0"};
    transform: ${(props) => props.$variant === "default" && props.$active ? "scaleX(1)" : "scaleX(0)"};
    transition: transform ${(props) => props.theme.transition.fast} ease;
  }
`;
const SwitchContainer = dt.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
`;
const SwitchInput = dt.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + .slider {
    background-color: ${(props) => props.theme.primary.main};
  }
  
  &:checked + .slider:before {
    transform: translateX(24px);
  }
  
  &:disabled + .slider {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
const Slider = dt.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => props.theme.border};
  transition: ${(props) => props.theme.transition.fast} ease;
  border-radius: 24px;
  
  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: ${(props) => props.theme.transition.fast} ease;
    border-radius: 50%;
  }
`;
React.memo(({
  checked,
  onChange,
  disabled = false
}) => {
  const handleChange = (e) => {
    onChange(e.target.checked);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchContainer, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SwitchInput,
      {
        type: "checkbox",
        checked,
        onChange: handleChange,
        disabled
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { className: "slider" })
  ] });
});
const ToastContainer = dt.div`
  position: fixed;
  top: 60px;
  right: ${(props) => props.theme.spacing.xl};
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.sm};
`;
const StyledToast = dt.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
  background-color: ${(props) => {
  switch (props.$type) {
    case "success":
      return props.theme.success.main;
    case "error":
      return props.theme.error.main;
    case "info":
      return props.theme.info.main;
    default:
      return props.theme.surfaceVariant;
  }
}};
  color: white;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn ${(props) => props.theme.transition.normal} ease forwards;
  min-width: 280px;
  max-width: 400px;
  font-size: 0.9rem;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  &.exiting {
    animation: slideOut ${(props) => props.theme.transition.normal} ease forwards;
  }
`;
const ToastIcon = dt.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;
const ToastContent = dt.div`
  flex: 1;
  font-weight: 500;
  font-size: 0.9rem;
  line-height: 1.4;
`;
const ToastClose = dt.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  &:hover {
    opacity: 1;
  }
`;
const Toast = ({
  id,
  message,
  type,
  onClose,
  exiting = false
}) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 18 });
      case "error":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 18 });
      case "info":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 18 });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 18 });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(StyledToast, { $type: type, className: exiting ? "exiting" : "", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ToastIcon, { children: getIcon() }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ToastContent, { children: message }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ToastClose, { onClick: () => onClose(id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 }) })
  ] });
};
const Label = dt.label`
  display: block;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.textPrimary};
  font-weight: 500;
  font-size: 0.9rem;
`;
const baseInputStyles = `
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.9rem;
  font-family: inherit;
  transition: all ${({ theme }) => theme.transition.fast} ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.inputFocusBorder};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.accent}40;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${({ theme }) => theme.textTertiary};
  }
`;
const Input = dt.input`
  ${baseInputStyles}
`;
dt.textarea`
  ${baseInputStyles}
  min-height: 100px;
  resize: vertical;
`;
const SelectContainer = dt.div`
  position: relative;
  width: 100%;
`;
const Select = dt.select`
  ${baseInputStyles}
  appearance: none; /* 移除默认箭头 */
  padding-right: 36px; /* 为自定义箭头留出空间 */
`;
const SelectArrow = dt.div`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${({ theme }) => theme.textSecondary};
`;
const SelectWrapper = ({ children }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContainer, { children: [
    children,
    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectArrow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "6 9 12 15 18 9" }) }) })
  ] });
};
const FormGroup = dt.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
`;
dt.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  
  & > ${FormGroup} {
    flex: 1;
    margin-bottom: 0;
  }
`;
dt.div`
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 24px;
  padding-right: 24px;
  width: 100%;
`;
dt.div`
  padding: 24px;
  border-bottom: 1px solid ${(props) => props.theme?.border || "#E5E7EB"};
  background: ${(props) => props.theme?.surface || "#FFFFFF"};
`;
const ContentArea = dt.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 24px;
  min-height: 0;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  scrollbar-width: none;
  -ms-overflow-style: none;
`;
dt.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${(props) => props.theme?.textPrimary || "#111827"};
  margin: 0;
`;
dt.p`
  font-size: 0.9rem;
  color: ${(props) => props.theme?.textSecondary || "#4B5563"};
  margin: 8px 0 0 0;
`;
dt.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
dt.div`
  flex: 1;
`;
dt.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;
export {
  Button as B,
  ContentArea as C,
  FormGroup as F,
  Input as I,
  Label as L,
  PageContainer as P,
  SelectWrapper as S,
  ToastContainer as T,
  Select as a,
  Card as b,
  Toast as c
};
