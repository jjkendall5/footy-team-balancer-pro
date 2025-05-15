
export interface Player {
  id: string;
  name: string;
  skill: number; // Changed from ranking to skill
  teamwork: number;
  available: boolean; 
}

export interface Team {
  players: Player[];
  totalSkill: number; // Updated from totalRanking
  totalTeamwork: number;
  wearsBibs?: boolean; // New property to track which team wears bibs
}
