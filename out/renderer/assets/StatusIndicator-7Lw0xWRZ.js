import { j as jsxRuntimeExports } from "./mui-vendor-CTE_O7gT.js";
import { a as React, d as dt } from "./styled-components-eg0Rzwc1.js";
import { a0 as Check, q as Save, h as CircleAlert, a1 as Loader } from "./icons-CcncyDR1.js";
const StatusContainer = dt.div`
  display: flex;
  align-items: center;
  gap: ${(props) => {
  switch (props.$size) {
    case "small":
      return "4px";
    case "large":
      return "12px";
    default:
      return "8px";
  }
}};
  padding: ${(props) => {
  switch (props.$size) {
    case "small":
      return "4px 8px";
    case "large":
      return "8px 16px";
    default:
      return "6px 12px";
  }
}};
  border-radius: ${(props) => props.theme.borderRadius.small};
  font-size: ${(props) => {
  switch (props.$size) {
    case "small":
      return "0.75rem";
    case "large":
      return "0.875rem";
    default:
      return "0.8125rem";
  }
}};
  font-weight: 500;
  transition: all ${(props) => props.theme.transition.fast} ease;
  
  &.idle {
    background: ${(props) => props.theme.surface};
    color: ${(props) => props.theme.textSecondary};
    border: 1px solid ${(props) => props.theme.border};
  }
  
  &.saving {
    background: ${(props) => props.theme.info.light + "20"};
    color: ${(props) => props.theme.info.main};
    border: 1px solid ${(props) => props.theme.info.light};
  }
  
  &.saved {
    background: ${(props) => props.theme.success.light + "20"};
    color: ${(props) => props.theme.success.main};
    border: 1px solid ${(props) => props.theme.success.light};
  }
  
  &.error {
    background: ${(props) => props.theme.error.light + "20"};
    color: ${(props) => props.theme.error.main};
    border: 1px solid ${(props) => props.theme.error.light};
  }
  
  &.changed {
    background: ${(props) => props.theme.warning.light + "20"};
    color: ${(props) => props.theme.warning.main};
    border: 1px solid ${(props) => props.theme.warning.light};
  }
  
  &.success {
    background: ${(props) => props.theme.success.light + "20"};
    color: ${(props) => props.theme.success.main};
    border: 1px solid ${(props) => props.theme.success.light};
  }
  
  &.info {
    background: ${(props) => props.theme.info.light + "20"};
    color: ${(props) => props.theme.info.main};
    border: 1px solid ${(props) => props.theme.info.light};
  }
`;
const StatusIcon = dt.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.saving {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
const StatusText = dt.span`
  font-weight: 500;
`;
const StatusIndicator = React.memo(({
  status,
  message,
  size = "medium"
}) => {
  const getStatusConfig = React.useCallback(() => {
    switch (status) {
      case "saving":
        return {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Loader, { size: size === "small" ? 14 : size === "large" ? 20 : 16 }),
          defaultMessage: "保存中...",
          className: "saving"
        };
      case "saved":
        return {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: size === "small" ? 14 : size === "large" ? 20 : 16 }),
          defaultMessage: "已保存",
          className: "saved"
        };
      case "error":
        return {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: size === "small" ? 14 : size === "large" ? 20 : 16 }),
          defaultMessage: "错误",
          className: "error"
        };
      case "changed":
        return {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: size === "small" ? 14 : size === "large" ? 20 : 16 }),
          defaultMessage: "未保存的更改",
          className: "changed"
        };
      case "success":
        return {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: size === "small" ? 14 : size === "large" ? 20 : 16 }),
          defaultMessage: "成功",
          className: "success"
        };
      case "info":
        return {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: size === "small" ? 14 : size === "large" ? 20 : 16 }),
          defaultMessage: "信息",
          className: "info"
        };
      default:
        return {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: size === "small" ? 14 : size === "large" ? 20 : 16 }),
          defaultMessage: "就绪",
          className: "idle"
        };
    }
  }, [status, size]);
  const config = React.useMemo(() => getStatusConfig(), [getStatusConfig]);
  const displayMessage = React.useMemo(() => message || config.defaultMessage, [message, config.defaultMessage]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(StatusContainer, { className: config.className, $size: size, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { $size: size, children: config.icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatusText, { children: displayMessage })
  ] });
});
export {
  StatusIndicator as S
};
