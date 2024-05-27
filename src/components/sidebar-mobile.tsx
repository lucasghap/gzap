'use client';

import { SidebarItems } from '@/types/types';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { SidebarButtonSheet as SidebarButton } from './sidebar-button';
import { usePathname } from 'next/navigation';
import { Separator } from './ui/separator';

interface SidebarMobileProps {
  sidebarItems: SidebarItems;
}

export function SidebarMobile(props: SidebarMobileProps) {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost" className=" relative left-3 top-3" onClick={() => console.log('teste')}>
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="px-3 py-4" hideClose>
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 bg-lime-600">
          <span className="mx-3 text-lg font-semibold text-foreground">G-Zap</span>
          <SheetClose asChild>
            <Button className="size-7 p-0" variant="ghost">
              <X size={15} />
            </Button>
          </SheetClose>
        </SheetHeader>
        <div className="h-full">
          <div className="mt-5 flex w-full flex-col gap-1">
            {props.sidebarItems.links.map((link, idx) => (
              <Link key={idx} href={link.href}>
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
              <SidebarButton size="sm" icon={LogOut} className="w-full">
                Log Out
              </SidebarButton>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
