'use client';

import { AppShell, Skeleton } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const navbarWidth = 300;

const NavbarSkeleton = () => <Skeleton width={navbarWidth} height="100%" />;

export default function DashboardNavbar() {
  const searchParams = useSearchParams();
  const isNavbarCollapsed = searchParams.get('isNavbarCollapsed') === 'true';

  return (
    <Suspense fallback={<NavbarSkeleton />}>
      <AppShell
        navbar={{
          width: navbarWidth,
          breakpoint: 'sm',
          collapsed: { mobile: false, desktop: isNavbarCollapsed }
        }}>
        <AppShell.Navbar>Navbar</AppShell.Navbar>
      </AppShell>
    </Suspense>
  );
}
