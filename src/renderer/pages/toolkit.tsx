import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/renderer/components/ui/card'
import { Button } from '@/renderer/components/ui/button'
import { Progress } from '@/renderer/components/ui/progress'
import { Badge } from '@/renderer/components/ui/badge'
import { Wrench, Download, CheckCircle, AlertCircle } from 'lucide-react'

interface Tool {
  id: string
  name: string
  description: string
  category: string
  status: 'available' | 'installed' | 'installing'
  progress?: number
}

const tools: Tool[] = [
  {
    id: 'nodejs',
    name: 'Node.js',
    description: 'JavaScript运行时环境',
    category: '开发环境',
    status: 'available'
  },
  {
    id: 'python',
    name: 'Python',
    description: '通用编程语言',
    category: '开发环境',
    status: 'installed'
  },
  {
    id: 'git',
    name: 'Git',
    description: '版本控制系统',
    category: '开发工具',
    status: 'installed'
  },
  {
    id: 'docker',
    name: 'Docker',
    description: '容器化平台',
    category: '容器化',
    status: 'available'
  }
]

export function Toolkit() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">开发工具箱</h1>
        <p className="text-muted-foreground">
          一键安装和管理开发环境
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                {tool.name}
              </CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{tool.category}</Badge>
                  <div className="flex items-center gap-2">
                    {tool.status === 'installed' && (
                      <Badge className="bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        已安装
                      </Badge>
                    )}
                    {tool.status === 'available' && (
                      <Badge variant="secondary">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        可安装
                      </Badge>
                    )}
                  </div>
                </div>
                
                {tool.status === 'installing' && tool.progress !== undefined && (
                  <div className="space-y-2">
                    <Progress value={tool.progress} className="w-full" />
                    <p className="text-sm text-muted-foreground">
                      安装中... {tool.progress}%
                    </p>
                  </div>
                )}
                
                <Button 
                  className="w-full"
                  disabled={tool.status === 'installed' || tool.status === 'installing'}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {tool.status === 'installed' ? '已安装' : '安装'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}