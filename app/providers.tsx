'use client';

import {ReactNode} from 'react';
import {MantineProvider} from '@mantine/core';

export default function Providers({children}: Readonly<{children: ReactNode}>) {
  return <MantineProvider defaultColorScheme="dark">{children}</MantineProvider>;
}
