import { j as jsxRuntimeExports } from "./mui-vendor-CTE_O7gT.js";
import { d as dt, a as React, r as reactExports, l as lt } from "./styled-components-eg0Rzwc1.js";
import { u as useTheme, a as useUser, b as useConfig } from "./index-C-fhFnDy.js";
import { m as motion } from "./animation-DwHr2ej_.js";
import { a as Settings, d as Search, U as User, y as Monitor, z as Database, E as Upload, R as RefreshCw, q as Save } from "./icons-CcncyDR1.js";
import { S as StatusIndicator } from "./StatusIndicator-7Lw0xWRZ.js";
import "./react-vendor-BS-dYsv0.js";
import "./routing-oDjbPx8E.js";
const StyledModernCard = dt(motion.div)`
  position: relative;
  overflow: hidden;
  border-radius: ${(props) => {
  const borderRadius = props.theme?.borderRadius || {};
  switch (props.borderRadius) {
    case "small":
      return borderRadius.small || "8px";
    case "medium":
      return borderRadius.medium || "12px";
    case "large":
      return borderRadius.large || "16px";
    case "extra-large":
      return borderRadius.extraLarge || "24px";
    default:
      return borderRadius.medium || "12px";
  }
}};
  
  /* 内边距样式 */
  ${(props) => {
  switch (props.padding) {
    case "none":
      return "padding: 0;";
    case "small":
      return "padding: 16px;";
    case "large":
      return "padding: 32px;";
    case "medium":
    default:
      return "padding: 24px;";
  }
}}
  
  /* 变体样式 */
  ${(props) => {
  const theme = props.theme || {};
  const gradient = theme.gradient || {};
  const shadow = theme.shadow || {};
  const isDark = theme.name === "dark";
  switch (props.variant) {
    case "gradient":
      return `
          background: ${props.gradient || gradient.primary || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"};
          border: none;
          color: white;
          box-shadow: ${shadow.xl || "0 8px 25px rgba(0, 0, 0, 0.15)"};
          position: relative;
          
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
            border-radius: inherit;
          }
        `;
    case "glass":
      return `
          background: ${isDark ? `rgba(17, 24, 39, ${props.intensity === "light" ? "0.08" : props.intensity === "medium" ? "0.12" : props.intensity === "heavy" ? "0.18" : "0.12"})` : `rgba(255, 255, 255, ${props.intensity === "light" ? "0.08" : props.intensity === "medium" ? "0.12" : props.intensity === "heavy" ? "0.18" : "0.12"})`};
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"};
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        `;
    case "floating":
      return `
          background: ${theme.card?.background || "#ffffff"};
          border: none;
          box-shadow: ${shadow.xl || "0 8px 25px rgba(0, 0, 0, 0.15)"};
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          
          &::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, ${theme.primary?.main || "#2563EB"}, ${theme.accent || "#7C3AED"}, ${theme.primary?.main || "#2563EB"});
            border-radius: inherit;
            opacity: 0;
            z-index: -1;
            transition: opacity 0.3s ease;
          }
        `;
    case "neumorphic":
      return `
          background: ${theme.background || "#ffffff"};
          border: none;
          box-shadow: ${isDark ? "8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.05)" : "8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.8)"};
          transition: all 0.3s ease;
        `;
    case "3d":
      return `
          background: ${theme.card?.background || "#ffffff"};
          border: none;
          box-shadow: 
            0 10px 20px rgba(0, 0, 0, 0.1),
            0 6px 6px rgba(0, 0, 0, 0.1),
            inset 0 -2px 4px rgba(0, 0, 0, 0.05);
          transform-style: preserve-3d;
          transition: all 0.3s ease;
          
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 50%;
            background: linear-gradient(to bottom, rgba(255,255,255,0.1), transparent);
            border-radius: inherit;
          }
        `;
    default:
      return `
          background: ${theme.card?.background || "#ffffff"};
          border: none;
          box-shadow: ${shadow.card || "0 1px 2px rgba(0, 0, 0, 0.05)"};
        `;
  }
}}
  
  /* 悬停效果 */
  ${(props) => {
  if (!props.hoverable) return "";
  const theme = props.theme || {};
  const isDark = theme.name === "dark";
  return `
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      cursor: pointer;
      
      &:hover {
        transform: translateY(-4px) scale(1.02);
        
        ${props.variant === "glass" ? `
          backdrop-filter: blur(25px);
          background: ${isDark ? `rgba(17, 24, 39, ${props.intensity === "light" ? "0.12" : props.intensity === "medium" ? "0.18" : props.intensity === "heavy" ? "0.24" : "0.18"})` : `rgba(255, 255, 255, ${props.intensity === "light" ? "0.12" : props.intensity === "medium" ? "0.18" : props.intensity === "heavy" ? "0.24" : "0.18"})`};
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        ` : ""}
        
        ${props.variant === "floating" ? `
          box-shadow: ${isDark ? "0 8px 32px rgba(0, 0, 0, 0.3)" : "0 8px 32px rgba(0, 0, 0, 0.2)"};
          &::before {
            opacity: 0.3;
          }
        ` : ""}
        
        ${props.variant === "neumorphic" ? `
          box-shadow: ${isDark ? "12px 12px 24px rgba(0, 0, 0, 0.5), -12px -12px 24px rgba(255, 255, 255, 0.08)" : "12px 12px 24px rgba(0, 0, 0, 0.15), -12px -12px 24px rgba(255, 255, 255, 0.9)"};
        ` : ""}
        
        ${props.variant === "3d" ? `
          transform: translateY(-6px) scale(1.02) rotateX(2deg);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.15),
            0 12px 12px rgba(0, 0, 0, 0.12),
            inset 0 -4px 8px rgba(0, 0, 0, 0.08);
        ` : ""}
      }
    `;
}}
  
  /* 可点击效果 */
  ${(props) => {
  if (!props.clickable) return "";
  const theme = props.theme || {};
  const isDark = theme.name === "dark";
  return `
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:active {
        transform: ${props.variant === "neumorphic" ? "translateY(2px) scale(0.98)" : "translateY(-1px) scale(0.98)"};
        
        ${props.variant === "neumorphic" ? `
          box-shadow: ${isDark ? "4px 4px 8px rgba(0, 0, 0, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.05)" : "4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.8)"};
        ` : ""}
      }
    `;
}}
`;
const ModernCard = React.memo(({
  children,
  variant = "gradient",
  padding = "medium",
  borderRadius = "medium",
  hoverable = false,
  clickable = false,
  gradient,
  intensity = "medium",
  onClick,
  className,
  animationDelay = 0
}) => {
  const theme = useTheme();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    StyledModernCard,
    {
      variant,
      padding,
      borderRadius,
      hoverable,
      clickable,
      gradient,
      intensity,
      onClick,
      className,
      theme,
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: {
        delay: animationDelay,
        duration: 0.6,
        type: "spring",
        stiffness: 100
      },
      whileHover: hoverable ? {
        scale: 1.02,
        y: -4,
        transition: { duration: 0.3 }
      } : void 0,
      whileTap: clickable ? {
        scale: 0.98,
        transition: { duration: 0.1 }
      } : void 0,
      children
    }
  );
});
const SidebarContainer = dt(motion.div)`
  width: 300px;
  background: ${(props) => props.theme.name === "dark" ? "linear-gradient(135deg, rgba(17, 24, 39, 0.8), rgba(31, 41, 55, 0.6))" : "linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.6))"};
  backdrop-filter: blur(20px);
  border: 1px solid ${(props) => props.theme.name === "dark" ? "rgba(59, 130, 246, 0.2)" : "rgba(37, 99, 235, 0.2)"};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  box-shadow: ${(props) => props.theme.name === "dark" ? "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.1)" : "0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(37, 99, 235, 0.1)"};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent, 
      ${(props) => props.theme.name === "dark" ? "rgba(59, 130, 246, 0.5)" : "rgba(37, 99, 235, 0.5)"}, 
      transparent
    );
    animation: shimmer 3s ease-in-out infinite;
  }
  
  @keyframes shimmer {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  
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
`;
const SidebarHeader = dt.div`
  padding: 24px;
  border-bottom: 1px solid ${(props) => props.theme.name === "dark" ? "rgba(59, 130, 246, 0.1)" : "rgba(37, 99, 235, 0.1)"};
  background: ${(props) => props.theme.name === "dark" ? "rgba(59, 130, 246, 0.05)" : "rgba(37, 99, 235, 0.05)"};
`;
const SidebarTitle = dt.h2`
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  color: ${(props) => props.theme.textPrimary};
  display: flex;
  align-items: center;
  gap: 12px;
  
  span {
    background: ${(props) => props.theme.name === "dark" ? "linear-gradient(135deg, #3B82F6, #8B5CF6)" : "linear-gradient(135deg, #2563EB, #7C3AED)"};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;
const SidebarSearch = dt.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${(props) => props.theme.name === "dark" ? "rgba(59, 130, 246, 0.1)" : "rgba(37, 99, 235, 0.1)"};
`;
const SearchInput = dt.div`
  position: relative;
  
  input {
    width: 100%;
    padding: 12px 16px 12px 44px;
    border: 1px solid ${(props) => props.theme.border};
    border-radius: ${(props) => props.theme.borderRadius.medium};
    background: ${(props) => props.theme.name === "dark" ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.8)"};
    color: ${(props) => props.theme.textPrimary};
    font-size: 0.9rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    
    &:focus {
      outline: none;
      border-color: ${(props) => props.theme.primary.main};
      box-shadow: 0 0 0 3px ${(props) => props.theme.name === "dark" ? "rgba(59, 130, 246, 0.2)" : "rgba(37, 99, 235, 0.2)"};
    }
    
    &::placeholder {
      color: ${(props) => props.theme.textTertiary};
    }
  }
`;
const SearchIconWrapper = dt.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.textTertiary};
`;
const NavSection = dt.div`
  padding: 16px 0;
  flex: 1;
  overflow-y: auto;
`;
const NavItem = dt(motion.button)`
  width: 100%;
  padding: 16px 24px;
  border: none;
  background: ${(props) => props.$active ? props.theme.name === "dark" ? "rgba(59, 130, 246, 0.2)" : "rgba(37, 99, 235, 0.1)" : "transparent"};
  color: ${(props) => props.$active ? props.theme.primary.main : props.theme.textSecondary};
  text-align: left;
  cursor: pointer;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  margin: 0 0 8px 0;
  
  &:hover {
    background: ${(props) => props.$active ? props.theme.name === "dark" ? "rgba(59, 130, 246, 0.3)" : "rgba(37, 99, 235, 0.2)" : props.theme.name === "dark" ? "rgba(51, 65, 85, 0.6)" : "rgba(248, 250, 252, 0.8)"};
    color: ${(props) => props.$active ? props.theme.primary.main : props.theme.textPrimary};
    transform: translateX(4px);
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 24px;
    background: ${(props) => props.theme.gradient.primary};
    border-radius: 0 2px 2px 0;
    opacity: ${(props) => props.$active ? 1 : 0};
    transition: opacity 0.3s ease;
  }
  
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
`;
const NavItemContent = dt.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const NavItemLabel = dt.div`
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;
const NavItemDescription = dt.div`
  font-size: 0.8rem;
  color: ${(props) => props.theme.textTertiary};
  font-weight: 400;
  line-height: 1.3;
`;
const NavItemBadge = dt.span`
  background: ${(props) => props.theme.gradient.primary};
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;
const navItems = [
  {
    id: "user",
    label: "个人信息",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 18 }),
    description: "查看您的个人资料"
  },
  {
    id: "system",
    label: "系统行为",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { size: 18 }),
    description: "启动、关闭和通知"
  },
  {
    id: "backup",
    label: "数据管理",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { size: 18 }),
    description: "备份和恢复"
  }
];
const SettingsSidebar = ({
  activeSection,
  onSectionChange
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const filteredItems = navItems.filter(
    (item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()) || item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SidebarContainer,
    {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.5, delay: 0.2 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SidebarTitle, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 24 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "设置" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarSearch, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SearchInput, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SearchIconWrapper, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: "搜索设置...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value)
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(NavSection, { children: filteredItems.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          NavItem,
          {
            $active: activeSection === item.id,
            onClick: () => onSectionChange(item.id),
            children: [
              item.icon,
              /* @__PURE__ */ jsxRuntimeExports.jsxs(NavItemContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(NavItemLabel, { children: [
                  item.label,
                  item.badge && /* @__PURE__ */ jsxRuntimeExports.jsx(NavItemBadge, { children: item.badge })
                ] }),
                item.description && /* @__PURE__ */ jsxRuntimeExports.jsx(NavItemDescription, { children: item.description })
              ] })
            ]
          },
          item.id
        )) })
      ]
    }
  );
};
const ToastContainer = dt.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const ToastComponent = dt(motion.div)`
  padding: 12px 20px;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  font-size: 0.9rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
  border: 1px solid;
  min-width: 200px;
  max-width: 400px;
  
  ${(props) => {
  switch (props.type) {
    case "success":
      return lt`
          background: ${props.theme.name === "dark" ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.1)"};
          color: ${props.theme.success.main};
          border-color: ${props.theme.name === "dark" ? "rgba(16, 185, 129, 0.3)" : "rgba(16, 185, 129, 0.2)"};
        `;
    case "error":
      return lt`
          background: ${props.theme.name === "dark" ? "rgba(239, 68, 68, 0.2)" : "rgba(239, 68, 68, 0.1)"};
          color: ${props.theme.error.main};
          border-color: ${props.theme.name === "dark" ? "rgba(239, 68, 68, 0.3)" : "rgba(239, 68, 68, 0.2)"};
        `;
    default:
      return lt`
          background: ${props.theme.name === "dark" ? "rgba(59, 130, 246, 0.2)" : "rgba(37, 99, 235, 0.1)"};
          color: ${props.theme.primary.main};
          border-color: ${props.theme.name === "dark" ? "rgba(59, 130, 246, 0.3)" : "rgba(37, 99, 235, 0.2)"};
        `;
  }
}}
  
  opacity: ${(props) => props.exiting ? 0 : 1};
  transform: translateY(${(props) => props.exiting ? "-20px" : "0"});
  transition: all 0.3s ease;
`;
const ModernSettingsContainer = dt.div`
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
const MainContent = dt.div`
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
const ContentHeader = dt.div`
  padding: ${(props) => props.theme.spacing.lg};
  background: ${(props) => props.theme.surface};
  border-bottom: 1px solid ${(props) => props.theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const PageTitle = dt.h1`
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
  color: ${(props) => props.theme.textPrimary};
  display: flex;
  align-items: center;
  gap: 12px;
`;
const TabContent = dt.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  padding: 24px;
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
`;
const SectionTitle = dt.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  color: ${(props) => props.theme.textPrimary};
  display: flex;
  align-items: center;
  gap: 8px;
`;
const SettingsCard = dt(ModernCard)`
  margin-bottom: 16px;
`;
const FormGrid = dt.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;
const FormGroup = dt.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const FormLabel = dt.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${(props) => props.theme.textSecondary};
  margin-bottom: 4px;
`;
const FormInput = dt.input`
  padding: 12px 16px;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: ${(props) => props.theme.borderRadius.medium};
  background: ${(props) => props.theme.input.background};
  color: ${(props) => props.theme.input.text};
  font-size: 0.9rem;
  transition: all ${(props) => props.theme.transition.normal} ease;
  
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.input.borderFocus};
    box-shadow: ${(props) => props.theme.button.shadowHover};
  }
  
  &::placeholder {
    color: ${(props) => props.theme.input.placeholder};
  }
  
  &:read-only {
    background: ${(props) => props.theme.surfaceVariant};
    cursor: not-allowed;
  }
`;
const AvatarContainer = dt.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px;
`;
const Avatar = dt.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${(props) => props.theme.primary.main};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  box-shadow: ${(props) => props.theme.button.shadow};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const SwitchContainer = dt.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: ${(props) => props.theme.surfaceVariant};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: ${(props) => props.theme.borderRadius.medium};
  margin-bottom: 12px;
  transition: all ${(props) => props.theme.transition.normal} ease;
  
  &:hover {
    background: ${(props) => props.theme.surface};
    border-color: ${(props) => props.theme.primary.main};
  }
`;
const SwitchInfo = dt.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const SwitchLabel = dt.div`
  font-weight: 500;
  color: ${(props) => props.theme.textPrimary};
  font-size: 0.95rem;
`;
const SwitchDescription = dt.div`
  font-size: 0.85rem;
  color: ${(props) => props.theme.textSecondary};
  line-height: 1.4;
`;
const Switch = dt.div`
  width: 48px;
  height: 24px;
  background: ${(props) => props.$checked ? props.theme.primary.main : props.theme.borderLight};
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: all ${(props) => props.theme.transition.normal} ease;
  
  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    top: 2px;
    left: ${(props) => props.$checked ? "26px" : "2px"};
    transition: all ${(props) => props.theme.transition.normal} ease;
    box-shadow: ${(props) => props.theme.button.shadow};
  }
  
  &:hover {
    transform: scale(1.02);
  }
`;
const ButtonGroup = dt.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;
const ModernButton = dt(motion.button)`
  padding: 12px 24px;
  border-radius: ${(props) => props.theme.borderRadius.small};
  font-size: 0.9rem;
  font-weight: 500;
  transition: all ${(props) => props.theme.transition.normal} ease;
  cursor: pointer;
  border: 1px solid ${(props) => props.theme.border};
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
  
  ${(props) => {
  switch (props.$variant) {
    case "primary":
      return lt`
          background: ${(props2) => props2.theme.primary.main};
          color: ${(props2) => props2.theme.primary.contrastText};
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
    case "outline":
      return lt`
          background: ${(props2) => props2.theme.surface};
          color: ${(props2) => props2.theme.primary.main};
          border-color: ${(props2) => props2.theme.primary.main};
          box-shadow: ${(props2) => props2.theme.button.shadow};
          
          &:hover {
            background: ${(props2) => props2.theme.primary.main};
            color: ${(props2) => props2.theme.primary.contrastText};
            box-shadow: ${(props2) => props2.theme.button.shadowHover};
          }
        `;
    case "danger":
      return lt`
          background: ${(props2) => props2.theme.error.main};
          color: ${(props2) => props2.theme.error.contrastText};
          border-color: ${(props2) => props2.theme.error.main};
          box-shadow: ${(props2) => props2.theme.button.shadow};
          
          &:hover {
            background: ${(props2) => props2.theme.error.dark};
            border-color: ${(props2) => props2.theme.error.dark};
            box-shadow: ${(props2) => props2.theme.button.shadowHover};
          }
        `;
    default:
      return lt`
          background: ${(props2) => props2.theme.surface};
          color: ${(props2) => props2.theme.textPrimary};
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
const SaveBar = dt(motion.div)`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: ${(props) => props.theme.surface};
  border: 1px solid ${(props) => props.theme.border};
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  border-radius: ${(props) => props.theme.borderRadius.large};
  box-shadow: ${(props) => props.theme.card.shadowHover};
  z-index: 1000;
  min-width: 280px;
`;
const SaveStatusContainer = dt.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const TabsContainer = dt.div`
  display: none;
  gap: 8px;
  margin-bottom: 24px;
  padding: 16px;
  background: ${(props) => props.theme.surfaceVariant};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: ${(props) => props.theme.borderRadius.medium};
`;
const TabButton = dt(motion.button)`
  padding: 8px 16px;
  border-radius: ${(props) => props.theme.borderRadius.small};
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid ${(props) => props.theme.border};
  cursor: pointer;
  transition: all ${(props) => props.theme.transition.normal} ease;
  background: ${(props) => props.$active ? props.theme.primary.main : props.theme.surfaceVariant};
  color: ${(props) => props.$active ? props.theme.primary.contrastText : props.theme.textSecondary};
  
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
`;
const SettingsPage = () => {
  const { nickname, avatar } = useUser();
  const { theme } = useTheme();
  const { llmConfigs, activeConfig, refreshConfigs } = useConfig();
  const [activeSection, setActiveSection] = reactExports.useState("user");
  const [userEmail, setUserEmail] = reactExports.useState("");
  const [userNickname, setUserNickname] = reactExports.useState(nickname);
  const [userAvatar, setUserAvatar] = reactExports.useState(avatar);
  const [startup, setStartup] = reactExports.useState(false);
  const [minimizeToTray, setMinimizeToTray] = reactExports.useState(false);
  const [notifications, setNotifications] = reactExports.useState(true);
  const [saveStatus, setSaveStatus] = reactExports.useState("idle");
  const [hasUnsavedChanges, setHasUnsavedChanges] = reactExports.useState(false);
  const [toasts, setToasts] = reactExports.useState([]);
  const [toastId, setToastId] = reactExports.useState(0);
  reactExports.useEffect(() => {
    loadSettings();
    setUserNickname(nickname);
    setUserAvatar(avatar);
  }, [nickname, avatar]);
  const loadSettings = async () => {
    try {
      const result = await window.electronAPI.config.getAll();
      if (result.success && result.data) {
        const config = result.data;
        setUserEmail(config.user.email || "");
        setUserNickname(config.user.nickname || "");
        setStartup(config.app.startup || false);
        setMinimizeToTray(config.app.minimizeToTray || false);
        setNotifications(config.app.notifications || true);
      }
      await refreshConfigs();
    } catch (error) {
      console.error("加载设置失败:", error);
      showToast("加载设置失败", "error");
    }
  };
  const showToast = (message, type) => {
    const id = toastId;
    setToastId((prev) => prev + 1);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.map(
        (toast) => toast.id === id ? { ...toast, exiting: true } : toast
      ));
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 300);
    }, 3e3);
  };
  const removeToast = (id) => {
    setToasts((prev) => prev.map(
      (toast) => toast.id === id ? { ...toast, exiting: true } : toast
    ));
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 300);
  };
  const saveAllSettings = async () => {
    setSaveStatus("saving");
    try {
      await window.electronAPI.config.setStartup(startup);
      await window.electronAPI.config.setMinimizeToTray(minimizeToTray);
      await window.electronAPI.config.setNotifications(notifications);
      await refreshConfigs();
      setHasUnsavedChanges(false);
      setSaveStatus("saved");
      showToast("所有设置已保存", "success");
      setTimeout(() => {
        setSaveStatus("idle");
      }, 3e3);
    } catch (error) {
      console.error("保存设置失败:", error);
      setSaveStatus("error");
      showToast("保存设置失败", "error");
      setTimeout(() => {
        setSaveStatus("idle");
      }, 3e3);
    }
  };
  reactExports.useEffect(() => {
    setHasUnsavedChanges(true);
  }, [
    startup,
    minimizeToTray,
    notifications
  ]);
  const exportConfig = async () => {
    try {
      const result = await window.electronAPI.config.export();
      if (result.success) {
        showToast("配置已导出", "success");
      } else {
        showToast("导出配置失败", "error");
      }
    } catch (error) {
      console.error("导出配置失败:", error);
      showToast("导出配置失败", "error");
    }
  };
  const importConfig = async () => {
    try {
      const result = await window.electronAPI.config.import();
      if (result.success) {
        showToast("配置已导入", "success");
        loadSettings();
      } else {
        showToast("导入配置失败", "error");
      }
    } catch (error) {
      console.error("导入配置失败:", error);
      showToast("导入配置失败", "error");
    }
  };
  const resetConfig = async () => {
    if (confirm("确定要重置所有设置吗？此操作不可撤销。")) {
      try {
        const result = await window.electronAPI.config.reset();
        if (result.success) {
          showToast("设置已重置", "success");
          loadSettings();
        } else {
          showToast("重置设置失败", "error");
        }
      } catch (error) {
        console.error("重置设置失败:", error);
        showToast("重置设置失败", "error");
      }
    }
  };
  const tabs = [
    { id: "user", label: "用户", icon: User },
    { id: "system", label: "系统", icon: Monitor },
    { id: "backup", label: "备份", icon: Database }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ModernSettingsContainer, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(MainLayout, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingsSidebar,
        {
          activeSection,
          onSectionChange: setActiveSection
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        MainContent,
        {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay: 0.3 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ContentHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(PageTitle, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContainer, { children: tabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabButton,
              {
                $active: activeSection === tab.id,
                onClick: () => setActiveSection(tab.id),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(tab.icon, { size: 16 }),
                  tab.label
                ]
              },
              tab.id
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabContent, { children: [
              activeSection === "user" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                SettingsCard,
                {
                  variant: "glass",
                  padding: "large",
                  borderRadius: "large",
                  hoverable: false,
                  animationDelay: 0.4,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { children: "个人信息" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(FormGrid, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(FormGroup, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "头像" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { children: userAvatar ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: userAvatar, alt: "User avatar" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 48, color: theme.iconColor.default }) }) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(FormGroup, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "昵称" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          FormInput,
                          {
                            value: userNickname,
                            readOnly: true,
                            placeholder: "您的昵称"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(FormGroup, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "邮箱" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          FormInput,
                          {
                            type: "email",
                            value: userEmail,
                            readOnly: true,
                            placeholder: "您的邮箱地址"
                          }
                        )
                      ] })
                    ] })
                  ]
                }
              ),
              activeSection === "system" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                SettingsCard,
                {
                  variant: "glass",
                  padding: "large",
                  borderRadius: "large",
                  hoverable: false,
                  animationDelay: 0.4,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { children: "系统行为" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchContainer, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchInfo, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SwitchLabel, { children: "开机启动" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SwitchDescription, { children: "应用程序将在系统启动时自动运行" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Switch,
                        {
                          $checked: startup,
                          onClick: () => setStartup(!startup)
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchContainer, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchInfo, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SwitchLabel, { children: "最小化到托盘" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SwitchDescription, { children: "关闭窗口时将应用程序最小化到系统托盘" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Switch,
                        {
                          $checked: minimizeToTray,
                          onClick: () => setMinimizeToTray(!minimizeToTray)
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchContainer, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchInfo, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SwitchLabel, { children: "通知" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SwitchDescription, { children: "启用应用程序的通知功能" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Switch,
                        {
                          $checked: notifications,
                          onClick: () => setNotifications(!notifications)
                        }
                      )
                    ] })
                  ]
                }
              ),
              activeSection === "backup" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                SettingsCard,
                {
                  variant: "glass",
                  padding: "large",
                  borderRadius: "large",
                  hoverable: false,
                  animationDelay: 0.4,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { children: "配置管理" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(ButtonGroup, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        ModernButton,
                        {
                          onClick: exportConfig,
                          $variant: "outline",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 16 }),
                            "导出配置"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        ModernButton,
                        {
                          onClick: importConfig,
                          $variant: "outline",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 16 }),
                            "导入配置"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        ModernButton,
                        {
                          onClick: resetConfig,
                          $variant: "danger",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 16 }),
                            "重置配置"
                          ]
                        }
                      )
                    ] })
                  ]
                }
              )
            ] })
          ]
        }
      )
    ] }),
    activeSection !== "backup" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      SaveBar,
      {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: 0.6 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SaveStatusContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatusIndicator,
            {
              status: saveStatus === "saving" ? "saving" : saveStatus === "error" ? "error" : saveStatus === "saved" ? "saved" : hasUnsavedChanges ? "changed" : "idle",
              size: "small"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            ModernButton,
            {
              onClick: saveAllSettings,
              disabled: saveStatus === "saving" || !hasUnsavedChanges,
              $variant: "primary",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 16 }),
                saveStatus === "saving" ? "保存中..." : "保存"
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ToastContainer, { children: toasts.map((toast) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      ToastComponent,
      {
        id: toast.id,
        message: toast.message,
        type: toast.type,
        onClose: removeToast,
        exiting: toast.exiting
      },
      toast.id
    )) })
  ] });
};
export {
  SettingsPage as default
};
