/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://woxayz.fr",
  generateRobotsTxt: true,
  exclude: ["/admin", "/admin/*", "/api/*"],
  changefreq: "weekly",
  priority: 0.7,
};
