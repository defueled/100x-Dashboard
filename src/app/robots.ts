import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/app/", "/ref/"],
      },
    ],
    sitemap: "https://100x.lv/sitemap.xml",
    host: "https://100x.lv",
  };
}
