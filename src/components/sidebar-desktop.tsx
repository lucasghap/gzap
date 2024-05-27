'use client';

import { SidebarButton } from './sidebar-button';
import { SidebarItems } from '@/types/types';
import Link from 'next/link';
import { Separator } from './ui/separator';

import { Button } from './ui/button';

import { LogOut, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';

interface SidebarDesktopProps {
  sidebarItems: SidebarItems;
}

export function SidebarDesktop(props: SidebarDesktopProps) {
  const pathname = usePathname();

  const { push } = useRouter();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[270px] max-w-xs border-r bg-emerald-500">
      <div className="h-full px-3 py-4">
        <h3 className="mx-3 text-lg font-semibold text-foreground">G-ZAP</h3>
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
            {props.sidebarItems.extras}
          </div>
          <div className="absolute bottom-3 left-0 w-full px-3">
            <Separator className="absolute -top-3 left-0 w-full" />

            <div className="flex">
              <div className="flex w-full items-center justify-between">
                <div className="flex gap-2">
                  <span>Vinícius Souza</span>
                </div>
              </div>
              <SidebarButton size="sm" icon={LogOut} className="w-full" onClick={() => push('/')}>
                Log Out
              </SidebarButton>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
