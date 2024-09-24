import { ReactNode } from 'react';
import Header from './header';

interface IShell {
  children: ReactNode;
}

const headerWidth = 80;

export default function Shell({ children }: Readonly<IShell>) {
  return (
    <div className="transition-[padding] duration-200">
      <Header height={headerWidth} />
      <main style={{ paddingTop: headerWidth }}>{children}</main>
    </div>
  );
}
