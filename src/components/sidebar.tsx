'use client';

import { Home, List, Mail, User } from 'lucide-react';
import { SidebarDesktop } from './sidebar-desktop';
import { SidebarItems } from '@/types/types';

import { useMediaQuery } from 'usehooks-ts';
import { SidebarMobile } from './sidebar-mobile';

const sidebarItems: SidebarItems = {
  links: [
    { label: 'Home', href: '/gzap', icon: Home },
    { label: 'Instância ', href: '/instancia', icon: List },
    { label: 'Mensagens', href: '/mensagens', icon: Mail },
    {
      href: '/usuarios',
      icon: User,
      label: 'Usuários',
    },
  ],
};

export function Sidebar() {
  const isDesktop = useMediaQuery('(min-width: 640px)', {
    initializeWithValue: false,
  });

  if (isDesktop) {
    return <SidebarDesktop sidebarItems={sidebarItems} />;
  }

  return <SidebarMobile sidebarItems={sidebarItems} />;
}
