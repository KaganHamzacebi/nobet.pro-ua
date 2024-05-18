import Link from "next/link";
import { type ReactNode } from "react";

export async function FTLink({
  href,
  locale,
  children,
  ...props
}: Readonly<FTLinkProps>) {
  return (
    <Link href={href} locale={locale} {...props}>
      {children}
    </Link>
  );
}

type FTLinkProps = {
  locale?: "en" | "tr";
  href: string;
  children?: ReactNode;
};
