
import React, { useState } from "react";
import { Player } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Trash2, UserPlus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Checkbox } from "@/components/ui/checkbox";
import { createPlayer, deletePlayer, updatePlayer } from "@/services/playerService";

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
  const isMobile = useIsMobile();
  const [newPlayerName, setNewPlayerName] = useState("");
  
  const updatePlayer = async (id: string, field: keyof Player, value: any) => {
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
      // Update in database
      await updatePlayer(playerToUpdate).catch(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update player in database",
        });
      });
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
      
      // Update in database
      await updatePlayer(updatedPlayer).catch(() => {
        toast({
          variant: "destructive",
          title: "Error", 
          description: "Failed to update player in database",
        });
      });
    }
  };
  
  const handleAddPlayer = async () => {
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
    };
    
    // Add to database
    const createdPlayer = await createPlayer(newPlayer);
    
    if (createdPlayer) {
      setPlayers([...players, createdPlayer]);
      setNewPlayerName("");
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
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center sm:text-left">Player Management</h2>
      
      {/* Add new player form */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          placeholder="New player name"
          className="flex-grow"
          onKeyDown={(e) => e.key === "Enter" && handleAddPlayer()}
        />
        <Button
          onClick={handleAddPlayer}
          disabled={!newPlayerName.trim() || isLoading}
          className="w-full sm:w-auto"
        >
          <UserPlus size={18} className="mr-2" />
          Add Player
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading players...</p>
        </div>
      ) : players.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <p className="text-gray-500">No players added yet. Add your first player above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-secondary">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-center">Skill</th>
                <th className="p-2 text-center">Teamwork</th>
                <th className="p-2 text-center">Playing</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id} className="border-b border-gray-200">
                  <td className="p-2">
                    <Input
                      value={player.name}
                      onChange={(e) => updatePlayer(player.id, "name", e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="p-2">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => adjustValue(player.id, "skill", false)}
                        disabled={player.skill <= 1}
                      >
                        <Minus size={16} />
                      </Button>
                      <div className="w-8 text-center font-medium">{player.skill}</div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => adjustValue(player.id, "skill", true)}
                        disabled={player.skill >= 10}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => adjustValue(player.id, "teamwork", false)}
                        disabled={player.teamwork <= 1}
                      >
                        <Minus size={16} />
                      </Button>
                      <div className="w-8 text-center font-medium">{player.teamwork}</div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => adjustValue(player.id, "teamwork", true)}
                        disabled={player.teamwork >= 10}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={player.available}
                        onCheckedChange={(checked) => updatePlayer(player.id, "available", Boolean(checked))}
                      />
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleRemovePlayer(player.id)}
                      >
                        <Trash2 size={18} className="text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="flex justify-center">
        <Button 
          onClick={handleGenerateTeams}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          disabled={players.filter(p => p.available).length < 2 || isLoading}
        >
          Generate Teams
        </Button>
      </div>
    </div>
  );
};

export default PlayerManagement;
