export const siteMetadata = {
  title: 'Atlassify',
  url: 'https://atlassify.io',
  description: 'Atlassian notifications on your menu bar',
  repo: {
    fullName: 'setchy/atlassify',
    owner: 'setchy',
    name: 'atlassify',
  },
  keywords:
    'atlassify,desktop,application,atlassian,notifications,unread,menu bar,electron,open source,setchy,mac,windows,linux',
  author: {
    name: 'Adam Setch (@setchy)',
    site: 'https://setchy.io',
  },
  google: {
    gtags: ['G-JRB90LB5N9'],
    siteVerification: 'rnCO5LIKeWKdhMaGo6FtO8U_g7ndm56Y1VG',
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
  GITHUB: {
    REPO: `https://github.com/${siteMetadata.repo.fullName}`,
    LATEST_RELEASE: `https://github.com/${siteMetadata.repo.fullName}/releases/latest`,
  },
};
