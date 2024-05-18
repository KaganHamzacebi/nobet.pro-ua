import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("Home");

  return <h1>{t("title")}</h1>;
}
