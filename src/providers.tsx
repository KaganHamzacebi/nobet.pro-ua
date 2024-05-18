"use client";

import { TRPCReactProvider } from "@/trpc/react";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

export function Providers({ children }: Readonly<ProviderProps>) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
        <QueryClientProvider client={new QueryClient()}>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </QueryClientProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}

type ProviderProps = {
  children: Readonly<ReactNode>;
};
