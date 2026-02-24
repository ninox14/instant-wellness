'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { FileUp, LayoutDashboard, TableOfContents } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: <LayoutDashboard /> },
    { label: 'Import CSV', href: '/dashboard/import', icon: <FileUp /> },
    { label: 'Orders', href: '/dashboard/orders', icon: <TableOfContents /> },
  ];

  return (
    <aside className="h-screen border-r ">
      <Sidebar>
        <SidebarHeader className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <LayoutDashboard className="text-blue-700" />
            <h2 className="text-xl font-semibold text-gray-950">
              {' '}
              Admin dashboard
            </h2>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-3 text-gray-500">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <SidebarMenuItem
                className={cn(
                  'flex items-center gap-3 p-3 rounded hover:bg-blue-50',
                  pathname === item.href &&
                    'bg-blue-50 font-bold text-blue-700',
                )}
              >
                {item.icon} {item.label}
              </SidebarMenuItem>
            </Link>
          ))}
        </SidebarContent>
      </Sidebar>
    </aside>
  );
}
