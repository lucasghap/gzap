'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <div className="flex items-center space-x-2">
      <Sun className={cn('size-[1.2rem] transition-opacity', isDarkMode ? 'opacity-40' : 'opacity-100')} />
      <Switch checked={isDarkMode} onCheckedChange={handleToggle} aria-label="Toggle theme" />
      <Moon className={cn('size-[1.2rem] transition-opacity', isDarkMode ? 'opacity-100' : 'opacity-40')} />
    </div>
  );
}
