import DashboardNavbar from '@/components/ui/dashboard-navbar';
import { ReactNode, Suspense } from 'react';

interface IDashboardLayout {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Readonly<IDashboardLayout>) {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardNavbar />
      </Suspense>
      {children}
    </>
  );
}
