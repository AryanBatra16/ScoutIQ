/**
 * Shared avatar images mapped by gender + sport.
 * Athletes of the same gender and same sport share the same portrait.
 */

export type AvatarKey =
  | 'male_Football'
  | 'female_Football'
  | 'male_Basketball'
  | 'female_Basketball'
  | 'male_Athletics'
  | 'female_Athletics';

export const AVATAR_IMAGES: Record<AvatarKey, ReturnType<typeof require>> = {
  male_Football: require('../../assets/avatars/male_football.png'),
  female_Football: require('../../assets/avatars/female_football.png'),
  male_Basketball: require('../../assets/avatars/male_basketball.png'),
  female_Basketball: require('../../assets/avatars/female_basketball.png'),
  male_Athletics: require('../../assets/avatars/male_athletics.png'),
  female_Athletics: require('../../assets/avatars/female_athletics.png'),
};

export function getAthleteAvatar(sport: string, gender: 'male' | 'female') {
  const key = `${gender}_${sport}` as AvatarKey;
  return AVATAR_IMAGES[key] ?? null;
}
