'use client';

import { Home, List, Mail, User, Building } from 'lucide-react';
import { SidebarDesktop } from './sidebar-desktop';
import { SidebarMobile } from './sidebar-mobile';
import { SidebarItems } from '@/types/types';
import { useMediaQuery } from 'usehooks-ts';
import { api } from '@/services/api';
import { useQuery } from 'react-query';
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import EditUserSidebar from './pages/sidebar/editUser';
import { toast } from './ui/use-toast';

export function Sidebar() {
  const isDesktop = useMediaQuery('(min-width: 640px)', {
    initializeWithValue: false,
  });

  const [showModalEditUser, setShowModalEditUser] = useState<boolean>(false);

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
      { label: 'Instância', href: '/instancia', icon: List },
      { label: 'Mensagens', href: '/mensagens', icon: Mail },
    ],
  };

  async function fetchUserLogged() {
    const response = await api.get('/users/me');
    return response.data;
  }

  const { data: userLogged } = useQuery('@users-me', fetchUserLogged, {
    refetchOnWindowFocus: false,
    onError: (error: any) => {
      toast({
        title: 'Erro ao buscar os dados do usuário.',
        description: error?.message || 'Ocorreu um erro desconhecido',
        duration: 3000,
      });
    },
  });

  const sidebarItems = userLogged?.type === 'admin' ? sidebarItemsAdmin : sidebarItemsUser;

  return (
    <div className="absolute">
      {isDesktop ? (
        <SidebarDesktop
          sidebarItems={sidebarItems}
          userLogged={userLogged}
          onEditUser={() => setShowModalEditUser(true)}
        />
      ) : (
        <SidebarMobile
          sidebarItems={sidebarItems}
          userLogged={userLogged}
          onEditUser={() => setShowModalEditUser(true)}
        />
      )}

      <Dialog.Root open={showModalEditUser} onOpenChange={setShowModalEditUser}>
        <EditUserSidebar onClose={() => setShowModalEditUser(false)} userData={userLogged} />
      </Dialog.Root>
    </div>
  );
}
