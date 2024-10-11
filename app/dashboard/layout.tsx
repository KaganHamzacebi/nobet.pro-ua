import DashboardNavbar from '@/components/ui/navbar/dashboard-navbar';
import { ReactNode } from 'react';

interface IDashboardLayout {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Readonly<IDashboardLayout>) {
  return (
    <>
      <DashboardNavbar />
      {children}
    </>
  );
}
