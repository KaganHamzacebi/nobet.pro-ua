"use client";

import { Button } from "@nextui-org/button";
import { type ReactNode } from "react";

export function FTButton({ children, ...props }: Readonly<FTButtonProps>) {
  return <Button {...props}>{children}</Button>;
}

type FTButtonProps = {
  children: Readonly<ReactNode>;
};
