import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/renderer/components/ui/card'
import { Button } from '@/renderer/components/ui/button'
import { Switch } from '@/renderer/components/ui/switch'
import { Label } from '@/renderer/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/renderer/components/ui/select'
import { Settings2, Save, RotateCcw } from 'lucide-react'

interface SettingsData {
  autoStart: boolean
  minimizeToTray: boolean
  theme: 'light' | 'dark' | 'system'
  language: string
  proxyPort: number
  mixedPort: number
  externalController: string
}

export function Settings() {
  const [settings, setSettings] = useState<SettingsData>({
    autoStart: true,
    minimizeToTray: false,
    theme: 'system',
    language: 'zh-CN',
    proxyPort: 7890,
    mixedPort: 7891,
    externalController: '127.0.0.1:9090'
  })

  const handleSave = () => {
    // 保存设置逻辑
    console.log('Saving settings:', settings)
  }

  const handleReset = () => {
    setSettings({
      autoStart: true,
      minimizeToTray: false,
      theme: 'system',
      language: 'zh-CN',
      proxyPort: 7890,
      mixedPort: 7891,
      externalController: '127.0.0.1:9090'
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">设置</h1>
        <p className="text-muted-foreground">
          配置应用和代理设置
        </p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              通用设置
            </CardTitle>
            <CardDescription>应用的基本配置</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>开机自动启动</Label>
                <p className="text-sm text-muted-foreground">系统启动时自动运行Catalyst</p>
              </div>
              <Switch
                checked={settings.autoStart}
                onCheckedChange={(checked) => setSettings({ ...settings, autoStart: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>最小化到系统托盘</Label>
                <p className="text-sm text-muted-foreground">关闭窗口时最小化到托盘</p>
              </div>
              <Switch
                checked={settings.minimizeToTray}
                onCheckedChange={(checked) => setSettings({ ...settings, minimizeToTray: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label>主题</Label>
              <Select
                value={settings.theme}
                onValueChange={(value: 'light' | 'dark' | 'system') => setSettings({ ...settings, theme: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">浅色</SelectItem>
                  <SelectItem value="dark">深色</SelectItem>
                  <SelectItem value="system">跟随系统</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>语言</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => setSettings({ ...settings, language: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zh-CN">简体中文</SelectItem>
                  <SelectItem value="en-US">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>代理设置</CardTitle>
            <CardDescription>Clash代理配置</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>HTTP代理端口</Label>
              <Input
                type="number"
                value={settings.proxyPort}
                onChange={(e) => setSettings({ ...settings, proxyPort: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label>混合端口</Label>
              <Input
                type="number"
                value={settings.mixedPort}
                onChange={(e) => setSettings({ ...settings, mixedPort: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label>外部控制器地址</Label>
              <Input
                value={settings.externalController}
                onChange={(e) => setSettings({ ...settings, externalController: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            重置
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            保存设置
          </Button>
        </div>
      </div>
    </div>
  )
}