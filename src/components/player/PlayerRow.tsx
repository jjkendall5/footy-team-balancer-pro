
import React from "react";
import { Player } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
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
          <Checkbox
            checked={player.isGoalkeeper}
            onCheckedChange={(checked) => updatePlayerField(player.id, "isGoalkeeper", Boolean(checked))}
          />
        </div>
      </td>
      <td className="p-2">
        <div className="flex items-center justify-center">
          <Checkbox
            checked={player.available}
            onCheckedChange={(checked) => updatePlayerField(player.id, "available", Boolean(checked))}
          />
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
  );
};

export default PlayerRow;
