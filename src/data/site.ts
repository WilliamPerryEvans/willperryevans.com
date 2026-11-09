/**
 * Site-wide text and links. Edit this file to change your name, title, intro,
 * navigation, social links, the "Also" line, and footer. Keeping it here means
 * you never have to touch the layout code for these.
 */

export const site = {
  name: 'Will Perry Evans',
  // A short descriptor used on the résumé header and the social share image.
  // Intentionally not a job title.
  headline: 'More than fifteen years in refugee and humanitarian work',
  // The sidebar introduction, shown directly under the name.
  intro:
    'I have spent more than fifteen years in refugee and humanitarian work, from serving as a Peace Corps Volunteer in Jordan, to coordinating fieldwork in Türkiye, to managing regional teams in East Africa. More recently, I have worked inside the federal agencies that support humanitarian diplomacy and refugee resettlement.',
  // Shown as a small line in the sidebar. Replace the placeholder with a city.
  location: 'Charlottesville, Virginia',

  // Used for <title>, meta description, Open Graph, Twitter card, JSON-LD.
  seo: {
    titleDefault: 'Will Perry Evans',
    description:
      'Will Perry Evans leads humanitarian programs and builds tools for the people who serve refugees. More than fifteen years of refugee and humanitarian work across the field and the U.S. federal government.',
  },

  // In-page navigation (anchors to sections on the home page).
  nav: [
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Writing', href: '#writing' },
  ],

  // Social / contact links shown as small icons in the sidebar.
  // Email is assembled from parts at runtime to lightly deter scrapers.
  email: { user: 'williamperryevans', domain: 'gmail.com' },
  links: {
    linkedin: 'https://www.linkedin.com/in/william-perry-evans-56b878ba',
    github: 'https://github.com/WilliamPerryEvans',
    substack: 'https://refugeebureau.org/',
  },

  // The repository URL, shown in the footer and colophon. Public source.
  repoUrl: 'https://github.com/WilliamPerryEvans/willperryevans.com',

  // Display names and descriptions for the Writing section groups.
  writingGroups: {
    policy: { label: 'Policy analysis (USCRI)', description: '' },
    'refugee-bureau': {
      label: 'The Refugee Bureau',
      description:
        'A volunteer project documenting the institutional history of the State Department’s Bureau of Population, Refugees, and Migration, published as a Substack newsletter.',
    },
    earlier: { label: 'Earlier writing', description: '' },
  },

  // The compact "Also" line of extra credentials and community roles.
  also: [
    'Board member, Karen Community Farm, a refugee-led farm outside Raleigh, NC (2026–present)',
    'Graduate, Sorensen Institute Political Leaders Program, UVA (2023)',
    'Certified drone pilot',
    'Certified Grants Officer Representative (State Department)',
    'Virginia Governor’s Volunteerism and Community Service Award (2011)',
    'Languages: English (native), Levantine Arabic (conversational), Turkish (intermediate), and basic Swahili, Spanish, and French',
  ],
  // The Karen Community Farm link, used inside the "Also" line.
  karenFarmUrl: 'https://karencommunityfarmnc.org/',
} as const;

export type Site = typeof site;
