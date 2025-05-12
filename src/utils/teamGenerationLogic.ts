
import { Player, Team } from "../types";

// Generate two balanced teams from available players
export const generateTeams = (players: Player[]): [Team, Team] => {
  // Filter only available players
  const availablePlayers = players.filter(player => player.available);
  
  // Sort players by combined score (skill + teamwork) descending
  const sortedPlayers = [...availablePlayers].sort((a, b) => {
    const combinedScoreA = a.skill + a.teamwork;
    const combinedScoreB = b.skill + b.teamwork;
    return combinedScoreB - combinedScoreA;
  });

  // Initialize teams
  const teamA: Player[] = [];
  const teamB: Player[] = [];
  
  let teamATotal = { skill: 0, teamwork: 0 };
  let teamBTotal = { skill: 0, teamwork: 0 };

  // Distribute players using alternating selection (best player to team A, 2nd best to team B, etc.)
  // Also considering the current team totals to balance teams
  sortedPlayers.forEach((player) => {
    const playerValue = { skill: player.skill, teamwork: player.teamwork };
    
    // Calculate which team would be more balanced by adding this player
    const teamAProjected = {
      skill: teamATotal.skill + playerValue.skill,
      teamwork: teamATotal.teamwork + playerValue.teamwork
    };
    
    const teamBProjected = {
      skill: teamBTotal.skill + playerValue.skill,
      teamwork: teamBTotal.teamwork + playerValue.teamwork
    };
    
    // Calculate absolute difference between teams if player joins team A
    const diffIfJoinA = Math.abs((teamAProjected.skill + teamAProjected.teamwork) - 
                                 (teamBTotal.skill + teamBTotal.teamwork));
    
    // Calculate absolute difference between teams if player joins team B
    const diffIfJoinB = Math.abs((teamATotal.skill + teamATotal.teamwork) - 
                                 (teamBProjected.skill + teamBProjected.teamwork));
    
    // Add player to the team that results in more balanced teams
    if (diffIfJoinA <= diffIfJoinB) {
      teamA.push(player);
      teamATotal = teamAProjected;
    } else {
      teamB.push(player);
      teamBTotal = teamBProjected;
    }
  });

  return [
    { 
      players: teamA, 
      totalSkill: teamATotal.skill, 
      totalTeamwork: teamATotal.teamwork 
    },
    { 
      players: teamB, 
      totalSkill: teamBTotal.skill, 
      totalTeamwork: teamBTotal.teamwork 
    }
  ];
};

// Function to swap players between teams
export const swapPlayers = (
  teams: [Team, Team], 
  teamAPlayerIndex: number, 
  teamBPlayerIndex: number
): [Team, Team] => {
  // Create deep copies to avoid mutating the original teams
  const newTeams: [Team, Team] = JSON.parse(JSON.stringify(teams));
  
  // Get the players to swap
  const teamAPlayer = newTeams[0].players[teamAPlayerIndex];
  const teamBPlayer = newTeams[1].players[teamBPlayerIndex];
  
  // Swap players
  newTeams[0].players[teamAPlayerIndex] = teamBPlayer;
  newTeams[1].players[teamBPlayerIndex] = teamAPlayer;
  
  // Recalculate totals
  newTeams[0].totalSkill = newTeams[0].players.reduce((sum, p) => sum + p.skill, 0);
  newTeams[0].totalTeamwork = newTeams[0].players.reduce((sum, p) => sum + p.teamwork, 0);
  
  newTeams[1].totalSkill = newTeams[1].players.reduce((sum, p) => sum + p.skill, 0);
  newTeams[1].totalTeamwork = newTeams[1].players.reduce((sum, p) => sum + p.teamwork, 0);
  
  return newTeams;
};
