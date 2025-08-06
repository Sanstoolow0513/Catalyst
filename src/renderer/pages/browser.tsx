import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/renderer/components/ui/card'
import { Button } from '@/renderer/components/ui/button'
import { Input } from '@/renderer/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/renderer/components/ui/tabs'
import { Globe, RefreshCw, Plus, X } from 'lucide-react'

interface Tab {
  id: string
  title: string
  url: string
}

export function Browser() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: '新标签页', url: 'about:blank' }
  ])
  const [activeTab, setActiveTab] = useState('1')
  const [url, setUrl] = useState('')

  const addTab = () => {
    const newTab = {
      id: Date.now().toString(),
      title: '新标签页',
      url: 'about:blank'
    }
    setTabs([...tabs, newTab])
    setActiveTab(newTab.id)
  }

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return
    const newTabs = tabs.filter(tab => tab.id !== tabId)
    setTabs(newTabs)
    if (activeTab === tabId) {
      setActiveTab(newTabs[0].id)
    }
  }

  const navigate = () => {
    if (!url.trim()) return
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`
    setTabs(tabs.map(tab => 
      tab.id === activeTab ? { ...tab, url: formattedUrl } : tab
    ))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">内嵌浏览器</h1>
        <p className="text-muted-foreground">
          在应用内浏览网页
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>浏览器</CardTitle>
          <CardDescription>在应用内安全浏览网页</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="输入网址..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && navigate()}
                />
              </div>
              <Button onClick={navigate}>
                <RefreshCw className="h-4 w-4 mr-2" />
                访问
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id} className="relative">
                    <span className="mr-6">{tab.title}</span>
                    <button
                      className="absolute right-1 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        closeTab(tab.id)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </TabsTrigger>
                ))}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={addTab}
                  className="ml-2"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TabsList>
              
              {tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id}>
                  <div className="border rounded-lg p-4 min-h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {tab.url === 'about:blank' ? '输入网址开始浏览' : `正在浏览: ${tab.url}`}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}