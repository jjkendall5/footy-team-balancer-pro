
import React, { useState } from "react";
import { Team } from "../types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, RefreshCw, Radio } from "lucide-react";

interface TeamResultsProps {
  teams: [Team, Team];
  onRegenerateTeams: () => void;
  onBack: () => void;
  onSwapPlayers: (teamAPlayerIndex: number, teamBPlayerIndex: number) => void;
}

const TeamResults: React.FC<TeamResultsProps> = ({ 
  teams, 
  onRegenerateTeams, 
  onBack,
  onSwapPlayers
}) => {
  const [showScores, setShowScores] = useState(true);
  const [selectedPlayerIndices, setSelectedPlayerIndices] = useState<{
    teamA: number | null;
    teamB: number | null;
  }>({
    teamA: null,
    teamB: null,
  });

  const handlePlayerClick = (team: "teamA" | "teamB", index: number) => {
    setSelectedPlayerIndices((prev) => {
      // If clicking on an already selected player, deselect them
      if (team === "teamA" && prev.teamA === index) {
        return { ...prev, teamA: null };
      } else if (team === "teamB" && prev.teamB === index) {
        return { ...prev, teamB: null };
      }
      
      // Otherwise, update the selected player for this team
      const newSelection = { ...prev, [team]: index };
      
      // If both teams have a player selected, swap them
      if (newSelection.teamA !== null && newSelection.teamB !== null) {
        onSwapPlayers(newSelection.teamA, newSelection.teamB);
        return { teamA: null, teamB: null };
      }
      
      return newSelection;
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack} className="flex items-center">
          <ArrowLeft size={16} className="mr-2" /> Back
        </Button>
        <div className="flex items-center space-x-2">
          <Switch 
            id="show-scores" 
            checked={showScores} 
            onCheckedChange={setShowScores} 
          />
          <Label htmlFor="show-scores">Show Scores</Label>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-center">Generated Teams</h2>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-center mb-6">
        <p className="text-sm font-medium text-yellow-800">
          Rating Scale: 1-10 (10 is highest) | S = Skill | T = Teamwork
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Team A */}
        <div className="border rounded-lg p-4 bg-blue-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-bold text-blue-800">Team Blue</h3>
            {teams[0].wearsBibs && (
              <div className="flex items-center px-2 py-1 bg-yellow-200 rounded-full">
                <Radio size={14} className="mr-1" />
                <span className="text-xs font-medium">Bibs</span>
              </div>
            )}
          </div>
          
          {showScores && (
            <div className="flex justify-around mb-4 text-sm">
              <div className="text-center">
                <p className="font-semibold">Total Skill</p>
                <p className="text-lg font-bold">{teams[0].totalSkill}</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">Total Teamwork</p>
                <p className="text-lg font-bold">{teams[0].totalTeamwork}</p>
              </div>
            </div>
          )}
          
          <ul className="space-y-2">
            {teams[0].players.map((player, index) => (
              <li 
                key={player.id}
                onClick={() => handlePlayerClick("teamA", index)}
                className={`p-2 border rounded cursor-pointer transition-colors ${
                  selectedPlayerIndices.teamA === index
                    ? "bg-blue-200 border-blue-500"
                    : "hover:bg-blue-100"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{player.name}</span>
                  {showScores && (
                    <span className="text-sm text-gray-600">
                      S: {player.skill} | T: {player.teamwork}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Team B */}
        <div className="border rounded-lg p-4 bg-red-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-bold text-red-800">Team Red</h3>
            {teams[1].wearsBibs && (
              <div className="flex items-center px-2 py-1 bg-yellow-200 rounded-full">
                <Radio size={14} className="mr-1" />
                <span className="text-xs font-medium">Bibs</span>
              </div>
            )}
          </div>
          
          {showScores && (
            <div className="flex justify-around mb-4 text-sm">
              <div className="text-center">
                <p className="font-semibold">Total Skill</p>
                <p className="text-lg font-bold">{teams[1].totalSkill}</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">Total Teamwork</p>
                <p className="text-lg font-bold">{teams[1].totalTeamwork}</p>
              </div>
            </div>
          )}
          
          <ul className="space-y-2">
            {teams[1].players.map((player, index) => (
              <li 
                key={player.id}
                onClick={() => handlePlayerClick("teamB", index)}
                className={`p-2 border rounded cursor-pointer transition-colors ${
                  selectedPlayerIndices.teamB === index
                    ? "bg-red-200 border-red-500"
                    : "hover:bg-red-100"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{player.name}</span>
                  {showScores && (
                    <span className="text-sm text-gray-600">
                      S: {player.skill} | T: {player.teamwork}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600 mb-2">
          {selectedPlayerIndices.teamA !== null 
            ? "Now select a player from Team Red to swap"
            : selectedPlayerIndices.teamB !== null
              ? "Now select a player from Team Blue to swap"
              : "Click on players to swap them between teams"}
        </p>
        <Button 
          onClick={onRegenerateTeams}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <RefreshCw size={16} className="mr-2" /> Regenerate Teams
        </Button>
      </div>
    </div>
  );
};

export default TeamResults;
