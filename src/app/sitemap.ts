import type { MetadataRoute } from "next";

const baseUrl = "https://nobet.pro";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "yearly",
      alternates: {
        languages: {
          en: baseUrl + "/en",
          tr: baseUrl + "/tr",
        },
      },
    },
  ];
}
