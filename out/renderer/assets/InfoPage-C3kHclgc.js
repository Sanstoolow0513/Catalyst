import { j as jsxRuntimeExports } from "./mui-vendor-CTE_O7gT.js";
import { r as reactExports, d as dt, m as mt } from "./styled-components-eg0Rzwc1.js";
import { b as Card } from "./PageContentLayout-C5gM8vRh.js";
import { P as PageContainer } from "./PageContainer-DNwXd5YI.js";
import "./StatusIndicator-7Lw0xWRZ.js";
import "./index-DI22-Bbg.js";
import { O as Mail, Z as Zap, Q as Github, G as Globe, C as Code, o as TrendingUp, V as Award, Y as Rocket, _ as Star, A as Activity, $ as Heart, m as Users } from "./icons-CcncyDR1.js";
import { m as motion } from "./animation-DwHr2ej_.js";
import "./react-vendor-BS-dYsv0.js";
import "./routing-oDjbPx8E.js";
const pulseAnimation = mt`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
`;
const InfoContainer = dt.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  padding: 0 ${({ theme }) => theme.spacing.md};
  
  @media (max-width: 768px) {
    padding: 0 ${({ theme }) => theme.spacing.sm};
  }
`;
const AnimatedBackground = dt.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
`;
const FloatingParticle = dt(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  background: ${(props) => props.theme.primary};
  border-radius: 50%;
  opacity: 0.6;
`;
const GlowOrb = dt(motion.div)`
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, ${(props) => props.theme.primary}20 0%, transparent 70%);
  filter: blur(40px);
  animation: ${pulseAnimation} 4s ease-in-out infinite;
`;
const StatsContainer = dt.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.xxl} 0;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;
const StatCard = dt(motion.div)`
  background: ${(props) => props.theme.surfaceVariant};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${(props) => props.theme.primary}, ${(props) => props.theme.accent});
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  
  &:hover::before {
    transform: scaleX(1);
  }
`;
const StatNumber = dt.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;
const StatLabel = dt.div`
  font-size: 0.9rem;
  color: ${(props) => props.theme.textSecondary};
  font-weight: 500;
`;
const FeatureGrid = dt.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin: ${({ theme }) => theme.spacing.xxl} 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
const FeatureCard = dt(motion.div)`
  background: ${(props) => props.theme.surface};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${(props) => props.theme.border};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, ${(props) => props.theme.primary}10, ${(props) => props.theme.accent}10);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;
const FeatureIcon = dt.div`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background: linear-gradient(135deg, ${(props) => props.theme.primary}, ${(props) => props.theme.accent});
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: white;
  font-size: 1.5rem;
`;
const FeatureTitle = dt.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${(props) => props.theme.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;
const FeatureDescription = dt.p`
  color: ${(props) => props.theme.textSecondary};
  line-height: 1.6;
`;
const TimelineSection = dt.div`
  margin: ${({ theme }) => theme.spacing.xxl} 0;
`;
const TimelineItem = dt(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  position: relative;
`;
const TimelineDot = dt.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${(props) => props.theme.primary};
  position: relative;
  z-index: 2;
  
  &::after {
    content: '';
    position: absolute;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: calc(100% + ${({ theme }) => theme.spacing.lg});
    background: ${(props) => props.theme.border};
  }
`;
const TimelineContent = dt.div`
  flex: 1;
  background: ${(props) => props.theme.surfaceVariant};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
`;
const TimelineDate = dt.div`
  font-size: 0.85rem;
  color: ${(props) => props.theme.primary};
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;
const TimelineTitle = dt.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${(props) => props.theme.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;
const TimelineDescription = dt.p`
  color: ${(props) => props.theme.textSecondary};
  line-height: 1.5;
`;
const PageHeader = dt(motion.div)`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;
const PageTitle = dt.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  background: ${(props) => {
  const primaryColor = typeof props.theme.primary === "string" ? props.theme.primary : props.theme.primary.main;
  return `linear-gradient(135deg, ${primaryColor}, ${props.theme.accent})`;
}};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;
const VersionBadge = dt(motion.span)`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  background: ${(props) => props.theme.surfaceVariant};
  color: ${(props) => props.theme.textPrimary};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  font-size: 0.9rem;
  font-weight: 500;
`;
const Section = dt(motion.section)`
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;
const SectionTitle = dt.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${(props) => props.theme.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;
const ContactInfo = dt.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;
const PersonalInfo = dt.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
const InfoCard = dt(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;
const InfoCardTitle = dt.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${(props) => props.theme.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;
const InfoItem = dt.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${(props) => props.theme.textSecondary};
  font-size: 0.95rem;
`;
const ContactItem = dt(motion.a)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${(props) => props.theme.surfaceVariant};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  text-decoration: none;
  color: ${(props) => props.theme.textPrimary};
  transition: all ${(props) => props.theme.transition.fast} ease;
  
  &:hover {
    background: ${(props) => {
  const primaryColor = typeof props.theme.primary === "string" ? props.theme.primary : props.theme.primary.main;
  return `${primaryColor}10`;
}};
    transform: translateX(4px);
  }
`;
const InfoPage = () => {
  const [particles, setParticles] = reactExports.useState([]);
  reactExports.useEffect(() => {
    const generatedParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setParticles(generatedParticles);
  }, []);
  const stats = [
    { number: "1.0", label: "当前版本", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { size: 24 }) },
    { number: "100+", label: "代码提交", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { size: 24 }) },
    { number: "5", label: "核心功能", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 24 }) },
    { number: "24/7", label: "在线运行", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 24 }) },
    { number: "3", label: "开发月数", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 24 }) },
    { number: "99%", label: "用户满意度", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 24 }) }
  ];
  const features = [
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 28 }),
      title: "高性能",
      description: "基于最新技术栈构建，提供流畅的用户体验和快速的响应速度。"
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 28 }),
      title: "用户友好",
      description: "简洁直观的界面设计，让用户能够轻松上手并高效使用。"
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 28 }),
      title: "开源精神",
      description: "完全开源的项目，欢迎社区贡献和共同改进。"
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 28 }),
      title: "社区驱动",
      description: "活跃的开发者社区，持续的功能更新和技术支持。"
    }
  ];
  const timeline = [
    {
      date: "2024.08",
      title: "项目启动",
      description: "Catalyst 项目正式立项，开始架构设计和技术选型。"
    },
    {
      date: "2024.09",
      title: "核心功能开发",
      description: "完成主要功能模块的开发，包括用户界面和核心业务逻辑。"
    },
    {
      date: "2024.10",
      title: "优化迭代",
      description: "持续优化用户体验，修复bug，添加新功能，提升系统稳定性。"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageContainer, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatedBackground, { children: [
      particles.map((particle) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        FloatingParticle,
        {
          style: { left: `${particle.x}%`, top: `${particle.y}%` },
          animate: {
            y: [0, -30, 0],
            opacity: [0.4, 0.8, 0.4]
          },
          transition: {
            duration: 3 + Math.random() * 2,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }
        },
        particle.id
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        GlowOrb,
        {
          style: { top: "10%", left: "10%", width: "200px", height: "200px" },
          animate: { scale: [1, 1.2, 1] },
          transition: { duration: 4, repeat: Infinity }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        GlowOrb,
        {
          style: { bottom: "10%", right: "10%", width: "150px", height: "150px" },
          animate: { scale: [1.2, 1, 1.2] },
          transition: { duration: 5, repeat: Infinity }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(InfoContainer, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        PageHeader,
        {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PageTitle, { children: "Catalyst" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              VersionBadge,
              {
                initial: { opacity: 0, scale: 0.8 },
                animate: { opacity: 1, scale: 1 },
                transition: { delay: 0.3, duration: 0.4 },
                children: "版本 1.0.0"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatsContainer, { children: stats.map((stat, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        StatCard,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.1 * index, duration: 0.5 },
          whileHover: { y: -5, scale: 1.02 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatNumber, { children: stat.number }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatLabel, { children: stat.label })
          ]
        },
        index
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Section,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.6, duration: 0.5 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionTitle, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 24 }),
              "开发者信息"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(PersonalInfo, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                InfoCard,
                {
                  $padding: "large",
                  $variant: "elevated",
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: 0.1, duration: 0.4 },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(InfoCardTitle, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 20 }),
                      "基本信息"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(InfoItem, { children: "presented by a cs huster" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                InfoCard,
                {
                  $padding: "large",
                  $variant: "elevated",
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: 0.2, duration: 0.4 },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(InfoCardTitle, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 20 }),
                      "联系方式"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(InfoItem, { children: "3021018823@qq.com" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(InfoItem, { children: "sanstoolow@gmail.com" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { $padding: "large", $variant: "elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ContactInfo, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                ContactItem,
                {
                  href: "https://github.com/Sanstoolow0513",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  initial: { opacity: 0, x: -20 },
                  animate: { opacity: 1, x: 0 },
                  transition: { delay: 0.1, duration: 0.3 },
                  whileHover: { x: 4 },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Github, { size: 20 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "GitHub: Sanstoolow0513" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                ContactItem,
                {
                  href: "https://space.bilibili.com/438770872",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  initial: { opacity: 0, x: -20 },
                  animate: { opacity: 1, x: 0 },
                  transition: { delay: 0.2, duration: 0.3 },
                  whileHover: { x: 4 },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 20 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "B站主页" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                ContactItem,
                {
                  href: "https://github.com/Sanstoolow0513/Catalyst",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  initial: { opacity: 0, x: -20 },
                  animate: { opacity: 1, x: 0 },
                  transition: { delay: 0.3, duration: 0.3 },
                  whileHover: { x: 4 },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { size: 20 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Catalyst 项目" })
                  ]
                }
              )
            ] }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Section,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.8, duration: 0.5 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionTitle, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 24 }),
              "项目特色"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureGrid, { children: features.map((feature, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              FeatureCard,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.1 * index, duration: 0.5 },
                whileHover: { y: -5, scale: 1.02 },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureIcon, { children: feature.icon }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureTitle, { children: feature.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureDescription, { children: feature.description })
                ]
              },
              index
            )) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Section,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 1, duration: 0.5 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionTitle, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 24 }),
              "项目历程"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TimelineSection, { children: timeline.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TimelineItem,
              {
                initial: { opacity: 0, x: -20 },
                animate: { opacity: 1, x: 0 },
                transition: { delay: 0.1 * index, duration: 0.5 },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TimelineDot, {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TimelineContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TimelineDate, { children: item.date }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TimelineTitle, { children: item.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TimelineDescription, { children: item.description })
                  ] })
                ]
              },
              index
            )) })
          ]
        }
      )
    ] })
  ] });
};
export {
  InfoPage as default
};
