'use client';

import { AppShell } from '@mantine/core';
import { ReactNode } from 'react';
import Header from './header';

interface IMainLayout {
  children: ReactNode;
}

export default function MainLayout({ children }: Readonly<IMainLayout>) {
  return (
    <AppShell id="AppShell">
      <Header />
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
