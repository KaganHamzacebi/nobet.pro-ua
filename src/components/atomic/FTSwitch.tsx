"use client";

import { Switch } from "@nextui-org/react";

export function FTSwitch({ ...props }) {
  return <Switch {...props}>{props.children}</Switch>;
}
