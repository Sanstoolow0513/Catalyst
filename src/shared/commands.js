/**
 * 命令清单（最小可用）
 * 每个命令：
 * {
 *   id, title, category?, keywords?, run: 'router'|'ipc'|'client', payload?, shortcut?
 * }
 */
export function defaultCommands({ navigate, ipcRenderer }) {
  return [
    // 路由导航
    {
      id: 'app.home',
      title: '打开 首页',
      category: '导航',
      run: 'router',
      payload: { to: '/' },
      keywords: ['home', '首页', '主界面'],
      shortcut: '',
    },
    {
      id: 'app.chat',
      title: '打开 聊天',
      category: '导航',
      run: 'router',
      payload: { to: '/chat' },
      keywords: ['chat', '聊天', 'LLM'],
    },
    {
      id: 'app.settings',
      title: '打开 设置',
      category: '导航',
      run: 'router',
      payload: { to: '/settings' },
      keywords: ['settings', '设置', '配置'],
    },

    // 配置导出
    {
      id: 'config.export.quick',
      title: '配置导出（JSON+YAML 到下载目录）',
      category: '配置',
      run: 'ipc',
      payload: {
        channel: 'config-export:request-export',
        data: {
          format: 'both',
          scope: { clash: true, app: true },
          target: { type: 'file' },
        },
      },
      keywords: ['export', '导出', '配置'],
    },

    // Clash 常用（占位示例，可与实际 IPC 对齐）
    {
      id: 'clash.toggle-system-proxy',
      title: '切换 系统代理 开/关',
      category: 'Clash',
      run: 'ipc',
      payload: {
        channel: 'clash:system:toggleProxy',
        data: null,
      },
      keywords: ['clash', 'proxy', '系统代理', '切换'],
    },

    // 客户端动作
    {
      id: 'app.reload',
      title: '重新加载界面',
      category: '应用',
      run: 'client',
      payload: {
        fn: () => {
          window.location.reload();
        },
      },
      keywords: ['reload', '刷新', '重载'],
      shortcut: '',
    },
  ];
}