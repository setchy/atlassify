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
  ATLASSIAN: {
    API_TOKEN:
      'https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/',
  },
  GITHUB: {
    REPO: `https://github.com/${siteMetadata.repo.fullName}`,
    ISSUES: `https://github.com/${siteMetadata.repo.fullName}/issues`,
    LATEST_RELEASE: `https://github.com/${siteMetadata.repo.fullName}/releases/latest`,
  },
};
