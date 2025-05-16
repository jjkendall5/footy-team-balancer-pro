
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types";

export interface DbPlayer {
  id: string;
  name: string;
  skill: number;
  teamwork: number;
  playing: boolean;
  is_goalkeeper: boolean;
  created_at?: string;
  updated_at?: string;
}

// Convert DB player to app Player format
export const mapDbPlayerToPlayer = (dbPlayer: DbPlayer): Player => {
  return {
    id: dbPlayer.id,
    name: dbPlayer.name,
    skill: dbPlayer.skill,
    teamwork: dbPlayer.teamwork,
    available: dbPlayer.playing, // Map playing DB field to available app field
    isGoalkeeper: dbPlayer.is_goalkeeper,
  };
};

// Convert app Player to DB format
export const mapPlayerToDbPlayer = (player: Player): Omit<DbPlayer, 'created_at' | 'updated_at'> => {
  return {
    id: player.id,
    name: player.name,
    skill: player.skill,
    teamwork: player.teamwork,
    playing: player.available, // Map available app field to playing DB field
    is_goalkeeper: player.isGoalkeeper || false,
  };
};

export const fetchPlayers = async (): Promise<Player[]> => {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching players:', error);
    return [];
  }
  
  return (data as DbPlayer[]).map(mapDbPlayerToPlayer);
};

export const createPlayer = async (player: Omit<Player, 'id'>): Promise<Player | null> => {
  const newDbPlayer = {
    name: player.name,
    skill: player.skill,
    teamwork: player.teamwork,
    playing: player.available,
    is_goalkeeper: player.isGoalkeeper || false,
  };
  
  const { data, error } = await supabase
    .from('players')
    .insert(newDbPlayer)
    .select()
    .single();
  
  if (error || !data) {
    console.error('Error creating player:', error);
    return null;
  }
  
  return mapDbPlayerToPlayer(data as DbPlayer);
};

export const updatePlayer = async (player: Player): Promise<boolean> => {
  const dbPlayer = mapPlayerToDbPlayer(player);
  
  const { error } = await supabase
    .from('players')
    .update({
      name: dbPlayer.name,
      skill: dbPlayer.skill,
      teamwork: dbPlayer.teamwork,
      playing: dbPlayer.playing,
      is_goalkeeper: dbPlayer.is_goalkeeper
    })
    .eq('id', player.id);
  
  if (error) {
    console.error('Error updating player:', error);
    return false;
  }
  
  return true;
};

export const deletePlayer = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('players')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting player:', error);
    return false;
  }
  
  return true;
};
