'use client';

import { SidebarItems } from '@/types/types';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { LogOut, Menu, PencilLine, X } from 'lucide-react';
import Link from 'next/link';
import { SidebarButtonSheet as SidebarButton } from './sidebar-button';
import { usePathname } from 'next/navigation';
import { Separator } from './ui/separator';
import { useRouter } from 'next/router';
import { signOut } from '@/utils/session';
import { ModeToggle } from './pages/sidebar/toogleMode';

interface FormInputs {
  name: string;
  email: string;
  username: string;
  password: string;
  companyId: string;
}

interface SidebarMobileProps {
  sidebarItems: SidebarItems;
  userLogged: FormInputs;
  onEditUser: () => void;
}

export function SidebarMobile(props: SidebarMobileProps) {
  const pathname = usePathname();
  const { push } = useRouter();

  const endSession = () => {
    signOut();
    push('/');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost" className=" relative left-3 top-3">
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="px-3 py-4" hideClose>
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 bg-gradient-to-b from-emerald-800 to-emerald-400">
          <div className="flex justify-between">
            <span className="mx-3 text-lg font-semibold text-foreground">G-Zap</span>
            <ModeToggle />
          </div>
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
      </SheetContent>
    </Sheet>
  );
}
