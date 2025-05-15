import { Player, Team } from "../types";

// Generate two balanced teams from available players
export const generateTeams = (players: Player[]): [Team, Team] => {
  // Filter only available players
  const availablePlayers = players.filter(player => player.available);
  
  // Filter goalkeepers and outfield players
  const goalkeepers = availablePlayers.filter(player => player.isGoalkeeper);
  const outfieldPlayers = availablePlayers.filter(player => !player.isGoalkeeper);
  
  // Sort players by combined score (skill + teamwork) descending
  const sortedPlayers = [...outfieldPlayers].sort((a, b) => {
    const combinedScoreA = a.skill + a.teamwork;
    const combinedScoreB = b.skill + b.teamwork;
    return combinedScoreB - combinedScoreA;
  });

  // Initialize teams
  const teamA: Player[] = [];
  const teamB: Player[] = [];
  
  let teamATotal = { skill: 0, teamwork: 0 };
  let teamBTotal = { skill: 0, teamwork: 0 };

  // First, distribute goalkeepers if available
  if (goalkeepers.length > 0) {
    // Sort goalkeepers by skill (most skilled first)
    const sortedGKs = [...goalkeepers].sort((a, b) => b.skill - a.skill);
    
    // If there's at least one goalkeeper, give the best one to team A
    if (sortedGKs.length >= 1) {
      teamA.push(sortedGKs[0]);
      teamATotal.skill += sortedGKs[0].skill;
      teamATotal.teamwork += sortedGKs[0].teamwork;
    }
    
    // If there's a second goalkeeper, give it to team B
    if (sortedGKs.length >= 2) {
      teamB.push(sortedGKs[1]);
      teamBTotal.skill += sortedGKs[1].skill;
      teamBTotal.teamwork += sortedGKs[1].teamwork;
      
      // Add any remaining goalkeepers to the outfield distribution pool
      sortedPlayers.push(...sortedGKs.slice(2));
    } else {
      // If there's only one goalkeeper, add remaining outfield players
      sortedPlayers.push(...sortedGKs.slice(1));
    }
  }

  // Distribute remaining players using snake draft to balance teams
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
  
  // Randomly decide which team wears bibs (50% chance either way)
  const teamAWearsBibs = Math.random() >= 0.5;
  
  return [
    { 
      players: teamA, 
      totalSkill: teamATotal.skill, 
      totalTeamwork: teamATotal.teamwork,
      wearsBibs: teamAWearsBibs,
      hasGoalkeeper: teamA.some(p => p.isGoalkeeper)
    },
    { 
      players: teamB, 
      totalSkill: teamBTotal.skill, 
      totalTeamwork: teamBTotal.teamwork,
      wearsBibs: !teamAWearsBibs,
      hasGoalkeeper: teamB.some(p => p.isGoalkeeper)
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
  
  // Recalculate goalkeeper status
  newTeams[0].hasGoalkeeper = newTeams[0].players.some(p => p.isGoalkeeper);
  newTeams[1].hasGoalkeeper = newTeams[1].players.some(p => p.isGoalkeeper);
  
  // Keep the same bib assignment
  newTeams[0].wearsBibs = teams[0].wearsBibs;
  newTeams[1].wearsBibs = teams[1].wearsBibs;
  
  return newTeams;
};
