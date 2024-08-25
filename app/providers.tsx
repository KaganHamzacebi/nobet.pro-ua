'use client';

import { MantineProvider } from '@mantine/core';
import { ReactNode } from 'react';

export default function Providers({ children }: Readonly<{ children: ReactNode }>) {
  return <MantineProvider defaultColorScheme="dark">{children}</MantineProvider>;
}
