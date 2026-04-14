export interface Player {
  id: string;
  name: string;
  nickname?: string;
  avatarUrl?: string;
}

export interface RankingEntry {
  position: number;
  player: Player;
  points: number;
  eventsPlayed: number;
  trend?: 'up' | 'down' | 'same';
}

export interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface RankingPayload {
  season: Season;
  updatedAt: string;
  entries: RankingEntry[];
}

export interface LeagueEvent {
  id: string;
  title: string;
  venue: string;
  startsAt: string;
  entryFee?: number;
  registrationUrl?: string;
  formatVariant?: string;
}
