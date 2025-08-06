import React from 'react';

const CommandPaletteContext = React.createContext(null);

export function CommandPaletteProvider({ children, initialCommands = [] }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [commands, setCommands] = React.useState(initialCommands);

  const register = React.useCallback((cmds) => {
    setCommands((prev) => {
      const map = new Map();
      [...prev, ...cmds].forEach((c) => map.set(c.id, c));
      return Array.from(map.values());
    });
  }, []);

  const list = React.useCallback(() => commands, [commands]);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen((v) => !v), []);

  const value = React.useMemo(
    () => ({ isOpen, open, close, toggle, register, list }),
    [isOpen, open, close, toggle, register, list]
  );

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette() {
  const ctx = React.useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error('useCommandPalette 必须在 CommandPaletteProvider 内使用');
  }
  return ctx;
}