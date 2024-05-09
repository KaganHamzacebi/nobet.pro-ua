"use client";

import { Switch } from "@nextui-org/react";
import { type ReactNode } from "react";

export function FTSwitch({ children, ...props }: Readonly<FTSwitchProps>) {
  return <Switch {...props}>{children}</Switch>;
}

type FTSwitchProps = {
  children: Readonly<ReactNode>;
};
