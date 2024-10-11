import { ElementProps, NavLink, NavLinkProps } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export interface INavbarItem extends NavLinkProps, ElementProps<typeof Link, keyof NavLinkProps> {
  label: string;
  href: string;
  icon?: ReactNode;
}

export default function NavbarItem({ label, href, icon }: Readonly<INavbarItem>) {
  const isActive = usePathname() === href;
  console.log(usePathname());

  return (
    <NavLink
      variant="default"
      component={Link}
      href={href}
      label={label}
      fw="bold"
      leftSection={icon}
      active={isActive}
    />
  );
}
