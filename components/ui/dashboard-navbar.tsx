'use client';

import { AppShell } from '@mantine/core';
import { useSearchParams } from 'next/navigation';

const navbarWidth = 300;

export default function DashboardNavbar() {
  const searchParams = useSearchParams();
  const isNavbarCollapsed = searchParams.get('isNavbarCollapsed') === 'true';

  return (
    <AppShell
      navbar={{
        width: navbarWidth,
        breakpoint: 'sm',
        collapsed: { mobile: false, desktop: isNavbarCollapsed }
      }}>
      <AppShell.Navbar>Navbar</AppShell.Navbar>
    </AppShell>
  );
}
