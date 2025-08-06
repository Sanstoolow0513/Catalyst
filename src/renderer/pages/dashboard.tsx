import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/renderer/components/ui/card'
import { Button } from '@/renderer/components/ui/button'
import { Badge } from '@/renderer/components/ui/badge'
import { Progress } from '@/renderer/components/ui/progress'
import { Skeleton } from '@/renderer/components/ui/skeleton'
import { 
  Activity, 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Globe,
  Power,
  PowerOff
} from 'lucide-react'
import { useClashStore } from '@/renderer/stores/clash-store'

interface SystemInfo {
  cpu: {
    usage: number
    model: string
    cores: number
  }
  memory: {
    total: number
    used: number
    free: number
    usage: number
  }
  disk: {
    total: number
    used: number
    free: number
    usage: number
  }
  network: {
    up: number
    down: number
  }
}

export function Dashboard() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const { status, startClash, stopClash } = useClashStore()

  useEffect(() => {
    // 模拟获取系统信息
    const fetchSystemInfo = () => {
      setSystemInfo({
        cpu: {
          usage: Math.floor(Math.random() * 100),
          model: 'Intel Core i7-12700H',
          cores: 14
        },
        memory: {
          total: 16 * 1024 * 1024 * 1024, // 16GB
          used: Math.floor(Math.random() * 8 * 1024 * 1024 * 1024),
          free: 0,
          usage: Math.floor(Math.random() * 100)
        },
        disk: {
          total: 512 * 1024 * 1024 * 1024, // 512GB
          used: Math.floor(Math.random() * 200 * 1024 * 1024 * 1024),
          free: 0,
          usage: Math.floor(Math.random() * 50)
        },
        network: {
          up: Math.floor(Math.random() * 1000),
          down: Math.floor(Math.random() * 5000)
        }
      })
      
      if (systemInfo) {
        systemInfo.memory.free = systemInfo.memory.total - systemInfo.memory.used
        systemInfo.memory.usage = (systemInfo.memory.used / systemInfo.memory.total) * 100
        systemInfo.disk.free = systemInfo.disk.total - systemInfo.disk.used
        systemInfo.disk.usage = (systemInfo.disk.used / systemInfo.disk.total) * 100
      }
      
      setLoading(false)
    }

    fetchSystemInfo()
    const interval = setInterval(fetchSystemInfo, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleClashToggle = async () => {
    if (status === 'running') {
      await stopClash()
    } else {
      await startClash()
    }
  }

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color = "text-foreground" 
  }: { 
    title: string
    value: string | number
    icon: React.ElementType
    color?: string
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">仪表盘</h1>
        <p className="text-muted-foreground">
          系统状态和Clash代理管理概览
        </p>
      </div>

      {/* Clash Status */}
      <Card>
        <CardHeader>
          <CardTitle>Clash代理状态</CardTitle>
          <CardDescription>
            管理您的代理连接状态
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge 
                variant={status === 'running' ? 'default' : 'secondary'}
                className="flex items-center space-x-1"
              >
                <Globe className="h-3 w-3" />
                <span>
                  {status === 'running' ? '运行中' : '已停止'}
                </span>
              </Badge>
            </div>
            <Button 
              size="sm" 
              onClick={handleClashToggle}
              variant={status === 'running' ? 'destructive' : 'default'}
            >
              {status === 'running' ? (
                <>
                  <PowerOff className="h-4 w-4 mr-2" />
                  停止代理
                </>
              ) : (
                <>
                  <Power className="h-4 w-4 mr-2" />
                  启动代理
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="CPU使用率"
          value={`${systemInfo?.cpu.usage}%`}
          icon={Cpu}
          color={systemInfo?.cpu.usage && systemInfo.cpu.usage > 80 ? "text-red-500" : "text-green-500"}
        />
        <StatCard
          title="内存使用率"
          value={`${systemInfo?.memory.usage.toFixed(1)}%`}
          icon={MemoryStick}
          color={systemInfo?.memory.usage && systemInfo.memory.usage > 80 ? "text-red-500" : "text-blue-500"}
        />
        <StatCard
          title="磁盘使用率"
          value={`${systemInfo?.disk.usage.toFixed(1)}%`}
          icon={HardDrive}
          color={systemInfo?.disk.usage && systemInfo.disk.usage > 80 ? "text-red-500" : "text-purple-500"}
        />
        <StatCard
          title="网络活动"
          value={`↑${(systemInfo?.network.up || 0) / 1024:.1f}KB/s ↓${(systemInfo?.network.down || 0) / 1024:.1f}KB/s`}
          icon={Activity}
          color="text-orange-500"
        />
      </div>

      {/* Resource Usage */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>内存使用</CardTitle>
            <CardDescription>
              已使用 {systemInfo && (systemInfo.memory.used / 1024 / 1024 / 1024).toFixed(1)}GB / 
              {(systemInfo.memory.total / 1024 / 1024 / 1024).toFixed(1)}GB
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={systemInfo?.memory.usage} className="w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>磁盘使用</CardTitle>
            <CardDescription>
              已使用 {systemInfo && (systemInfo.disk.used / 1024 / 1024 / 1024).toFixed(1)}GB / 
              {(systemInfo.disk.total / 1024 / 1024 / 1024).toFixed(1)}GB
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={systemInfo?.disk.usage} className="w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}