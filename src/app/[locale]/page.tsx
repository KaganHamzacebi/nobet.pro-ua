import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

export default async function Home({ params: { locale } }: Readonly<Props>) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("Home");

  return <h1>{t("title")}</h1>;
}

type Props = {
  params: { locale: string };
};
