import React from 'react';

// Automatically scan for all components in the components directory
// This enables file-system driven component discovery
const modules = import.meta.glob('./components/*.tsx', {
  eager: true,
});

export const viewRegistry: Record<string, React.FC<any>> = {};

for (const path in modules) {
  const mod: any = modules[path];
  // Extract filename without extension to use as the key
  const name = path
    .split('/')
    .pop()!
    .replace('.tsx', '');

  viewRegistry[name] = mod.default;
}