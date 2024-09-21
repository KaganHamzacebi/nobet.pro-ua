'use client';

import { AppShell } from '@mantine/core';

export default function Header() {
  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>Header</AppShell.Header>
    </AppShell>
  );
}
