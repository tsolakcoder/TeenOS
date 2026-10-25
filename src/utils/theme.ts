export interface AccentTheme {
  id: string;
  name: string;
  hex: string;
  cssVars: {
    '--brand-50': string;
    '--brand-100': string;
    '--brand-200': string;
    '--brand-300': string;
    '--brand-400': string;
    '--brand-500': string;
    '--brand-600': string;
    '--brand-700': string;
  };
}

export const ACCENT_THEMES: Record<string, AccentTheme> = {
  violet: {
    id: 'violet',
    name: 'Neon Violet',
    hex: '#8b5cf6',
    cssVars: {
      '--brand-50': '#f5f3ff',
      '--brand-100': '#ede9fe',
      '--brand-200': '#ddd6fe',
      '--brand-300': '#c4b5fd',
      '--brand-400': '#a78bfa',
      '--brand-500': '#8b5cf6',
      '--brand-600': '#7c3aed',
      '--brand-700': '#6d28d9',
    }
  },
  emerald: {
    id: 'emerald',
    name: 'Fresh Mint',
    hex: '#10b981',
    cssVars: {
      '--brand-50': '#ecfdf5',
      '--brand-100': '#d1fae5',
      '--brand-200': '#a7f3d0',
      '--brand-300': '#6ee7b7',
      '--brand-400': '#34d399',
      '--brand-500': '#10b981',
      '--brand-600': '#059669',
      '--brand-700': '#047857',
    }
  },
  rose: {
    id: 'rose',
    name: 'Cyber Coral',
    hex: '#f43f5e',
    cssVars: {
      '--brand-50': '#fff1f2',
      '--brand-100': '#ffe4e6',
      '--brand-200': '#fecdd3',
      '--brand-300': '#fda4af',
      '--brand-400': '#fb7185',
      '--brand-500': '#f43f5e',
      '--brand-600': '#e11d48',
      '--brand-700': '#be123c',
    }
  },
  amber: {
    id: 'amber',
    name: 'Sunset Glow',
    hex: '#f59e0b',
    cssVars: {
      '--brand-50': '#fffbeb',
      '--brand-100': '#fef3c7',
      '--brand-200': '#fde68a',
      '--brand-300': '#fcd34d',
      '--brand-400': '#fbbf24',
      '--brand-500': '#f59e0b',
      '--brand-600': '#d97706',
      '--brand-700': '#b45309',
    }
  },
  cyan: {
    id: 'cyan',
    name: 'Hyper Cyan',
    hex: '#06b6d4',
    cssVars: {
      '--brand-50': '#ecfeff',
      '--brand-100': '#cffafe',
      '--brand-200': '#a5f3fc',
      '--brand-300': '#67e8f9',
      '--brand-400': '#22d3ee',
      '--brand-500': '#06b6d4',
      '--brand-600': '#0891b2',
      '--brand-700': '#0e7490',
    }
  },
  indigo: {
    id: 'indigo',
    name: 'Electric Indigo',
    hex: '#6366f1',
    cssVars: {
      '--brand-50': '#eef2ff',
      '--brand-100': '#e0e7ff',
      '--brand-200': '#c7d2fe',
      '--brand-300': '#a5b4fc',
      '--brand-400': '#818cf8',
      '--brand-500': '#6366f1',
      '--brand-600': '#4f46e5',
      '--brand-700': '#4338ca',
    }
  }
};

export function applyAccentTheme(themeId: string) {
  const theme = ACCENT_THEMES[themeId] || ACCENT_THEMES.violet;
  const root = document.documentElement;
  Object.entries(theme.cssVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}
