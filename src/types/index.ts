export interface FootballStats {
  speed: number;
  stamina: number;
  accuracy: number;
  dribbling: number;
}

export interface BasketballStats {
  speed: number;
  verticalJump: number;
  threePointAcc: number;
  defense: number;
}

export interface AthleticsStats {
  speed: number;
  endurance: number;
  reactionTime: number;
  agility: number;
}

export type SportStats = FootballStats | BasketballStats | AthleticsStats;
export type Sport = 'Football' | 'Basketball' | 'Athletics';

export interface Athlete {
  id: string;
  name: string;
  gender: 'male' | 'female';
  sport: Sport;
  position: string;
  age: number;
  bio: string;
  stats: SportStats;
  score: number;
}

export type RootTabParamList = {
  Home: undefined;
  Discover: undefined;
  Shortlist: undefined;
};

export type DiscoverStackParamList = {
  Feed: undefined;
  Profile: { athleteId: string };
};

export type ShortlistStackParamList = {
  ShortlistFeed: undefined;
  Profile: { athleteId: string };
};

export const isFootballStats = (stats: SportStats): stats is FootballStats =>
  'dribbling' in stats;

export const isBasketballStats = (stats: SportStats): stats is BasketballStats =>
  'verticalJump' in stats;

export const isAthleticsStats = (stats: SportStats): stats is AthleticsStats =>
  'endurance' in stats;
