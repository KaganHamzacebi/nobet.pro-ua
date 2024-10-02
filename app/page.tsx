import Login from '@/components/ui/login';
import { Suspense } from 'react';

export default function Home() {
  return (
    <div className="mt-20 flex h-full w-full items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    </div>
  );
}
