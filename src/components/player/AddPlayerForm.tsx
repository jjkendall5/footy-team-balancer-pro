
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";

interface AddPlayerFormProps {
  onAddPlayer: (name: string) => void;
  disabled: boolean;
}

const AddPlayerForm: React.FC<AddPlayerFormProps> = ({ onAddPlayer, disabled }) => {
  const [newPlayerName, setNewPlayerName] = useState("");
  
  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;
    
    onAddPlayer(newPlayerName);
    setNewPlayerName("");
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-6">
      <Input
        value={newPlayerName}
        onChange={(e) => setNewPlayerName(e.target.value)}
        placeholder="New player name"
        className="flex-grow"
        onKeyDown={(e) => e.key === "Enter" && handleAddPlayer()}
      />
      <Button
        onClick={handleAddPlayer}
        disabled={!newPlayerName.trim() || disabled}
        className="w-full sm:w-auto"
      >
        <UserPlus size={18} className="mr-2" />
        Add Player
      </Button>
    </div>
  );
};

export default AddPlayerForm;
