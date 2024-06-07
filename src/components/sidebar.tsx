'use client';

import { Home, List, Mail, User, Building } from 'lucide-react';
import { SidebarDesktop } from './sidebar-desktop';
import { SidebarItems } from '@/types/types';

import { useMediaQuery } from 'usehooks-ts';
import { SidebarMobile } from './sidebar-mobile';
import { api } from '@/services/api';
import { useQuery } from 'react-query';

export function Sidebar() {
  const isDesktop = useMediaQuery('(min-width: 640px)', {
    initializeWithValue: false,
  });

  const sidebarItemsAdmin: SidebarItems = {
    links: [
      { label: 'Home', href: '/gzap', icon: Home },
      { label: 'Usuários', href: '/usuarios', icon: User },
      { label: 'Empresas', href: '/empresas', icon: Building },
    ],
  };

  const sidebarItemsUser: SidebarItems = {
    links: [
      { label: 'Home', href: '/gzap', icon: Home },
      { label: 'Instância ', href: '/instancia', icon: List },
      { label: 'Mensagens', href: '/mensagens', icon: Mail },
    ],
  };

  async function fetchUserLogged() {
    const response = await api.get('/users/me');
    return response.data;
  }

  const { data: userLogged } = useQuery('@users-me', fetchUserLogged, {
    refetchOnWindowFocus: false,
  });

  const sidebarItems = userLogged?.type === 'admin' ? sidebarItemsAdmin : sidebarItemsUser;

  if (isDesktop) {
    return <SidebarDesktop sidebarItems={sidebarItems} userLogged={userLogged} />;
  }

  return <SidebarMobile sidebarItems={sidebarItems} userLogged={userLogged} />;
}
