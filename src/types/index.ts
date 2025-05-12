
export interface Player {
  id: string;
  name: string;
  ranking: number;
  teamwork: number;
  available: boolean;
}

export interface Team {
  players: Player[];
  totalRanking: number;
  totalTeamwork: number;
}
