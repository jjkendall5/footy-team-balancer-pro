import React from "react";
import { Player } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Trash2 } from "lucide-react";

interface PlayerRowProps {
  player: Player;
  updatePlayerField: (id: string, field: keyof Player, value: any) => void;
  adjustValue: (id: string, field: "skill" | "teamwork", increment: boolean) => void;
  onRemove: (id: string) => void;
}

const PlayerRow: React.FC<PlayerRowProps> = ({
  player,
  updatePlayerField,
  adjustValue,
  onRemove
}) => {
  // Mobile version (stacked layout)
  const mobileRow = (
    <div className="md:hidden block border-b border-gray-200 py-3 px-2">
      <div className="flex justify-between items-center mb-2">
        <Input
          value={player.name}
          onChange={(e) => updatePlayerField(player.id, "name", e.target.value)}
          className="w-3/4 mr-2"
        />
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onRemove(player.id)}
        >
          <Trash2 size={18} className="text-red-500" />
        </Button>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div className="space-y-1">
          <div className="text-xs text-gray-500 text-center">Skill</div>
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 rounded-full"
              onClick={() => adjustValue(player.id, "skill", false)}
              disabled={player.skill <= 1}
            >
              <Minus size={14} />
            </Button>
            <div className="w-6 text-center font-medium">{player.skill}</div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 rounded-full"
              onClick={() => adjustValue(player.id, "skill", true)}
              disabled={player.skill >= 10}
            >
              <Plus size={14} />
            </Button>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-xs text-gray-500 text-center">Teamwork</div>
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 rounded-full"
              onClick={() => adjustValue(player.id, "teamwork", false)}
              disabled={player.teamwork <= 1}
            >
              <Minus size={14} />
            </Button>
            <div className="w-6 text-center font-medium">{player.teamwork}</div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 rounded-full"
              onClick={() => adjustValue(player.id, "teamwork", true)}
              disabled={player.teamwork >= 10}
            >
              <Plus size={14} />
            </Button>
          </div>
        </div>
        
        <div className="space-y-1 flex flex-col items-center">
          <div className="grid grid-cols-2 gap-1 w-full">
            <div className="text-xs text-gray-500 text-center">GK</div>
            <div className="text-xs text-gray-500 text-center">Playing</div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="flex justify-center">
              <Button
                variant={player.isGoalkeeper ? "default" : "outline"}
                size="sm"
                className="h-7 w-7 p-0 rounded-full"
                onClick={() => updatePlayerField(player.id, "isGoalkeeper", !player.isGoalkeeper)}
              >
                <span className="text-xs font-bold">GK</span>
              </Button>
            </div>
            <div className="flex justify-center">
              <Button
                variant={player.available ? "default" : "outline"}
                size="sm"
                className="h-7 w-7 p-0 rounded-full"
                onClick={() => updatePlayerField(player.id, "available", !player.available)}
              >
                <span className="text-xs">✓</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Show only on desktop and larger screens */}
      <tr className="hidden md:table-row border-b border-gray-200 hover:bg-gray-50 transition-colors">
        <td className="p-2">
          <Input
            value={player.name}
            onChange={(e) => updatePlayerField(player.id, "name", e.target.value)}
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
            <Button
              variant={player.isGoalkeeper ? "default" : "outline"}
              size="sm"
              className="h-8 w-8 p-0 rounded-full"
              onClick={() => updatePlayerField(player.id, "isGoalkeeper", !player.isGoalkeeper)}
            >
              <span className="text-xs font-bold">GK</span>
            </Button>
          </div>
        </td>
        <td className="p-2">
          <div className="flex items-center justify-center">
            <Button
              variant={player.available ? "default" : "outline"}
              size="sm"
              className="h-8 w-8 p-0 rounded-full"
              onClick={() => updatePlayerField(player.id, "available", !player.available)}
            >
              <span className="text-xs">✓</span>
            </Button>
          </div>
        </td>
        <td className="p-2">
          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onRemove(player.id)}
            >
              <Trash2 size={18} className="text-red-500" />
            </Button>
          </div>
        </td>
      </tr>
      
      {/* Mobile version */}
      {mobileRow}
    </>
  );
};

export default PlayerRow;
