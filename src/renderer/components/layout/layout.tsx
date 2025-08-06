import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { cn } from '@/renderer/lib/utils'
import { Button } from '@/renderer/components/ui/button'
import { ScrollArea } from '@/renderer/components/ui/scroll-area'
import { 
  Home, 
  Globe, 
  Wrench, 
  Browser, 
  Settings,
  Minimize2,
  Maximize2,
  X,
  Sun,
  Moon
} from 'lucide-react'
import { useTheme } from '@/renderer/components/theme-provider'

const navigation = [
  { name: '仪表盘', href: '/', icon: Home },
  { name: '代理', href: '/proxy', icon: Globe },
  { name: '工具箱', href: '/toolkit', icon: Wrench },
  { name: '浏览器', href: '/browser', icon: Browser },
  { name: '设置', href: '/settings', icon: Settings },
]

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleMinimize = () => {
    window.electron?.window?.minimize()
  }

  const handleMaximize = () => {
    window.electron?.window?.maximize()
  }

  const handleClose = () => {
    window.electron?.window?.close()
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className={cn(
        "flex flex-col border-r bg-card",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        <div className="flex items-center justify-between p-4 border-b">
          {!sidebarCollapsed && (
            <h1 className="text-lg font-semibold">Catalyst</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="ml-auto"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1 px-3 py-2">
          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </a>
              )
            })}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Title Bar */}
        <header className="draggable flex items-center justify-between h-12 border-b bg-card px-4">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-medium">
              {navigation.find(item => item.href === location.pathname)?.name || 'Catalyst'}
            </h2>
          </div>
          
          <div className="non-draggable flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <Button variant="ghost" size="icon" onClick={handleMinimize}>
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleMaximize}>
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="container mx-auto p-6">
              {children}
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  )
}