import React, { useState } from 'react';

const defaultScope = { clash: true, app: true };

export default function ConfigExport() {
  const [format, setFormat] = useState('both'); // 'json' | 'yaml' | 'both'
  const [scope, setScope] = useState(defaultScope);
  const [target, setTarget] = useState({ type: 'file', filePath: '' }); // 'file' | 'clipboard' | 'string'
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const onToggleScope = (key) => {
    setScope((s) => ({ ...s, [key]: !s[key] }));
  };

  const onExport = async () => {
    setBusy(true);
    setError('');
    setResult(null);
    try {
      const payload = {
        format,
        scope,
        target,
      };
      const res = await window.electronAPI.invoke('config-export:request-export', payload);
      if (res?.status === 'ok') {
        setResult(res);
      } else {
        setError(res?.message || '导出失败');
      }
    } catch (e) {
      setError(e?.message || '导出异常');
    } finally {
      setBusy(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;
    if (result.files) {
      return (
        <div style={{ marginTop: 8 }}>
          <div>文件导出成功:</div>
          {result.files.json && <div>JSON: {result.files.json}</div>}
          {result.files.yaml && <div>YAML: {result.files.yaml}</div>}
        </div>
      );
    }
    if (result.content) {
      const jsonLen = result.content.json ? result.content.json.length : 0;
      const yamlLen = result.content.yaml ? result.content.yaml.length : 0;
      return (
        <div style={{ marginTop: 8 }}>
          <div>导出内容已生成：</div>
          {jsonLen > 0 && <div>JSON 长度: {jsonLen} 字符</div>}
          {yamlLen > 0 && <div>YAML 长度: {yamlLen} 字符</div>}
          {target.type === 'clipboard' && <div>内容已复制到剪贴板</div>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="config-export">
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>导出格式</div>
          <label style={{ display: 'block' }}>
            <input
              type="radio"
              name="format"
              value="both"
              checked={format === 'both'}
              onChange={() => setFormat('both')}
            />
            同时导出 JSON + YAML
          </label>
          <label style={{ display: 'block' }}>
            <input
              type="radio"
              name="format"
              value="json"
              checked={format === 'json'}
              onChange={() => setFormat('json')}
            />
            仅 JSON
          </label>
          <label style={{ display: 'block' }}>
            <input
              type="radio"
              name="format"
              value="yaml"
              checked={format === 'yaml'}
              onChange={() => setFormat('yaml')}
            />
            仅 YAML
          </label>
        </div>

        <div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>导出范围</div>
          <label style={{ display: 'block' }}>
            <input
              type="checkbox"
              checked={!!scope.clash}
              onChange={() => onToggleScope('clash')}
            />
            包含 Clash 配置
          </label>
          <label style={{ display: 'block' }}>
            <input
              type="checkbox"
              checked={!!scope.app}
              onChange={() => onToggleScope('app')}
            />
            包含应用设置
          </label>
        </div>

        <div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>导出目标</div>
          <label style={{ display: 'block' }}>
            <input
              type="radio"
              name="target"
              value="file"
              checked={target.type === 'file'}
              onChange={() => setTarget((t) => ({ ...t, type: 'file' }))}
            />
            保存为文件
          </label>
          <label style={{ display: 'block' }}>
            <input
              type="radio"
              name="target"
              value="clipboard"
              checked={target.type === 'clipboard'}
              onChange={() => setTarget((t) => ({ ...t, type: 'clipboard' }))}
            />
            复制到剪贴板
          </label>
          <label style={{ display: 'block' }}>
            <input
              type="radio"
              name="target"
              value="string"
              checked={target.type === 'string'}
              onChange={() => setTarget((t) => ({ ...t, type: 'string' }))}
            />
            返回字符串
          </label>
          {target.type === 'file' && (
            <div style={{ marginTop: 8 }}>
              <input
                type="text"
                placeholder="可选：自定义文件路径（不含扩展名）"
                value={target.filePath || ''}
                onChange={(e) =>
                  setTarget((t) => ({ ...t, filePath: e.target.value }))
                }
                style={{ width: 320 }}
              />
              <div style={{ color: '#888', fontSize: 12 }}>
                为空时将保存到系统下载目录
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={onExport} disabled={busy || (!scope.app && !scope.clash)}>
          {busy ? '正在导出...' : '开始导出'}
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginTop: 8 }}>
          {error}
        </div>
      )}

      {renderResult()}
    </div>
  );
}