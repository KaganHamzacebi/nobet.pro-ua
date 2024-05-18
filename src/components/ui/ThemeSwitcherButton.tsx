"use client";

import { FTSwitch } from "@/components/atomic/FTSwitch";
import { MoonIcon } from "@/components/icons/MoonIcon";
import { SunIcon } from "@/components/icons/SunIcon";
import { Skeleton } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcherButton({ ...props }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Skeleton className="h-[32px] w-[56px] rounded-3xl" />;

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
