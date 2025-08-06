import React from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useCommandPalette } from '../hooks/useCommandPalette';
import { defaultCommands } from '../../shared/commands';

const overlayRootId = 'command-palette-root';

function ensureOverlayRoot() {
  let el = document.getElementById(overlayRootId);
  if (!el) {
    el = document.createElement('div');
    el.id = overlayRootId;
    document.body.appendChild(el);
  }
  return el;
}

function useHotkey(toggle) {
  React.useEffect(() => {
    const handler = (e) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      if ((isMac && e.metaKey && e.key.toLowerCase() === 'k') ||
          (!isMac && e.ctrlKey && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggle]);
}

export default function CommandPalette() {
  const { isOpen, close, toggle, register, list } = useCommandPalette();
  const [query, setQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);
  const navigate = useNavigate();

  // 初次挂载注册默认命令
  React.useEffect(() => {
    register(defaultCommands({ navigate, electronAPI: window.electronAPI }));
  }, [register, navigate]);

  useHotkey(toggle);

  const all = list();
  const items = React.useMemo(() => {
    if (!query) return all;
    const q = query.trim().toLowerCase();
    return all.filter((c) => {
      const text = [c.title, c.id, ...(c.keywords || [])].join(' ').toLowerCase();
      return text.includes(q);
    });
  }, [all, query]);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [query, isOpen]);

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = items[activeIndex];
      if (cmd) {
        runCommand(cmd, { navigate, electronAPI: window.electronAPI });
        close();
      }
    }
  };

  if (!isOpen) return null;

  const overlay = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.35)',
        zIndex: 10000,
      }}
      onClick={close}
    >
      <div
        style={{
          width: '720px',
          maxWidth: '94vw',
          margin: '10vh auto 0',
          background: '#1c1c28',
          border: '1px solid #2a2a3a',
          borderRadius: 12,
          boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '12px 14px', borderBottom: '1px solid #2a2a3a' }}>
          <input
            autoFocus
            placeholder="输入命令或关键字...（Ctrl/Cmd + K 打开/关闭）"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            style={{
              width: '100%',
              outline: 'none',
              border: 'none',
              background: 'transparent',
              color: '#fff',
              fontSize: 16,
            }}
          />
        </div>
        <div style={{ maxHeight: 420, overflow: 'auto' }}>
          {items.length === 0 ? (
            <div style={{ padding: 16, color: '#9aa0a6' }}>未找到匹配命令</div>
          ) : (
            items.map((c, idx) => (
              <div
                key={c.id}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => {
                  runCommand(c, { navigate, electronAPI: window.electronAPI });
                  close();
                }}
                style={{
                  padding: '10px 14px',
                  background: idx === activeIndex ? '#2a2a3a' : 'transparent',
                  color: '#e3e3e3',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{c.title}</div>
                  {c.category && (
                    <div style={{ fontSize: 12, color: '#9aa0a6', marginTop: 2 }}>
                      {c.category}
                    </div>
                  )}
                </div>
                {c.shortcut && (
                  <kbd style={{
                    background: '#111',
                    border: '1px solid #333',
                    borderRadius: 6,
                    padding: '2px 6px',
                    color: '#ccc',
                    fontSize: 12,
                  }}>{c.shortcut}</kbd>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(overlay, ensureOverlayRoot());
}

function runCommand(cmd, ctx) {
  try {
    if (cmd.run === 'router') {
      if (typeof cmd.payload?.to === 'string') {
        ctx.navigate(cmd.payload.to);
      }
    } else if (cmd.run === 'ipc') {
      if (cmd.payload?.channel) {
        ctx.electronAPI.invoke(cmd.payload.channel, cmd.payload.data ?? null);
      }
    } else if (cmd.run === 'client' && typeof cmd.payload?.fn === 'function') {
      cmd.payload.fn();
    }
  } catch (e) {
    console.error('[CommandPalette] 命令执行失败:', e);
  }
}