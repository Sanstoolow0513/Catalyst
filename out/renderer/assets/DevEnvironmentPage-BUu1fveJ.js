import { j as jsxRuntimeExports } from "./mui-vendor-CTE_O7gT.js";
import { d as dt, r as reactExports } from "./styled-components-eg0Rzwc1.js";
import { P as PageContainer, C as ContentArea } from "./PageContentLayout-2hb2Ff8p.js";
import "./StatusIndicator-7Lw0xWRZ.js";
import { u as useTheme } from "./index-C-fhFnDy.js";
import { m as motion } from "./animation-DwHr2ej_.js";
import { x as GenIcon } from "./icons-CcncyDR1.js";
import "./react-vendor-BS-dYsv0.js";
import "./routing-oDjbPx8E.js";
const CardContainer = dt(motion.div)`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: ${(props) => {
  if (props.$isGlassMode) {
    return "rgba(30, 41, 59, 0.08)";
  }
  return props.theme?.name === "dark" ? props.theme?.surface || "#1F2937" : props.theme?.surface || "#FFFFFF";
}};
  border: ${(props) => {
  if (props.$isGlassMode) {
    return "1px solid rgba(148, 163, 184, 0.15)";
  }
  return `1px solid ${props.theme?.border || "#E5E7EB"}`;
}};
  border-radius: ${(props) => props.theme?.borderRadius?.medium || "12px"};
  box-shadow: ${(props) => {
  if (props.$isGlassMode) {
    return "0 4px 16px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)";
  }
  return props.theme?.name === "dark" ? "0 1px 2px 0 rgba(0, 0, 0, 0.1)" : "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
}};
  transition: all ${(props) => props.theme?.transition?.normal || "0.2s"} ease;
  cursor: pointer;
  backdrop-filter: ${(props) => props.$isGlassMode ? "blur(16px)" : "none"};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%);
    pointer-events: none;
    border-radius: ${(props) => props.theme?.borderRadius?.medium || "12px"};
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => {
  if (props.$isGlassMode) {
    return "0 8px 32px rgba(0, 0, 0, 0.25), 0 4px 16px rgba(0, 0, 0, 0.15)";
  }
  return props.theme?.name === "dark" ? "0 4px 12px 0 rgba(0, 0, 0, 0.15)" : "0 4px 12px 0 rgba(0, 0, 0, 0.08)";
}};
    border-color: ${(props) => props.theme?.primary?.main || "#2563EB"};
    background: ${(props) => {
  if (props.$isGlassMode) {
    return "rgba(51, 65, 85, 0.12)";
  }
  return props.theme?.name === "dark" ? props.theme?.surfaceVariant || "#374151" : props.theme?.surfaceVariant || "#F9FAFB";
}};
  }
  
  &:active {
    transform: translateY(0);
  }
`;
const IconContainer = dt.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-right: 16px;
  color: ${(props) => props.theme?.primary?.main || "#2563EB"};
  background: ${(props) => props.theme?.name === "dark" ? "rgba(59, 130, 246, 0.1)" : "rgba(37, 99, 235, 0.08)"};
  border-radius: ${(props) => props.theme?.borderRadius?.medium || "12px"};
`;
const ContentContainer = dt.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const ToolName = dt.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => props.theme?.textPrimary || "#111827"};
  line-height: 1.4;
  letter-spacing: -0.01em;
  text-shadow: ${(props) => props.$isGlassMode ? "0 1px 2px rgba(0, 0, 0, 0.1)" : "none"};
`;
const OfficialLink = dt.button`
  font-size: 0.875rem;
  color: ${(props) => props.theme?.textSecondary || "#4B5563"};
  text-decoration: none;
  transition: color ${(props) => props.theme?.transition?.fast || "0.15s"} ease;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  line-height: 1.3;
  letter-spacing: -0.01em;
  text-shadow: ${(props) => props.$isGlassMode ? "0 1px 2px rgba(0, 0, 0, 0.1)" : "none"};
  
  &:hover {
    color: ${(props) => props.theme?.primary?.main || "#2563EB"};
  }
`;
const DownloadButton = dt(motion.button)`
  padding: 6px 14px;
  background: ${(props) => props.theme?.primary?.main || "#2563EB"};
  color: ${(props) => props.theme?.primary?.contrastText || "#FFFFFF"};
  border: none;
  border-radius: ${(props) => props.theme?.borderRadius?.small || "8px"};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all ${(props) => props.theme?.transition?.fast || "0.15s"} ease;
  line-height: 1.3;
  letter-spacing: -0.01em;
  text-shadow: ${(props) => props.$isGlassMode ? "0 1px 2px rgba(0, 0, 0, 0.2)" : "none"};
  
  &:hover {
    background: ${(props) => props.theme?.name === "dark" ? props.theme?.primary?.dark || "#1D4ED8" : props.theme?.primary?.dark || "#1E40AF"};
    transform: scale(1.02);
  }
  
  &:active {
    transform: scale(0.96);
  }
`;
const SimpleToolCard = ({
  icon,
  name,
  officialUrl,
  downloadUrl,
  onDownload,
  className,
  isGlassMode = false
}) => {
  const theme = useTheme();
  const handleDownload = (e) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload();
    } else {
      window.open(downloadUrl, "_blank");
    }
  };
  const handleOfficialLink = (e) => {
    e.stopPropagation();
    e.preventDefault();
    window.open(officialUrl, "_blank", "noopener,noreferrer");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    CardContainer,
    {
      className,
      $isGlassMode: isGlassMode,
      whileHover: { scale: 1.01 },
      whileTap: { scale: 0.99 },
      theme,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(IconContainer, { theme, children: icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(ContentContainer, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ToolName, { $isGlassMode: isGlassMode, theme, children: name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            OfficialLink,
            {
              onClick: handleOfficialLink,
              $isGlassMode: isGlassMode,
              theme,
              children: "官网"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DownloadButton,
          {
            onClick: handleDownload,
            $isGlassMode: isGlassMode,
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            theme,
            children: "下载"
          }
        )
      ]
    }
  );
};
function SiBrave(props) {
  return GenIcon({ "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "path", "attr": { "d": "M15.68 0l2.096 2.38s1.84-.512 2.709.358c.868.87 1.584 1.638 1.584 1.638l-.562 1.381.715 2.047s-2.104 7.98-2.35 8.955c-.486 1.919-.818 2.66-2.198 3.633-1.38.972-3.884 2.66-4.293 2.916-.409.256-.92.692-1.38.692-.46 0-.97-.436-1.38-.692a185.796 185.796 0 01-4.293-2.916c-1.38-.973-1.712-1.714-2.197-3.633-.247-.975-2.351-8.955-2.351-8.955l.715-2.047-.562-1.381s.716-.768 1.585-1.638c.868-.87 2.708-.358 2.708-.358L8.321 0h7.36zm-3.679 14.936c-.14 0-1.038.317-1.758.69-.72.373-1.242.637-1.409.742-.167.104-.065.301.087.409.152.107 2.194 1.69 2.393 1.866.198.175.489.464.687.464.198 0 .49-.29.688-.464.198-.175 2.24-1.759 2.392-1.866.152-.108.254-.305.087-.41-.167-.104-.689-.368-1.41-.741-.72-.373-1.617-.69-1.757-.69zm0-11.278s-.409.001-1.022.206-1.278.46-1.584.46c-.307 0-2.581-.434-2.581-.434S4.119 7.152 4.119 7.849c0 .697.339.881.68 1.243l2.02 2.149c.192.203.59.511.356 1.066-.235.555-.58 1.26-.196 1.977.384.716 1.042 1.194 1.464 1.115.421-.08 1.412-.598 1.776-.834.364-.237 1.518-1.19 1.518-1.554 0-.365-1.193-1.02-1.413-1.168-.22-.15-1.226-.725-1.247-.95-.02-.227-.012-.293.284-.851.297-.559.831-1.304.742-1.8-.089-.495-.95-.753-1.565-.986-.615-.232-1.799-.671-1.947-.74-.148-.068-.11-.133.339-.175.448-.043 1.719-.212 2.292-.052.573.16 1.552.403 1.632.532.079.13.149.134.067.579-.081.445-.5 2.581-.541 2.96-.04.38-.12.63.288.724.409.094 1.097.256 1.333.256s.924-.162 1.333-.256c.408-.093.329-.344.288-.723-.04-.38-.46-2.516-.541-2.961-.082-.445-.012-.45.067-.579.08-.129 1.059-.372 1.632-.532.573-.16 1.845.009 2.292.052.449.042.487.107.339.175-.148.069-1.332.508-1.947.74-.615.233-1.476.49-1.565.986-.09.496.445 1.241.742 1.8.297.558.304.624.284.85-.02.226-1.026.802-1.247.95-.22.15-1.413.804-1.413 1.169 0 .364 1.154 1.317 1.518 1.554.364.236 1.355.755 1.776.834.422.079 1.08-.4 1.464-1.115.384-.716.039-1.422-.195-1.977-.235-.555.163-.863.355-1.066l2.02-2.149c.341-.362.68-.546.68-1.243 0-.697-2.695-3.96-2.695-3.96s-2.274.436-2.58.436c-.307 0-.972-.256-1.585-.461-.613-.205-1.022-.206-1.022-.206z" }, "child": [] }] })(props);
}
function SiIntellijidea(props) {
  return GenIcon({ "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "path", "attr": { "d": "M0 0v24h24V0zm3.723 3.111h5v1.834h-1.39v6.277h1.39v1.834h-5v-1.834h1.444V4.945H3.723zm11.055 0H17v6.5c0 .612-.055 1.111-.222 1.556-.167.444-.39.777-.723 1.11-.277.279-.666.557-1.11.668a3.933 3.933 0 0 1-1.445.278c-.778 0-1.444-.167-1.944-.445a4.81 4.81 0 0 1-1.279-1.056l1.39-1.555c.277.334.555.555.833.722.277.167.611.278.945.278.389 0 .721-.111 1-.389.221-.278.333-.667.333-1.278zM2.222 19.5h9V21h-9z" }, "child": [] }] })(props);
}
function SiNodedotjs(props) {
  return GenIcon({ "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "path", "attr": { "d": "M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z" }, "child": [] }] })(props);
}
function SiObsidian(props) {
  return GenIcon({ "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "path", "attr": { "d": "M19.355 18.538a68.967 68.959 0 0 0 1.858-2.954.81.81 0 0 0-.062-.9c-.516-.685-1.504-2.075-2.042-3.362-.553-1.321-.636-3.375-.64-4.377a1.707 1.707 0 0 0-.358-1.05l-3.198-4.064a3.744 3.744 0 0 1-.076.543c-.106.503-.307 1.004-.536 1.5-.134.29-.29.6-.446.914l-.31.626c-.516 1.068-.997 2.227-1.132 3.59-.124 1.26.046 2.73.815 4.481.128.011.257.025.386.044a6.363 6.363 0 0 1 3.326 1.505c.916.79 1.744 1.922 2.415 3.5zM8.199 22.569c.073.012.146.02.22.02.78.024 2.095.092 3.16.29.87.16 2.593.64 4.01 1.055 1.083.316 2.198-.548 2.355-1.664.114-.814.33-1.735.725-2.58l-.01.005c-.67-1.87-1.522-3.078-2.416-3.849a5.295 5.295 0 0 0-2.778-1.257c-1.54-.216-2.952.19-3.84.45.532 2.218.368 4.829-1.425 7.531zM5.533 9.938c-.023.1-.056.197-.098.29L2.82 16.059a1.602 1.602 0 0 0 .313 1.772l4.116 4.24c2.103-3.101 1.796-6.02.836-8.3-.728-1.73-1.832-3.081-2.55-3.831zM9.32 14.01c.615-.183 1.606-.465 2.745-.534-.683-1.725-.848-3.233-.716-4.577.154-1.552.7-2.847 1.235-3.95.113-.235.223-.454.328-.664.149-.297.288-.577.419-.86.217-.47.379-.885.46-1.27.08-.38.08-.72-.014-1.043-.095-.325-.297-.675-.68-1.06a1.6 1.6 0 0 0-1.475.36l-4.95 4.452a1.602 1.602 0 0 0-.513.952l-.427 2.83c.672.59 2.328 2.316 3.335 4.711.09.21.175.43.253.653z" }, "child": [] }] })(props);
}
function SiPython(props) {
  return GenIcon({ "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "path", "attr": { "d": "M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z" }, "child": [] }] })(props);
}
function SiTencentqq(props) {
  return GenIcon({ "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "path", "attr": { "d": "M21.395 15.035a40 40 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 17.351 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a39 39 0 0 0-.802 2.264c-1.021 3.283-.69 4.643-.438 4.673.54.065 2.103-2.472 2.103-2.472 0 1.469.756 3.387 2.394 4.771-.612.188-1.363.479-1.845.835-.434.32-.379.646-.301.778.343.578 5.883.369 7.482.189 1.6.18 7.14.389 7.483-.189.078-.132.132-.458-.301-.778-.483-.356-1.233-.646-1.846-.836 1.637-1.384 2.393-3.302 2.393-4.771 0 0 1.563 2.537 2.103 2.472.251-.03.581-1.39-.438-4.673" }, "child": [] }] })(props);
}
function VscCode(props) {
  return GenIcon({ "attr": { "viewBox": "0 0 16 16", "fill": "currentColor" }, "child": [{ "tag": "path", "attr": { "d": "M4.708 5.578L2.061 8.224l2.647 2.646-.708.708-3-3V7.87l3-3 .708.708zm7-.708L11 5.578l2.647 2.646L11 10.87l.708.708 3-3V7.87l-3-3zM4.908 13l.894.448 5-10L9.908 3l-5 10z" }, "child": [] }] })(props);
}
function FaCode(props) {
  return GenIcon({ "attr": { "viewBox": "0 0 640 512" }, "child": [{ "tag": "path", "attr": { "d": "M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.9 6.4-8.5 10.1-14.9 8.2zm-114-112.2l43.5-46.4c4.6-4.9 4.3-12.7-.8-17.2L117 256l90.6-79.7c5.1-4.5 5.5-12.3.8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8 247.2c-5.1 4.7-5.1 12.8 0 17.5l144.1 135.1c4.9 4.6 12.5 4.4 17-.5zm327.2.6l144.1-135.1c5.1-4.7 5.1-12.8 0-17.5L492.1 112.1c-4.8-4.5-12.4-4.3-17 .5L431.6 159c-4.6 4.9-4.3 12.7.8 17.2L523 256l-90.6 79.7c-5.1 4.5-5.5 12.3-.8 17.2l43.5 46.4c4.5 4.9 12.1 5.1 17 .6z" }, "child": [] }] })(props);
}
function FaLaptopCode(props) {
  return GenIcon({ "attr": { "viewBox": "0 0 640 512" }, "child": [{ "tag": "path", "attr": { "d": "M255.03 261.65c6.25 6.25 16.38 6.25 22.63 0l11.31-11.31c6.25-6.25 6.25-16.38 0-22.63L253.25 192l35.71-35.72c6.25-6.25 6.25-16.38 0-22.63l-11.31-11.31c-6.25-6.25-16.38-6.25-22.63 0l-58.34 58.34c-6.25 6.25-6.25 16.38 0 22.63l58.35 58.34zm96.01-11.3l11.31 11.31c6.25 6.25 16.38 6.25 22.63 0l58.34-58.34c6.25-6.25 6.25-16.38 0-22.63l-58.34-58.34c-6.25-6.25-16.38-6.25-22.63 0l-11.31 11.31c-6.25 6.25-6.25 16.38 0 22.63L386.75 192l-35.71 35.72c-6.25 6.25-6.25 16.38 0 22.63zM624 416H381.54c-.74 19.81-14.71 32-32.74 32H288c-18.69 0-33.02-17.47-32.77-32H16c-8.8 0-16 7.2-16 16v16c0 35.2 28.8 64 64 64h512c35.2 0 64-28.8 64-64v-16c0-8.8-7.2-16-16-16zM576 48c0-26.4-21.6-48-48-48H112C85.6 0 64 21.6 64 48v336h512V48zm-64 272H128V64h384v256z" }, "child": [] }] })(props);
}
function FaRocket(props) {
  return GenIcon({ "attr": { "viewBox": "0 0 512 512" }, "child": [{ "tag": "path", "attr": { "d": "M505.12019,19.09375c-1.18945-5.53125-6.65819-11-12.207-12.1875C460.716,0,435.507,0,410.40747,0,307.17523,0,245.26909,55.20312,199.05238,128H94.83772c-16.34763.01562-35.55658,11.875-42.88664,26.48438L2.51562,253.29688A28.4,28.4,0,0,0,0,264a24.00867,24.00867,0,0,0,24.00582,24H127.81618l-22.47457,22.46875c-11.36521,11.36133-12.99607,32.25781,0,45.25L156.24582,406.625c11.15623,11.1875,32.15619,13.15625,45.27726,0l22.47457-22.46875V488a24.00867,24.00867,0,0,0,24.00581,24,28.55934,28.55934,0,0,0,10.707-2.51562l98.72834-49.39063c14.62888-7.29687,26.50776-26.5,26.50776-42.85937V312.79688c72.59753-46.3125,128.03493-108.40626,128.03493-211.09376C512.07526,76.5,512.07526,51.29688,505.12019,19.09375ZM384.04033,168A40,40,0,1,1,424.05,128,40.02322,40.02322,0,0,1,384.04033,168Z" }, "child": [] }] })(props);
}
function FaTerminal(props) {
  return GenIcon({ "attr": { "viewBox": "0 0 640 512" }, "child": [{ "tag": "path", "attr": { "d": "M257.981 272.971L63.638 467.314c-9.373 9.373-24.569 9.373-33.941 0L7.029 444.647c-9.357-9.357-9.375-24.522-.04-33.901L161.011 256 6.99 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L257.981 239.03c9.373 9.372 9.373 24.568 0 33.941zM640 456v-32c0-13.255-10.745-24-24-24H312c-13.255 0-24 10.745-24 24v32c0 13.255 10.745 24 24 24h304c13.255 0 24-10.745 24-24z" }, "child": [] }] })(props);
}
function FaTools(props) {
  return GenIcon({ "attr": { "viewBox": "0 0 512 512" }, "child": [{ "tag": "path", "attr": { "d": "M501.1 395.7L384 278.6c-23.1-23.1-57.6-27.6-85.4-13.9L192 158.1V96L64 0 0 64l96 128h62.1l106.6 106.6c-13.6 27.8-9.2 62.3 13.9 85.4l117.1 117.1c14.6 14.6 38.2 14.6 52.7 0l52.7-52.7c14.5-14.6 14.5-38.2 0-52.7zM331.7 225c28.3 0 54.9 11 74.9 31l19.4 19.4c15.8-6.9 30.8-16.5 43.8-29.5 37.1-37.1 49.7-89.3 37.9-136.7-2.2-9-13.5-12.1-20.1-5.5l-74.4 74.4-67.9-11.3L334 98.9l74.4-74.4c6.6-6.6 3.4-17.9-5.7-20.2-47.4-11.7-99.6.9-136.6 37.9-28.5 28.5-41.9 66.1-41.2 103.6l82.1 82.1c8.1-1.9 16.5-2.9 24.7-2.9zm-103.9 82l-56.7-56.7L18.7 402.8c-25 25-25 65.5 0 90.5s65.5 25 90.5 0l123.6-123.6c-7.6-19.9-9.9-41.6-5-62.7zM64 472c-13.2 0-24-10.8-24-24 0-13.3 10.7-24 24-24s24 10.7 24 24c0 13.2-10.7 24-24 24z" }, "child": [] }] })(props);
}
function FaUser(props) {
  return GenIcon({ "attr": { "viewBox": "0 0 448 512" }, "child": [{ "tag": "path", "attr": { "d": "M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z" }, "child": [] }] })(props);
}
const devToolsSimple = [
  // 开发环境
  {
    id: "nodejs",
    name: "Node.js",
    description: "JavaScript 运行时环境",
    category: "开发环境",
    icon: SiNodedotjs,
    website: "https://nodejs.org",
    downloadUrl: "https://nodejs.org/download/"
  },
  {
    id: "anaconda",
    name: "Anaconda",
    description: "Python数据科学平台",
    category: "开发环境",
    icon: SiPython,
    website: "https://www.anaconda.com",
    downloadUrl: "https://www.anaconda.com/download"
  },
  {
    id: "powershell",
    name: "PowerShell",
    description: "Windows命令行工具",
    category: "开发环境",
    icon: FaTerminal,
    website: "https://docs.microsoft.com/powershell",
    downloadUrl: "https://docs.microsoft.com/powershell/scripting/install/installing-powershell-on-windows"
  },
  // IDE工具
  {
    id: "vscode",
    name: "Visual Studio Code",
    description: "免费、开源的代码编辑器，支持多种编程语言",
    category: "IDE工具",
    icon: VscCode,
    website: "https://code.visualstudio.com",
    downloadUrl: "https://code.visualstudio.com/download"
  },
  {
    id: "vscode-insider",
    name: "VS Code Insiders",
    description: "VS Code预览版，获取最新功能",
    category: "IDE工具",
    icon: VscCode,
    website: "https://code.visualstudio.com/insiders",
    downloadUrl: "https://code.visualstudio.com/insiders"
  },
  {
    id: "intellij",
    name: "IntelliJ IDEA",
    description: "强大的Java IDE，也支持其他语言",
    category: "IDE工具",
    icon: SiIntellijidea,
    website: "https://www.jetbrains.com/idea/",
    downloadUrl: "https://www.jetbrains.com/idea/download/"
  },
  // 命令行工具
  {
    id: "windows-terminal",
    name: "Windows Terminal",
    description: "现代化的Windows终端应用",
    category: "命令行工具",
    icon: FaTerminal,
    website: "https://aka.ms/terminal",
    downloadUrl: "https://aka.ms/terminal"
  },
  {
    id: "powershell7",
    name: "PowerShell 7",
    description: "跨平台的PowerShell",
    category: "命令行工具",
    icon: FaTerminal,
    website: "https://docs.microsoft.com/powershell",
    downloadUrl: "https://docs.microsoft.com/powershell/scripting/install/installing-powershell-on-windows"
  },
  {
    id: "winget",
    name: "Winget",
    description: "Windows包管理器",
    category: "命令行工具",
    icon: FaTerminal,
    website: "https://docs.microsoft.com/windows/package-manager/winget",
    downloadUrl: "https://docs.microsoft.com/windows/package-manager/winget"
  },
  {
    id: "choco",
    name: "Chocolatey",
    description: "Windows软件包管理器",
    category: "命令行工具",
    icon: FaTools,
    website: "https://chocolatey.org",
    downloadUrl: "https://chocolatey.org/install"
  },
  // 个人软件
  {
    id: "qq",
    name: "QQ",
    description: "即时通讯软件",
    category: "个人软件",
    icon: SiTencentqq,
    website: "https://im.qq.com",
    downloadUrl: "https://im.qq.com/pcqq"
  },
  {
    id: "obsidian",
    name: "Obsidian",
    description: "知识管理和笔记软件",
    category: "个人软件",
    icon: SiObsidian,
    website: "https://obsidian.md",
    downloadUrl: "https://obsidian.md/download"
  },
  {
    id: "nanazip",
    name: "NanaZip",
    description: "现代化的压缩工具",
    category: "个人软件",
    icon: FaTools,
    website: "https://github.com/M2Team/NanaZip",
    downloadUrl: "https://github.com/M2Team/NanaZip/releases"
  },
  {
    id: "zen-browser",
    name: "Zen Browser",
    description: "注重隐私的浏览器",
    category: "个人软件",
    icon: SiBrave,
    website: "https://zen-browser.app",
    downloadUrl: "https://zen-browser.app/download"
  }
];
const GlassPageContainer = dt.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
  width: 100%;
  background-color: ${(props) => props.$isGlassMode ? "transparent" : props.theme?.background || "#F9FAFB"};
  color: ${(props) => props.theme?.textPrimary || "#111827"};
  padding: ${(props) => props.theme?.spacing?.xl || "32px"};
  position: relative;
  
  ${(props) => props.$isGlassMode && `
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 50%, rgba(96, 165, 250, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(167, 139, 250, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 40% 20%, rgba(244, 114, 182, 0.04) 0%, transparent 50%),
        linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(147, 51, 234, 0.02) 100%);
      z-index: -2;
      pointer-events: none;
    }
    
    &::after {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 60% 40%, rgba(34, 197, 94, 0.03) 0%, transparent 40%),
        radial-gradient(circle at 20% 80%, rgba(251, 146, 60, 0.03) 0%, transparent 40%);
      z-index: -1;
      pointer-events: none;
      animation: ambient 20s ease-in-out infinite;
    }
  `}
  
  @keyframes ambient {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.7; }
  }
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${(props) => props.$isGlassMode ? "rgba(51, 65, 85, 0.2)" : "transparent"};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.$isGlassMode ? "rgba(148, 163, 184, 0.3)" : props.theme?.border || "#E5E7EB"};
    border-radius: 4px;
    
    &:hover {
      background: ${(props) => props.$isGlassMode ? "rgba(203, 213, 225, 0.5)" : props.theme?.textTertiary || "#9CA3AF"};
    }
  }
`;
const WelcomeCard = dt(motion.div)`
  background: ${(props) => {
  if (props.$isGlassMode) {
    return "linear-gradient(135deg, rgba(30, 41, 59, 0.08) 0%, rgba(51, 65, 85, 0.05) 100%)";
  }
  return props.$isDarkMode ? "linear-gradient(135deg, #1e293b, #334155)" : "linear-gradient(135deg, #f8fafc, #e2e8f0)";
}};
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: ${(props) => {
  if (props.$isGlassMode) {
    return "1px solid rgba(148, 163, 184, 0.15)";
  }
  return `1px solid ${props.theme.border}`;
}};
  position: relative;
  overflow: hidden;
  min-height: 160px;
  display: flex;
  align-items: center;
  backdrop-filter: ${(props) => props.$isGlassMode ? "blur(20px)" : "none"};
  box-shadow: ${(props) => {
  if (props.$isGlassMode) {
    return "0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)";
  }
  return "0 1px 2px rgba(0, 0, 0, 0.05)";
}};
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: ${(props) => {
  if (props.$isGlassMode) {
    return "radial-gradient(circle, rgba(96, 165, 250, 0.08) 0%, rgba(167, 139, 250, 0.05) 30%, transparent 60%)";
  }
  return props.$isDarkMode ? "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)" : "radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)";
}};
    animation: float 12s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${(props) => props.$isGlassMode ? "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)" : "none"};
    pointer-events: none;
    border-radius: 20px;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
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
  text-shadow: ${(props) => props.$isGlassMode ? "0 2px 12px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.2), 0 0 20px rgba(96, 165, 250, 0.1)" : "none"};
  position: relative;
  z-index: 2;
`;
const WelcomeSubtitle = dt.p`
  font-size: 1.1rem;
  color: ${(props) => props.theme.textSecondary};
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  text-shadow: ${(props) => props.$isGlassMode ? "0 1px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.15), 0 0 15px rgba(167, 139, 250, 0.08)" : "none"};
  position: relative;
  z-index: 2;
`;
const StatsGrid = dt.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;
const StatCard = dt(motion.div)`
  background: ${(props) => props.$isGlassMode ? "rgba(30, 41, 59, 0.08)" : props.theme.surface};
  border: ${(props) => props.$isGlassMode ? "1px solid rgba(148, 163, 184, 0.15)" : `1px solid ${props.theme.border}`};
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  backdrop-filter: ${(props) => props.$isGlassMode ? "blur(16px)" : "none"};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.$isGlassMode ? "0 8px 32px rgba(0, 0, 0, 0.25), 0 4px 16px rgba(0, 0, 0, 0.15)" : "0 8px 25px rgba(0, 0, 0, 0.1)"};
  }
`;
const StatIcon = dt.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  background: ${(props) => props.$color}20;
  color: ${(props) => props.$color};
`;
const StatValue = dt.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.textPrimary};
  margin-bottom: 0.5rem;
`;
const StatLabel = dt.div`
  font-size: 0.9rem;
  color: ${(props) => props.theme.textSecondary};
`;
const PageLayout = dt.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin: 0 auto;
  width: 100%;
`;
const CategorySection = dt.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const CategoryHeader = dt.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;
const CategoryIcon = dt.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${(props) => props.theme?.borderRadius?.medium || "12px"};
  background: ${(props) => props.theme?.name === "dark" ? "rgba(59, 130, 246, 0.2)" : "rgba(37, 99, 235, 0.1)"};
  color: ${(props) => props.theme?.primary?.main || "#2563EB"};
`;
const CategoryTitle = dt.h2`
  margin: 0;
  color: ${(props) => props.theme?.textPrimary || "#111827"};
  font-size: 1.5rem;
  font-weight: 600;
`;
const CategoryDescription = dt.p`
  margin: 0;
  color: ${(props) => props.theme?.textSecondary || "#4B5563"};
  font-size: 0.9rem;
  line-height: 1.5;
`;
const ToolsGrid = dt.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  
  @media (min-width: 768px) {
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  }
  
  @media (min-width: 1280px) {
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  }
`;
const categories = [
  {
    id: "开发环境",
    name: "开发环境",
    description: "必需的开发运行时环境和工具",
    icon: FaCode
  },
  {
    id: "IDE工具",
    name: "IDE工具",
    description: "集成开发环境和代码编辑器",
    icon: FaLaptopCode
  },
  {
    id: "命令行工具",
    name: "命令行工具",
    description: "提高开发效率的命令行工具",
    icon: FaTerminal
  },
  {
    id: "个人软件",
    name: "个人软件",
    description: "日常开发和工作中常用的软件",
    icon: FaUser
  }
];
const DevEnvironmentPage = () => {
  const { isDarkMode, themeMode } = useTheme();
  const isGlassMode = themeMode.includes("Glass");
  const [installingTools, setInstallingTools] = reactExports.useState(/* @__PURE__ */ new Set());
  const handleDownload = (toolId) => {
    setInstallingTools((prev) => new Set(prev).add(toolId));
    setTimeout(() => {
      setInstallingTools((prev) => {
        const newSet = new Set(prev);
        newSet.delete(toolId);
        return newSet;
      });
    }, 2e3);
  };
  const totalTools = devToolsSimple.length;
  const environmentTools = devToolsSimple.filter((tool) => tool.category === "开发环境").length;
  const ideTools = devToolsSimple.filter((tool) => tool.category === "IDE工具").length;
  const cliTools = devToolsSimple.filter((tool) => tool.category === "命令行工具").length;
  const stats = [
    {
      icon: FaTools,
      value: totalTools,
      label: "总工具数",
      color: "#3B82F6"
    },
    {
      icon: FaCode,
      value: environmentTools,
      label: "开发环境",
      color: "#10B981"
    },
    {
      icon: FaLaptopCode,
      value: ideTools,
      label: "IDE工具",
      color: "#8B5CF6"
    },
    {
      icon: FaTerminal,
      value: cliTools,
      label: "命令行工具",
      color: "#F59E0B"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PageContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ContentArea, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassPageContainer, { $isGlassMode: isGlassMode, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      WelcomeCard,
      {
        $isDarkMode: isDarkMode,
        $isGlassMode: isGlassMode,
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(WelcomeContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(WelcomeTitle, { $isGlassMode: isGlassMode, children: [
            "开发环境工具",
            /* @__PURE__ */ jsxRuntimeExports.jsx(FaRocket, { size: 32 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(WelcomeSubtitle, { $isGlassMode: isGlassMode, children: "这里收录了开发所需的各类工具，包括开发环境、IDE、命令行工具和个人常用软件。一站式解决您的开发环境配置需求。" })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatsGrid, { children: stats.map((stat, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.1 * index + 0.3, duration: 0.5 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          StatCard,
          {
            $isGlassMode: isGlassMode,
            whileHover: { scale: 1.02 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatIcon, { $color: stat.color, children: /* @__PURE__ */ jsxRuntimeExports.jsx(stat.icon, { size: 24 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatValue, { children: stat.value }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatLabel, { children: stat.label })
            ]
          }
        )
      },
      stat.label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageLayout, { children: categories.map((category) => {
      const categoryTools = devToolsSimple.filter((tool) => tool.category === category.id);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(CategorySection, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CategoryHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryIcon, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(category.icon, { size: 20 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryTitle, { children: category.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryDescription, { children: category.description })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ToolsGrid, { children: categoryTools.map((tool) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              SimpleToolCard,
              {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(tool.icon, { size: 24 }),
                name: tool.name,
                officialUrl: tool.website,
                downloadUrl: tool.downloadUrl,
                onDownload: () => handleDownload(tool.id),
                className: installingTools.has(tool.id) ? "installing" : "",
                isGlassMode
              }
            )
          },
          tool.id
        )) })
      ] }, category.id);
    }) })
  ] }) }) });
};
export {
  DevEnvironmentPage as default
};
