import { j as jsxRuntimeExports } from "./mui-vendor-CTE_O7gT.js";
import { r as reactExports, d as dt } from "./styled-components-eg0Rzwc1.js";
import { u as useTheme, a as useUser } from "./index-DI22-Bbg.js";
import { P as PageContainer } from "./PageContainer-DNwXd5YI.js";
import { j as Sparkles, S as Shield, k as MessageSquare, W as Wifi, C as Code, e as Sun, M as Moon, U as User } from "./icons-CcncyDR1.js";
import { m as motion } from "./animation-DwHr2ej_.js";
import { a as useNavigate } from "./routing-oDjbPx8E.js";
import "./react-vendor-BS-dYsv0.js";
const Header = dt.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  padding: 0 ${({ theme }) => theme.spacing.xl};
`;
const Title = dt.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.textPrimary};
  margin: 0;
`;
const ThemeToggle = dt.button`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background: ${(props) => props.theme.surfaceVariant};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${(props) => props.theme.textPrimary};
  transition: all ${(props) => props.theme.transition.fast} ease;
  
  &:hover {
    background: ${(props) => props.theme.border};
  }
`;
const WelcomeCard = dt(motion.div)`
  background: ${(props) => props.$isDarkMode ? "linear-gradient(135deg, #1e293b, #334155)" : "linear-gradient(135deg, #f8fafc, #e2e8f0)"};
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  border: 1px solid ${(props) => props.theme.border};
  position: relative;
  overflow: hidden;
  min-height: 180px;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: ${(props) => props.$isDarkMode ? "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)" : "radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)"};
    animation: float 6s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
const WelcomeContent = dt.div`
  position: relative;
  z-index: 1;
`;
const WelcomeTitle = dt.h1`
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  color: ${(props) => props.theme.textPrimary};
  display: flex;
  align-items: center;
  gap: 1rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
`;
const WelcomeSubtitle = dt.p`
  font-size: 1.1rem;
  color: ${(props) => props.theme.textSecondary};
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
`;
const QuickActionsGrid = dt.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;
const QuickActionItem = dt(motion.div)`
  background: ${(props) => props.theme.surface};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;
const QuickActionItemIcon = dt.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  background: ${(props) => props.$color}20;
  color: ${(props) => props.$color};
`;
const QuickActionItemTitle = dt.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${(props) => props.theme.textPrimary};
  margin: 0 0 0.5rem 0;
`;
const QuickActionItemDescription = dt.p`
  color: ${(props) => props.theme.textSecondary};
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
`;
const ActivitySection = dt.div`
  margin-bottom: 2rem;
`;
const ActivityHeader = dt.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;
const ActivityTitle = dt.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${(props) => props.theme.textPrimary};
  margin: 0;
`;
const ActivityList = dt.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;
const ActivityItem = dt.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${(props) => props.theme.surface};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${(props) => props.theme.surfaceVariant};
  }
`;
const ActivityIcon = dt.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.$color}20;
  color: ${(props) => props.$color};
`;
const ActivityContent = dt.div`
  flex: 1;
`;
const ActivityText = dt.p`
  font-size: 0.9rem;
  color: ${(props) => props.theme.textPrimary};
  margin: 0 0 0.25rem 0;
`;
const ActivityTime = dt.p`
  font-size: 0.8rem;
  color: ${(props) => props.theme.textTertiary};
  margin: 0;
`;
const Footer = dt.div`
  margin-top: auto;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg} 0;
  color: ${(props) => props.theme.textTertiary};
  font-size: 0.9rem;
`;
const HomePage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { nickname } = useUser();
  const navigate = useNavigate();
  const [proxyStatus, setProxyStatus] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [currentTime, setCurrentTime] = reactExports.useState("");
  const [activities, setActivities] = reactExports.useState([
    { id: 1, text: "欢迎使用 Catalyst！", time: "刚刚", icon: Sparkles, color: "#8B5CF6" },
    { id: 2, text: "系统代理已准备就绪", time: "2分钟前", icon: Shield, color: "#3B82F6" },
    { id: 3, text: "AI 对话功能已激活", time: "5分钟前", icon: MessageSquare, color: "#10B981" }
  ]);
  reactExports.useEffect(() => {
    const updateTime = () => {
      const now = /* @__PURE__ */ new Date();
      const hour = now.getHours();
      let greeting = "";
      if (hour < 6) greeting = "夜深了";
      else if (hour < 9) greeting = "早上好";
      else if (hour < 12) greeting = "上午好";
      else if (hour < 14) greeting = "中午好";
      else if (hour < 18) greeting = "下午好";
      else if (hour < 22) greeting = "晚上好";
      else greeting = "夜深了";
      setCurrentTime(`${greeting}，${nickname || "朋友"}！`);
    };
    updateTime();
    const interval = setInterval(updateTime, 6e4);
    return () => clearInterval(interval);
  }, [nickname]);
  reactExports.useEffect(() => {
    checkProxyStatus();
  }, []);
  const checkProxyStatus = async () => {
    try {
      if (window.electronAPI?.mihomo) {
        const status = await window.electronAPI.mihomo.status();
        setProxyStatus(status);
      }
    } catch (error) {
      console.error("Failed to check proxy status:", error);
    }
  };
  const toggleProxy = async () => {
    if (!window.electronAPI?.mihomo) return;
    setLoading(true);
    try {
      if (proxyStatus?.isRunning) {
        const result = await window.electronAPI.mihomo.stop();
        if (result.success) {
          setProxyStatus({ isRunning: false });
          addActivity("代理服务已停止", Shield, "#3B82F6");
        }
      } else {
        const result = await window.electronAPI.mihomo.start();
        if (result.success) {
          setProxyStatus({ isRunning: true });
          addActivity("代理服务已启动", Shield, "#3B82F6");
        }
      }
    } catch (error) {
      console.error("Failed to toggle proxy:", error);
      addActivity("代理服务操作失败", Shield, "#EF4444");
    } finally {
      setLoading(false);
    }
  };
  const addActivity = (text, icon, color) => {
    const newActivity = {
      id: Date.now(),
      text,
      time: "刚刚",
      icon,
      color
    };
    setActivities((prev) => [newActivity, ...prev.slice(0, 4)]);
  };
  const quickActions = [
    {
      icon: MessageSquare,
      title: "开始对话",
      description: "与AI助手开始智能对话",
      color: "#8B5CF6",
      action: () => {
        addActivity("开始AI对话", MessageSquare, "#8B5CF6");
        navigate("/chat");
      }
    },
    {
      icon: Wifi,
      title: proxyStatus?.isRunning ? "停止代理" : "启动代理",
      description: proxyStatus?.isRunning ? "代理正在运行" : "代理已停止",
      color: proxyStatus?.isRunning ? "#EF4444" : "#10B981",
      action: toggleProxy
    },
    {
      icon: Shield,
      title: "代理管理",
      description: "配置和管理代理设置",
      color: "#3B82F6",
      action: () => {
        addActivity("进入代理管理", Shield, "#3B82F6");
        navigate("/proxy-management");
      }
    },
    {
      icon: Code,
      title: "开发环境",
      description: "部署开发工具和环境",
      color: "#10B981",
      action: () => {
        addActivity("进入开发环境", Code, "#10B981");
        navigate("/dev-environment");
      }
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageContainer, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Header, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { children: "欢迎回来" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, { onClick: toggleTheme, children: isDarkMode ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { size: 20 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { size: 20 }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      WelcomeCard,
      {
        $isDarkMode: isDarkMode,
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(WelcomeContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(WelcomeTitle, { children: [
            currentTime,
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 32 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(WelcomeSubtitle, { children: "今天准备好探索新的可能性了吗？让我们一起用 Catalyst 提升您的工作效率。" })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(QuickActionsGrid, { children: quickActions.map((action, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.1 * index + 0.3, duration: 0.5 },
        onClick: action.action,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          QuickActionItem,
          {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            style: { opacity: loading && action.title.includes("代理") ? 0.7 : 1 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(QuickActionItemIcon, { $color: action.color, children: loading && action.title.includes("代理") ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { animation: "spin 1s linear infinite" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { size: 24 }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(action.icon, { size: 24 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(QuickActionItemTitle, { children: action.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(QuickActionItemDescription, { children: action.description })
            ]
          }
        )
      },
      action.title
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(ActivitySection, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ActivityHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ActivityTitle, { children: "最近活动" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ActivityList, { children: activities.map((activity, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: 0.1 * index + 0.5, duration: 0.4 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ActivityItem, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ActivityIcon, { $color: activity.color, children: /* @__PURE__ */ jsxRuntimeExports.jsx(activity.icon, { size: 20 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(ActivityContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ActivityText, { children: activity.text }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ActivityTime, { children: activity.time })
            ] })
          ] })
        },
        activity.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Footer, { children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Catalyst - 为您的工作效率而生"
    ] })
  ] });
};
export {
  HomePage as default
};
