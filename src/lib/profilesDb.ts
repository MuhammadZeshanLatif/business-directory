import { Profile, UserRole } from '../types';
import { supabase } from './supabaseClient';

type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string;
  role: string;
  approved: boolean;
  created_at: string;
};

function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email,
    full_name: row.full_name,
    role: row.role as UserRole,
    approved: row.approved,
    created_at: row.created_at
  };
}

export async function fetchMyProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data ? mapProfile(data as ProfileRow) : null;
}

export async function fetchAllProfiles(): Promise<Profile[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return ((data ?? []) as ProfileRow[]).map(mapProfile);
}

export async function updateMemberRole(
  id: string,
  patch: { role?: UserRole; approved?: boolean }
): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured');
  const { error } = await supabase.from('profiles').update(patch).eq('id', id);
  if (error) throw error;
}
