"use client";

import { FTSwitch } from "@/components/atomic/FTSwitch";
import { MoonIcon } from "@/components/icons/MoonIcon";
import { SunIcon } from "@/components/icons/SunIcon";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcherButton(props: Readonly<ThemeSwitcherProps>) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return;

  return (
    <FTSwitch
      {...props}
      defaultSelected={theme === "dark"}
      size="lg"
      color="secondary"
      onValueChange={(isSelected: boolean) =>
        setTheme(isSelected ? "dark" : "light")
      }
      startContent={<SunIcon />}
      endContent={<MoonIcon />}
    />
  );
}

type ThemeSwitcherProps = {
  className: string;
};
