import { getTranslations } from "next-intl/server";
import React from "react";

export default async function Home() {
  const t = await getTranslations("Home");

  return <h1>{t("title")}</h1>;
}
