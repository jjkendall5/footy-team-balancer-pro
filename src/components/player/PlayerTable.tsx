
import React from "react";
import { Player } from "@/types";
import PlayerRow from "./PlayerRow";

interface PlayerTableProps {
  players: Player[];
  updatePlayerField: (id: string, field: keyof Player, value: any) => void;
  adjustValue: (id: string, field: "skill" | "teamwork", increment: boolean) => void;
  onRemovePlayer: (id: string) => void;
}

const PlayerTable: React.FC<PlayerTableProps> = ({
  players,
  updatePlayerField,
  adjustValue,
  onRemovePlayer,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-secondary">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-center">Skill</th>
            <th className="p-2 text-center">Teamwork</th>
            <th className="p-2 text-center">GK</th>
            <th className="p-2 text-center">Playing</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <PlayerRow
              key={player.id}
              player={player}
              updatePlayerField={updatePlayerField}
              adjustValue={adjustValue}
              onRemove={onRemovePlayer}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerTable;
