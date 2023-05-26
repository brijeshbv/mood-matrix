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
      title: "About",
      href: "/about",
    },
    {
      title: "Docs",
      href: "/docs",
      },
      {
      title: "Summary",
      href: "/summary",
    },
    {
      title: "Users",
      href: "/users",
    },
  ],
  links: {
    github: "https://github.com/brijeshbv/mood-matrix",
    docs: "/summary",
  },
}
