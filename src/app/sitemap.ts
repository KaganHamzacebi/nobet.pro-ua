import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://nobet.pro",
      lastModified: new Date(),
      changeFrequency: "yearly",
      alternates: {
        languages: {
          en: "https://nobet.pro/en",
          tr: "https://nobet.pro/tr",
        },
      },
    },
  ];
}
