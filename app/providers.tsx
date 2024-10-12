'use client';

import NotificationCenter from '@/components/ui/notification-center';
import { theme } from '@/theme';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ReactNode, Suspense } from 'react';

export default function Providers({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications />
      <Suspense>
        <NotificationCenter />
      </Suspense>
      {children}
    </MantineProvider>
  );
}
