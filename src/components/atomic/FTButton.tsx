"use client";

import { Button } from "@nextui-org/button";

export function FTButton({ ...props }) {
  return <Button {...props}>{props.children}</Button>;
}
