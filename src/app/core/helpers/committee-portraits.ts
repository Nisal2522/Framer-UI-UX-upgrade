/**
 * Farmer-person portraits for committee/member avatars.
 * Portrait-only URLs so circular avatar cards show real people cleanly.
 */
const FARMER_PERSON_PHOTOS: string[] = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/men/45.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/women/26.jpg',
  'https://randomuser.me/api/portraits/men/67.jpg',
  'https://randomuser.me/api/portraits/women/63.jpg'
];

export function committeeMemberPortraitUrl(member: { id: string; gender: string }): string {
  const numericId = Number.parseInt(member.id.replace(/\D/g, ''), 10) || 0;
  return FARMER_PERSON_PHOTOS[numericId % FARMER_PERSON_PHOTOS.length];
}

/** Farmer directory — portrait keyed by FM-### id (stable) and gender. */
export function farmerMemberPortraitUrl(member: { id: string; gender: string }): string {
  const numericId = Number.parseInt(member.id.replace(/\D/g, ''), 10) || 0;
  return FARMER_PERSON_PHOTOS[numericId % FARMER_PERSON_PHOTOS.length];
}
