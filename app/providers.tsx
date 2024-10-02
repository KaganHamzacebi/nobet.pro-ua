'use client';

import NotificationCenter from '@/components/ui/notification-center';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ReactNode } from 'react';

export default function Providers({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <MantineProvider defaultColorScheme="dark">
      <Notifications />
      <NotificationCenter />
      {children}
    </MantineProvider>
  );
}
