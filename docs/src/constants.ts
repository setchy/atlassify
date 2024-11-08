export const siteMetadata = {
  title: 'Atlassify',
  url: 'https://atlassify.io',
  description: 'Your Atlassian notifications on your menu bar.',
  repo: 'setchy/atlassify',
  keywords:
    'atlassify,desktop,application,atlassian,notifications,unread,menu bar,electron,open source,setchy,mac,osx',
  author: {
    name: 'Adam Setch (@setchy)',
    site: 'https://setchy.io',
  },
  menuLinks: [
    {
      name: 'Home',
      path: '/',
    },
    {
      name: 'FAQ',
      path: '/faq/',
    },
  ],
};

export const URLs = {
  API: {
    REPO: `https://api.github.com/repos/${siteMetadata.repo}`,
    LATEST_RELEASE: `https://api.github.com/repos/${siteMetadata.repo}/releases/latest`,
  },
  HTML: {
    REPO: `https://github.com/${siteMetadata.repo}`,
    LATEST_RELEASE: `https://github.com/${siteMetadata.repo}/releases/latest`,
  },
};
