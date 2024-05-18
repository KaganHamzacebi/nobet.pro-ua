"use client";

import { usePathname, useRouter } from "@/navigation";
import { type Selection } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { EnglishFlag } from "../icons/EnglishFlag";
import { TurkishFlag } from "../icons/TurkishFlag";

export function LocaleSwitcher({ ...props }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const onLocaleChange = (keys: Selection) => {
    const selectedLocale = Array.from(keys)?.[0];
    // @ts-expect-error -- TypeScript will validate that only known `params`
    router.replace({ pathname, params }, { locale: selectedLocale });
  };

  const locales = [
    { key: "en", value: "English", icon: <EnglishFlag className="h-6 w-6" /> },
    { key: "tr", value: "Turkish", icon: <TurkishFlag className="h-6 w-6" /> },
  ];

  return (
    <Select
      {...props}
      items={locales}
      autoFocus={false}
      variant="bordered"
      selectionMode="single"
      defaultSelectedKeys={[locale]}
      onSelectionChange={onLocaleChange}
      renderValue={(items) => {
        return items.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            {item.data?.icon}
            {item.data?.value}
          </div>
        ));
      }}
    >
      {(locale) => (
        <SelectItem key={locale.key} startContent={locale.icon}>
          {locale.value}
        </SelectItem>
      )}
    </Select>
  );
}
