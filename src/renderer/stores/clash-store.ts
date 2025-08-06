import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface ProxyGroup {
  name: string
  type: string
  proxies: Proxy[]
  current: string
}

interface Proxy {
  name: string
  type: string
  server: string
  port: number
  delay?: number
}

interface ClashState {
  // 状态
  status: 'stopped' | 'starting' | 'running' | 'stopping' | 'error'
  version: string
  proxyGroups: ProxyGroup[]
  selectedProxies: Record<string, string>
  logs: string[]
  
  // 动作
  startClash: () => Promise<void>
  stopClash: () => Promise<void>
  restartClash: () => Promise<void>
  updateStatus: (status: ClashState['status']) => void
  setProxyGroups: (groups: ProxyGroup[]) => void
  switchProxy: (groupName: string, proxyName: string) => Promise<void>
  addLog: (log: string) => void
  clearLogs: () => void
}

export const useClashStore = create<ClashState>()(
  devtools(
    (set, get) => ({
      status: 'stopped',
      version: '',
      proxyGroups: [],
      selectedProxies: {},
      logs: [],

      startClash: async () => {
        set({ status: 'starting' })
        try {
          // 模拟API调用
          await new Promise(resolve => setTimeout(resolve, 2000))
          set({ status: 'running', version: 'v1.18.0' })
          get().addLog('Clash started successfully')
        } catch (error) {
          set({ status: 'error' })
          get().addLog(`Failed to start Clash: ${error}`)
        }
      },

      stopClash: async () => {
        set({ status: 'stopping' })
        try {
          await new Promise(resolve => setTimeout(resolve, 1000))
          set({ status: 'stopped' })
          get().addLog('Clash stopped successfully')
        } catch (error) {
          set({ status: 'error' })
          get().addLog(`Failed to stop Clash: ${error}`)
        }
      },

      restartClash: async () => {
        await get().stopClash()
        await new Promise(resolve => setTimeout(resolve, 1000))
        await get().startClash()
      },

      updateStatus: (status) => set({ status }),

      setProxyGroups: (groups) => set({ proxyGroups: groups }),

      switchProxy: async (groupName, proxyName) => {
        try {
          // 模拟API调用
          await new Promise(resolve => setTimeout(resolve, 500))
          set((state) => ({
            selectedProxies: {
              ...state.selectedProxies,
              [groupName]: proxyName
            }
          }))
          get().addLog(`Switched ${groupName} to ${proxyName}`)
        } catch (error) {
          get().addLog(`Failed to switch proxy: ${error}`)
        }
      },

      addLog: (log) => set((state) => ({
        logs: [...state.logs.slice(-99), log] // Keep last 100 logs
      })),

      clearLogs: () => set({ logs: [] })
    }),
    {
      name: 'clash-store'
    }
  )
)