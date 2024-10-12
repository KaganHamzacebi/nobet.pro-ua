'use client';

import { navbarItems } from '@/libs/mock/navbar-items';
import classes from '@/styles/DashboardNavbar.module.scss';
import { AppShell, ScrollArea } from '@mantine/core';
import { NavbarItem } from './navbar-item';
import { UserButton } from './user-button';

export default function DashboardNavbar() {
  const links = navbarItems.map(item => <NavbarItem {...item} key={item.label} />);

  return (
    <AppShell.Navbar>
      <nav className={classes.navbar}>
        <ScrollArea className={classes.links}>
          <div className={classes.linksInner}>{links}</div>
        </ScrollArea>

        <div className={classes.footer}>
          <UserButton />
        </div>
      </nav>
    </AppShell.Navbar>
  );
}
