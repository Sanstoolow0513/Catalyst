import { useEffect } from 'react'
import { useClashStore } from '@/renderer/stores/clash-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/renderer/components/ui/card'
import { Button } from '@/renderer/components/ui/button'
import { Badge } from '@/renderer/components/ui/badge'
import { Skeleton } from '@/renderer/components/ui/skeleton'
import { Globe, Server, Zap, Clock } from 'lucide-react'

export function Proxy() {
  const { proxyGroups, selectedProxies, switchProxy, status } = useClashStore()

  // 模拟加载代理数据
  useEffect(() => {
    if (status === 'running') {
      // 模拟API调用获取代理数据
      setTimeout(() => {
        useClashStore.setState({
          proxyGroups: [
            {
              name: 'Proxy',
              type: 'Selector',
              current: 'Singapore',
              proxies: [
                { name: 'Singapore', type: 'ss', server: 'sg.example.com', port: 443, delay: 45 },
                { name: 'Japan', type: 'ss', server: 'jp.example.com', port: 443, delay: 78 },
                { name: 'USA', type: 'ss', server: 'us.example.com', port: 443, delay: 156 },
                { name: 'Germany', type: 'ss', server: 'de.example.com', port: 443, delay: 234 }
              ]
            },
            {
              name: 'Auto',
              type: 'UrlTest',
              current: 'Singapore',
              proxies: [
                { name: 'Singapore', type: 'ss', server: 'sg.example.com', port: 443, delay: 45 },
                { name: 'Japan', type: 'ss', server: 'jp.example.com', port: 443, delay: 78 },
                { name: 'USA', type: 'ss', server: 'us.example.com', port: 443, delay: 156 }
              ]
            }
          ]
        })
      }, 1000)
    }
  }, [status])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">代理管理</h1>
        <p className="text-muted-foreground">
          管理您的代理节点和规则
        </p>
      </div>

      {status !== 'running' ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">请先启动Clash代理服务</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {proxyGroups.map((group) => (
            <Card key={group.name}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  {group.name}
                  <Badge variant="outline">{group.type}</Badge>
                </CardTitle>
                <CardDescription>
                  当前选择: {selectedProxies[group.name] || group.current}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {group.proxies.map((proxy) => (
                    <div
                      key={proxy.name}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{proxy.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {proxy.server}:{proxy.port}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{proxy.delay}ms</span>
                        </div>
                        <Button
                          size="sm"
                          variant={
                            (selectedProxies[group.name] || group.current) === proxy.name
                              ? 'default'
                              : 'outline'
                          }
                          onClick={() => switchProxy(group.name, proxy.name)}
                        >
                          选择
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}