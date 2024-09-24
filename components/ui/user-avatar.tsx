import { Avatar, Menu } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import Link from 'next/link';

export default function UserAvatar() {
  return (
    <Menu shadow="md">
      <Menu.Target>
        <Avatar radius="xl" className="cursor-pointer" />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item component={Link} href="/dashboard">
          Dashboard
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item color="red" leftSection={<IconLogout size={16} />}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
