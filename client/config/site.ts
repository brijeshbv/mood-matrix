export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Mood Matrix",
  description:
    "Mood Matrix - Your Productivity App for Work Day Sentiment Analysis.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Docs",
      href: "/docs",
    },
    {
      title: "About",
      href: "/about",
    },
  ],
  links: {
    github: "https://github.com/brijeshbv/mood-matrix",
    docs: "/docs",
  },
}
