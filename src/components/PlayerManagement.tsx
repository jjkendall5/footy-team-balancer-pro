
import React from "react";
import { Player } from "@/types";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import AddPlayerForm from "./player/AddPlayerForm";
import PlayerTable from "./player/PlayerTable";
import EmptyState from "./player/EmptyState";
import LoadingState from "./player/LoadingState";
import { createPlayer, deletePlayer, updatePlayer as updatePlayerInDb } from "@/services/playerService";

interface PlayerManagementProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  onGenerateTeams: () => void;
  isLoading: boolean;
}

const PlayerManagement: React.FC<PlayerManagementProps> = ({ 
  players, 
  setPlayers, 
  onGenerateTeams,
  isLoading
}) => {
  const updatePlayerField = async (id: string, field: keyof Player, value: any) => {
    const updatedPlayers = players.map((player) => {
      if (player.id === id) {
        return { ...player, [field]: value };
      }
      return player;
    });
    
    setPlayers(updatedPlayers);
    
    // Find the updated player
    const playerToUpdate = updatedPlayers.find(p => p.id === id);
    if (playerToUpdate) {
      try {
        // Update in database
        const success = await updatePlayerInDb(playerToUpdate);
        if (!success) {
          throw new Error("Failed to update player");
        }
      } catch (error) {
        console.error("Error updating player:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update player in database",
        });
        
        // Revert state on error
        setPlayers(players);
      }
    }
  };
  
  const adjustValue = async (id: string, field: "skill" | "teamwork", increment: boolean) => {
    const playerIndex = players.findIndex(p => p.id === id);
    if (playerIndex === -1) return;
    
    const player = players[playerIndex];
    const currentValue = player[field];
    let newValue = increment ? currentValue + 1 : currentValue - 1;
    
    // Ensure value stays between 1 and 10
    newValue = Math.max(1, Math.min(10, newValue));
    
    if (newValue !== currentValue) {
      const updatedPlayer = { ...player, [field]: newValue };
      const updatedPlayers = [...players];
      updatedPlayers[playerIndex] = updatedPlayer;
      
      setPlayers(updatedPlayers);
      
      try {
        // Update in database
        const success = await updatePlayerInDb(updatedPlayer);
        if (!success) {
          throw new Error("Failed to update player");
        }
      } catch (error) {
        console.error("Error updating player:", error);
        toast({
          variant: "destructive",
          title: "Error", 
          description: "Failed to update player in database",
        });
        
        // Revert state on error
        setPlayers(players);
      }
    }
  };
  
  const handleAddPlayer = async (newPlayerName: string) => {
    if (!newPlayerName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a player name",
      });
      return;
    }
    
    const newPlayer = {
      name: newPlayerName.trim(),
      skill: 5, // Default values
      teamwork: 5,
      available: true,
      isGoalkeeper: false,
    };
    
    // Add to database
    const createdPlayer = await createPlayer(newPlayer);
    
    if (createdPlayer) {
      setPlayers([...players, createdPlayer]);
      toast({
        title: "Player added",
        description: `${createdPlayer.name} has been added to the team`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add player",
      });
    }
  };
  
  const handleRemovePlayer = async (id: string) => {
    // Delete from database first
    const success = await deletePlayer(id);
    
    if (success) {
      setPlayers(players.filter(player => player.id !== id));
      toast({
        title: "Player removed",
        description: "The player has been removed from the team",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove player",
      });
    }
  };
  
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
    
    onGenerateTeams();
  };

  const availablePlayersCount = players.filter(player => player.available).length;
  
  return (
    <div className="space-y-6">
      <AddPlayerForm onAddPlayer={handleAddPlayer} disabled={isLoading} />
      
      {isLoading ? (
        <LoadingState />
      ) : players.length === 0 ? (
        <EmptyState />
      ) : (
        <PlayerTable 
          players={players}
          updatePlayerField={updatePlayerField}
          adjustValue={adjustValue}
          onRemovePlayer={handleRemovePlayer}
        />
      )}
      
      <div className="flex justify-center mt-8">
        <Button 
          onClick={handleGenerateTeams}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          disabled={players.filter(p => p.available).length < 2 || isLoading}
        >
          Generate Teams ({availablePlayersCount} players selected)
        </Button>
      </div>
    </div>
  );
};

export default PlayerManagement;
