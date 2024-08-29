'use client';

import { MantineProvider } from '@mantine/core';
import { ReactNode } from 'react';
import { GoogleOneTap } from './_components/ui/GoogleOneTap';

export default function Providers({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <MantineProvider defaultColorScheme="dark">
      {children}
      <GoogleOneTap />
    </MantineProvider>
  );
}
