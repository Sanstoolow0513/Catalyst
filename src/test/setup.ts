import '@testing-library/jest-dom';

// Mock Electron APIs
const mockIpcRenderer = {
  invoke: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
  send: jest.fn(),
};

// Mock Electron
Object.defineProperty(global, 'window', {
  value: {
    ipcRenderer: mockIpcRenderer,
  },
  writable: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});