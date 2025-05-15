
import React, { useState, useEffect } from "react";
import { Player, Team } from "../types";
import PlayerManagement from "../components/PlayerManagement";
import TeamResults from "../components/TeamResults";
import Header from "../components/Header";
import { generateTeams, swapPlayers } from "../utils/teamGenerationLogic";
import { toast } from "@/components/ui/use-toast";
import { fetchPlayers } from "@/services/playerService";

const Index: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<[Team, Team] | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load players from database on component mount
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const fetchedPlayers = await fetchPlayers();
        setPlayers(fetchedPlayers);
      } catch (error) {
        console.error("Error loading players:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load players from database",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPlayers();
  }, []);
  
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
    
    const bibTeam = generatedTeams[0].wearsBibs ? "Blue" : "Red";
    
    toast({
      title: "Teams generated",
      description: `Teams have been created. Team ${bibTeam} wears bibs.`,
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
            isLoading={isLoading}
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
