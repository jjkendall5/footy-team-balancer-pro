
export interface Player {
  id: string;
  name: string;
  skill: number;
  teamwork: number;
  available: boolean;
  isGoalkeeper?: boolean;
}

export interface Team {
  players: Player[];
  totalSkill: number;
  totalTeamwork: number;
  wearsBibs?: boolean;
  hasGoalkeeper?: boolean;
}
