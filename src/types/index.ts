
export interface Player {
  id: string;
  name: string;
  skill: number; // Changed from ranking to skill
  teamwork: number;
  available: boolean; // Keeping this field for team generation logic
}

export interface Team {
  players: Player[];
  totalSkill: number; // Updated from totalRanking
  totalTeamwork: number;
}
