'use client';

import { AppShell } from '@mantine/core';
import { IconHomeFilled, IconUsers } from '@tabler/icons-react';
import NavbarItem, { INavbarItem } from './navbar-item';

const iconSize = 20;

const navbarItems: INavbarItem[] = [
  { href: '/dashboard/duties', label: 'Duties', icon: <IconHomeFilled size={iconSize} /> },
  { href: '/dashboard/assistant-list', label: 'Assistants', icon: <IconUsers size={iconSize} /> }
];

const ProfileItem = null;

export default function DashboardNavbar() {
  return (
    <AppShell.Navbar py="sm">
      <AppShell.Section>
        {ProfileItem}
        {navbarItems.map(item => (
          <NavbarItem key={item.label} {...item} />
        ))}
      </AppShell.Section>
    </AppShell.Navbar>
  );
}
