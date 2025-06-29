/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://fluentzy.com",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ["/dashboard/*", "/api/*", "/sign-in/*", "/sign-up/*", "/(auth)/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/api", "/sign-in", "/sign-up", "/(auth)"],
      },
    ],
    additionalSitemaps: [
      `${
        process.env.NEXT_PUBLIC_APP_URL || "https://fluentzy.com"
      }/sitemap.xml`,
    ],
  },
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: path === "/" ? 1.0 : config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
