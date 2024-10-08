'use client';

import { AppShell } from '@mantine/core';
import { useDisclosure, useHeadroom } from '@mantine/hooks';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import Header from './header';

interface IShell {
  children: ReactNode;
}

export default function Shell({ children }: Readonly<IShell>) {
  const pathname = usePathname();
  const pinned = useHeadroom({ fixedAt: 120 });
  const inDashboard = pathname.startsWith('/dashboard');
  const [navbarCollapsed] = useDisclosure(!inDashboard);

  return (
    <AppShell
      header={{ height: { base: 60, md: 70, lg: 80 }, collapsed: !pinned }}
      navbar={{
        width: inDashboard ? { base: 200, md: 300, lg: 400 } : 0,
        breakpoint: 'sm',
        collapsed: { mobile: true, desktop: navbarCollapsed }
      }}
      padding="md">
      <Header />
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
