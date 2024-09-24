'use client';

import { Group } from '@mantine/core';
import { useDisclosure, useHeadroom } from '@mantine/hooks';
import { useEffect } from 'react';
import Logo from './logo';
import NavLink, { INavLink } from './nav-link';
import UserAvatar from './user-avatar';

const navLinks: INavLink[] = [
  {
    name: 'How To',
    href: '/how-to'
  },
  {
    name: 'Contact Us',
    href: '/contact-us'
  }
];

interface IHeader {
  height: number;
}

export default function Header({ height }: Readonly<IHeader>) {
  const [collapsed, { open, close }] = useDisclosure(false);
  const pinned = useHeadroom({ fixedAt: 120 });

  useEffect(() => {
    if (pinned) close();
    else open();
  }, [pinned]);

  return (
    <header
      style={{ height: height, marginTop: collapsed ? -height : 0 }}
      className={`absolute flex w-full flex-row items-center justify-between border-b border-silver p-4 transition-[margin] duration-300`}>
      <Logo />
      <Group gap="sm" className="absolute left-1/2 -translate-x-1/2">
        {navLinks.map(link => (
          <NavLink key={link.href} name={link.name} href={link.href} />
        ))}
      </Group>
      <UserAvatar />
    </header>
  );
}
