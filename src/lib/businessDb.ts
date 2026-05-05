import { Business } from '../types';
import { supabase } from './supabaseClient';

type BusinessRow = {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  website: string;
  city: string;
  cnic: string;
  owner_id?: string | null;
  status: string;
  created_at: string;
};

function rowToBusiness(row: BusinessRow): Business {
  return {
    id: row.id,
    name: row.name,
    category: row.category as Business['category'],
    description: row.description,
    address: row.address,
    phone: row.phone,
    website: row.website,
    city: row.city,
    cnic: row.cnic ?? '',
    ownerId: row.owner_id ?? null,
    status: row.status as Business['status'],
    createdAt: row.created_at
  };
}

function businessToRow(b: Business): BusinessRow {
  return {
    id: b.id,
    name: b.name,
    category: b.category,
    description: b.description,
    address: b.address,
    phone: b.phone,
    website: b.website,
    city: b.city,
    cnic: b.cnic,
    owner_id: b.ownerId ?? null,
    status: b.status,
    created_at: b.createdAt
  };
}

export async function fetchBusinesses(): Promise<Business[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as BusinessRow[]).map(rowToBusiness);
}

export async function insertBusiness(
  b: Business,
  ownerId?: string
): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured');
  const row = businessToRow({ ...b, ownerId: ownerId ?? b.ownerId ?? null });
  const { error } = await supabase.from('businesses').insert(row);
  if (error) throw error;
}

export async function updateBusinessStatus(
  id: string,
  status: Business['status']
): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured');
  const { error } = await supabase
    .from('businesses')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

export async function updateBusiness(b: Business): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured');
  const { error } = await supabase
    .from('businesses')
    .update(businessToRow(b))
    .eq('id', b.id);
  if (error) throw error;
}

export async function deleteBusiness(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured');
  const { error } = await supabase.from('businesses').delete().eq('id', id);
  if (error) throw error;
}
