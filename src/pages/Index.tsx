
import React, { useState } from "react";
import { Player, Team } from "../types";
import PlayerManagement from "../components/PlayerManagement";
import TeamResults from "../components/TeamResults";
import Header from "../components/Header";
import { generateTeams, swapPlayers } from "../utils/teamGenerationLogic";
import { toast } from "@/components/ui/use-toast";

const Index: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([
    // Pre-populate with example players, changed from ranking to skill
    { id: "1", name: "Player 1", skill: 8, teamwork: 6, available: true },
    { id: "2", name: "Player 2", skill: 7, teamwork: 8, available: true },
    { id: "3", name: "Player 3", skill: 9, teamwork: 5, available: true },
    { id: "4", name: "Player 4", skill: 6, teamwork: 7, available: true },
    { id: "5", name: "Player 5", skill: 5, teamwork: 9, available: true },
    { id: "6", name: "Player 6", skill: 7, teamwork: 6, available: true },
    { id: "7", name: "Player 7", skill: 4, teamwork: 8, available: true },
    { id: "8", name: "Player 8", skill: 6, teamwork: 5, available: true },
    { id: "9", name: "Player 9", skill: 8, teamwork: 7, available: true },
    { id: "10", name: "Player 10", skill: 5, teamwork: 6, available: true },
    { id: "11", name: "Player 11", skill: 7, teamwork: 5, available: true },
    { id: "12", name: "Player 12", skill: 6, teamwork: 7, available: true },
    { id: "13", name: "Player 13", skill: 8, teamwork: 8, available: true },
    { id: "14", name: "Player 14", skill: 6, teamwork: 6, available: true },
    { id: "15", name: "Player 15", skill: 5, teamwork: 9, available: true },
    { id: "16", name: "Player 16", skill: 7, teamwork: 7, available: true },
  ]);
  
  const [teams, setTeams] = useState<[Team, Team] | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  const handleGenerateTeams = () => {
    const availablePlayers = players.filter(player => player.available);
    
    if (availablePlayers.length < 2) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Need at least 2 available players to generate teams",
      });
      return;
    }
    
    const generatedTeams = generateTeams(players);
    setTeams(generatedTeams);
    setShowResults(true);
    
    toast({
      title: "Teams generated",
      description: "Teams have been created based on player skills and teamwork",
    });
  };
  
  const handleSwapPlayers = (teamAPlayerIndex: number, teamBPlayerIndex: number) => {
    if (!teams) return;
    
    const newTeams = swapPlayers(teams, teamAPlayerIndex, teamBPlayerIndex);
    setTeams(newTeams);
    
    toast({
      title: "Players swapped",
      description: "Players have been swapped between teams",
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Header />
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        {showResults && teams ? (
          <TeamResults 
            teams={teams}
            onRegenerateTeams={handleGenerateTeams}
            onBack={() => setShowResults(false)}
            onSwapPlayers={handleSwapPlayers}
          />
        ) : (
          <PlayerManagement 
            players={players}
            setPlayers={setPlayers}
            onGenerateTeams={handleGenerateTeams}
          />
        )}
      </div>
      
      <footer className="mt-8 text-center text-sm text-gray-600">
        <p>Football Team Generator &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
