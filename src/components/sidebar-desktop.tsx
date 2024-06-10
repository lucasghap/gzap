'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { SidebarButton } from './sidebar-button';
import { SidebarItems } from '@/types/types';
import Link from 'next/link';
import { Separator } from './ui/separator';

import { LogOut, PencilLine } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import { signOut } from '@/utils/session';
import { useState } from 'react';

interface FormInputs {
  name: string;
  email: string;
  username: string;
  password: string;
  companyId: string;
}

interface SidebarDesktopProps {
  sidebarItems: SidebarItems;
  userLogged: FormInputs;
  onEditUser: () => void;
}

export function SidebarDesktop(props: SidebarDesktopProps) {
  const pathname = usePathname();
  const { push } = useRouter();

  const endSession = () => {
    signOut();
    push('/');
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[270px] max-w-xs border-r bg-gradient-to-b from-emerald-800 to-emerald-400">
      <div className="h-full px-3 py-4">
        <h3 className="mx-3 text-lg font-semibold text-white">G-ZAP</h3>
        <div className="mt-5">
          <div className="flex w-full flex-col gap-1">
            {props.sidebarItems.links.map((link, index) => (
              <Link key={index} href={link.href}>
                <SidebarButton
                  variant={pathname === link.href ? 'secondary' : 'ghost'}
                  icon={link.icon}
                  className="w-full"
                >
                  {link.label}
                </SidebarButton>
              </Link>
            ))}
          </div>
          <div className="absolute bottom-3 left-0 w-full px-3">
            <Separator className="absolute -top-3 left-0 w-full" />

            <div className="grid">
              <SidebarButton size="sm" icon={PencilLine} className="w-full" onClick={props.onEditUser}>
                {props.userLogged?.name}
              </SidebarButton>
              <SidebarButton size="sm" icon={LogOut} className="w-full" onClick={endSession}>
                Log Out
              </SidebarButton>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
