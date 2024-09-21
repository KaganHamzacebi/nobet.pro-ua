'use client';

import { AppShell } from '@mantine/core';
import { useSearchParams } from 'next/navigation';

export default function DashboardNavbar() {
  const searchParams = useSearchParams();
  const isNavbarCollapsed = searchParams.get('isNavbarCollapsed') === 'true';

  return (
    <AppShell
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: false, desktop: isNavbarCollapsed }
      }}>
      <AppShell.Navbar>Navbar</AppShell.Navbar>
    </AppShell>
  );
}
