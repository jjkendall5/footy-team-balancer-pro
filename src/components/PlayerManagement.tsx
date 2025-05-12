
import React from "react";
import { Player } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  const updatePlayer = (id: string, field: keyof Player, value: any) => {
    setPlayers(
      players.map((player) =>
        player.id === id ? { ...player, [field]: value } : player
      )
    );
  };
  
  const adjustValue = (id: string, field: "skill" | "teamwork", increment: boolean) => {
    setPlayers(
      players.map((player) => {
        if (player.id === id) {
          const currentValue = player[field];
          let newValue = increment ? currentValue + 1 : currentValue - 1;
          
          // Ensure value stays between 1 and 10
          newValue = Math.max(1, Math.min(10, newValue));
          
          return { ...player, [field]: newValue };
        }
        return player;
      })
    );
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
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-secondary">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-center">Skill</th>
              <th className="p-2 text-center">Teamwork</th>
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
              </tr>
            ))}
            {players.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
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
