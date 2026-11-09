/**
 * Smaller structured data reused by the Experience section and the /resume page:
 * the collapsed "Earlier" roles and Education. Edit here to update both places.
 */

export interface EarlierRole {
  org: string;
  role: string;
  years: string;
}

export const earlierRoles: EarlierRole[] = [
  { org: 'UNHCR Ankara', role: 'Graduate intern', years: '2016' },
  { org: 'Refugees International', role: 'Graduate intern', years: '2016' },
  { org: 'Legal Aid Foundation of Los Angeles', role: 'Intern', years: '2009–2010' },
  { org: 'Refugee and Empowerment Services, Dallas', role: 'Resettlement intern', years: '2009' },
  { org: 'International Rescue Committee, Dallas', role: 'Volunteer', years: '2007' },
];

export interface Education {
  school: string;
  degree: string;
  year: string;
  notes?: string[];
}

export const education: Education[] = [
  {
    school: 'Georgetown University',
    degree: 'Master of Science in Foreign Service',
    year: '2017',
    notes: [
      'Certificate in Refugees and Humanitarian Emergencies',
      'Editor-in-Chief, Georgetown Journal of International Affairs',
    ],
  },
  {
    school: 'University of Southern California',
    degree: 'B.A. in International Relations, minor in Peace and Conflict Studies',
    year: '2010',
  },
];
