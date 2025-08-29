import { 
  SiIntellijidea,
  SiNodedotjs,
  SiPython,
  SiTencentqq,
  SiObsidian,
  SiBrave
} from 'react-icons/si';
import { VscCode } from 'react-icons/vsc';
import { FaTerminal, FaTools } from 'react-icons/fa';

export const devToolsSimple = [
  // 开发环境
  { 
    id: 'nodejs', 
    name: 'Node.js', 
    description: 'JavaScript 运行时环境', 
    category: '开发环境', 
    icon: SiNodedotjs,
    website: 'https://nodejs.org',
    downloadUrl: 'https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi'
  },
  { 
    id: 'anaconda', 
    name: 'Anaconda', 
    description: 'Python数据科学平台', 
    category: '开发环境', 
    icon: SiPython,
    website: 'https://www.anaconda.com',
    downloadUrl: 'https://repo.anaconda.com/archive/Anaconda3-2024.06-1-Windows-x86_64.exe'
  },
  { 
    id: 'powershell', 
    name: 'PowerShell', 
    description: 'Windows命令行工具', 
    category: '开发环境', 
    icon: FaTerminal,
    website: 'https://docs.microsoft.com/powershell',
    downloadUrl: 'https://docs.microsoft.com/powershell/scripting/install/installing-powershell-on-windows'
  },
  
  // IDE工具
  { 
    id: 'vscode', 
    name: 'Visual Studio Code', 
    description: '免费、开源的代码编辑器，支持多种编程语言', 
    category: 'IDE工具', 
    icon: VscCode,
    website: 'https://code.visualstudio.com',
    downloadUrl: 'https://code.visualstudio.com/sha/download?build=stable&os=win32-x64-user'
  },
  { 
    id: 'vscode-insider', 
    name: 'VS Code Insiders', 
    description: 'VS Code预览版，获取最新功能', 
    category: 'IDE工具', 
    icon: VscCode,
    website: 'https://code.visualstudio.com/insiders',
    downloadUrl: 'https://code.visualstudio.com/sha/download?build=insider&os=win32-x64-user'
  },
  { 
    id: 'intellij', 
    name: 'IntelliJ IDEA', 
    description: '强大的Java IDE，也支持其他语言', 
    category: 'IDE工具', 
    icon: SiIntellijidea,
    website: 'https://www.jetbrains.com/idea/',
    downloadUrl: 'https://download.jetbrains.com/idea/ideaIC-2024.1.4.exe'
  },
  
  // 命令行工具
  { 
    id: 'windows-terminal', 
    name: 'Windows Terminal', 
    description: '现代化的Windows终端应用', 
    category: '命令行工具', 
    icon: FaTerminal,
    website: 'https://aka.ms/terminal',
    downloadUrl: 'https://aka.ms/terminal'
  },
  { 
    id: 'powershell7', 
    name: 'PowerShell 7', 
    description: '跨平台的PowerShell', 
    category: '命令行工具', 
    icon: FaTerminal,
    website: 'https://docs.microsoft.com/powershell',
    downloadUrl: 'https://docs.microsoft.com/powershell/scripting/install/installing-powershell-on-windows'
  },
  { 
    id: 'winget', 
    name: 'Winget', 
    description: 'Windows包管理器', 
    category: '命令行工具', 
    icon: FaTerminal,
    website: 'https://docs.microsoft.com/windows/package-manager/winget',
    downloadUrl: 'https://docs.microsoft.com/windows/package-manager/winget'
  },
  { 
    id: 'choco', 
    name: 'Chocolatey', 
    description: 'Windows软件包管理器', 
    category: '命令行工具', 
    icon: FaTools,
    website: 'https://chocolatey.org',
    downloadUrl: 'https://chocolatey.org/install'
  },
  
  // 个人软件
  { 
    id: 'qq', 
    name: 'QQ', 
    description: '即时通讯软件', 
    category: '个人软件', 
    icon: SiTencentqq,
    website: 'https://im.qq.com',
    downloadUrl: 'https://im.qq.com/pcqq'
  },
  { 
    id: 'obsidian', 
    name: 'Obsidian', 
    description: '知识管理和笔记软件', 
    category: '个人软件', 
    icon: SiObsidian,
    website: 'https://obsidian.md',
    downloadUrl: 'https://obsidian.md/download'
  },
  { 
    id: 'nanazip', 
    name: 'NanaZip', 
    description: '现代化的压缩工具', 
    category: '个人软件', 
    icon: FaTools,
    website: 'https://github.com/M2Team/NanaZip',
    downloadUrl: 'https://github.com/M2Team/NanaZip/releases'
  },
  { 
    id: 'zen-browser', 
    name: 'Zen Browser', 
    description: '注重隐私的浏览器', 
    category: '个人软件', 
    icon: SiBrave,
    website: 'https://zen-browser.app',
    downloadUrl: 'https://zen-browser.app/download'
  }
];