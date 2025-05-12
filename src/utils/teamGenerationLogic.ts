
import { Player, Team } from "../types";

// Generate two balanced teams from available players
export const generateTeams = (players: Player[]): [Team, Team] => {
  // Filter only available players
  const availablePlayers = players.filter(player => player.available);
  
  // Sort players by combined score (ranking + teamwork) descending
  const sortedPlayers = [...availablePlayers].sort((a, b) => {
    const combinedScoreA = a.ranking + a.teamwork;
    const combinedScoreB = b.ranking + b.teamwork;
    return combinedScoreB - combinedScoreA;
  });

  // Initialize teams
  const teamA: Player[] = [];
  const teamB: Player[] = [];
  
  let teamATotal = { ranking: 0, teamwork: 0 };
  let teamBTotal = { ranking: 0, teamwork: 0 };

  // Distribute players using alternating selection (best player to team A, 2nd best to team B, etc.)
  // Also considering the current team totals to balance teams
  sortedPlayers.forEach((player) => {
    const playerValue = { ranking: player.ranking, teamwork: player.teamwork };
    
    // Calculate which team would be more balanced by adding this player
    const teamAProjected = {
      ranking: teamATotal.ranking + playerValue.ranking,
      teamwork: teamATotal.teamwork + playerValue.teamwork
    };
    
    const teamBProjected = {
      ranking: teamBTotal.ranking + playerValue.ranking,
      teamwork: teamBTotal.teamwork + playerValue.teamwork
    };
    
    // Calculate absolute difference between teams if player joins team A
    const diffIfJoinA = Math.abs((teamAProjected.ranking + teamAProjected.teamwork) - 
                                 (teamBTotal.ranking + teamBTotal.teamwork));
    
    // Calculate absolute difference between teams if player joins team B
    const diffIfJoinB = Math.abs((teamATotal.ranking + teamATotal.teamwork) - 
                                 (teamBProjected.ranking + teamBProjected.teamwork));
    
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
      totalRanking: teamATotal.ranking, 
      totalTeamwork: teamATotal.teamwork 
    },
    { 
      players: teamB, 
      totalRanking: teamBTotal.ranking, 
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
  newTeams[0].totalRanking = newTeams[0].players.reduce((sum, p) => sum + p.ranking, 0);
  newTeams[0].totalTeamwork = newTeams[0].players.reduce((sum, p) => sum + p.teamwork, 0);
  
  newTeams[1].totalRanking = newTeams[1].players.reduce((sum, p) => sum + p.ranking, 0);
  newTeams[1].totalTeamwork = newTeams[1].players.reduce((sum, p) => sum + p.teamwork, 0);
  
  return newTeams;
};
