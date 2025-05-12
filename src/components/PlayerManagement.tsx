
import React, { useState } from "react";
import { Player } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface PlayerManagementProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  onGenerateTeams: () => void;
}

const PlayerManagement: React.FC<PlayerManagementProps> = ({ 
  players, 
  setPlayers, 
  onGenerateTeams 
}) => {
  const [newPlayerName, setNewPlayerName] = useState("");
  
  const addPlayer = () => {
    if (!newPlayerName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Player name cannot be empty",
      });
      return;
    }
    
    if (players.length >= 16) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Maximum 16 players allowed",
      });
      return;
    }
    
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: newPlayerName,
      ranking: 5, // Default values
      teamwork: 5,
      available: true,
    };
    
    setPlayers([...players, newPlayer]);
    setNewPlayerName("");
  };
  
  const updatePlayer = (id: string, field: keyof Player, value: any) => {
    setPlayers(
      players.map((player) =>
        player.id === id ? { ...player, [field]: value } : player
      )
    );
  };
  
  const deletePlayer = (id: string) => {
    setPlayers(players.filter((player) => player.id !== id));
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
      
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Input
          placeholder="Player name"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          className="flex-grow"
          onKeyDown={(e) => {
            if (e.key === "Enter") addPlayer();
          }}
        />
        <Button onClick={addPlayer} className="w-full sm:w-auto">
          <Plus size={16} className="mr-2" /> Add Player
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-secondary">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-center">Ranking</th>
              <th className="p-2 text-center">Teamwork</th>
              <th className="p-2 text-center">Available</th>
              <th className="p-2 text-center">Action</th>
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
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={player.ranking}
                    onChange={(e) => updatePlayer(player.id, "ranking", parseInt(e.target.value) || 1)}
                    className="w-full"
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={player.teamwork}
                    onChange={(e) => updatePlayer(player.id, "teamwork", parseInt(e.target.value) || 1)}
                    className="w-full"
                  />
                </td>
                <td className="p-2 text-center">
                  <div className="flex justify-center">
                    <Checkbox
                      checked={player.available}
                      onCheckedChange={(checked) => 
                        updatePlayer(player.id, "available", !!checked)
                      }
                    />
                  </div>
                </td>
                <td className="p-2 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePlayer(player.id)}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </td>
              </tr>
            ))}
            {players.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No players added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-center">
        <Button 
          onClick={handleGenerateTeams}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          disabled={players.filter(p => p.available).length < 2}
        >
          Generate Teams
        </Button>
      </div>
    </div>
  );
};

export default PlayerManagement;
