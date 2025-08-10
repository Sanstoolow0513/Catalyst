// src/renderer/types/electron.d.ts

export interface IMihomoAPI {
  start: () => Promise<{ success: boolean; error?: string }>;
  stop: () => Promise<{ success: boolean; error?: string }>;
  status: () => Promise<{ isRunning: boolean }>;
}

declare global {
  interface Window {
    electronAPI: {
      mihomo: IMihomoAPI;
    };
  }
}