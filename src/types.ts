export interface Business {
  id: string;
  name: string;
  category: Category;
  description: string;
  address: string;
  phone: string;
  website: string;
  city: string;
  /** National ID (Pakistan CNIC: 13 digits). Required for new listings. */
  cnic: string;
  ownerId?: string | null;
  status: 'approved' | 'pending';
  createdAt: string;
}

export type UserRole = 'admin' | 'user';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string;
  role: UserRole;
  approved: boolean;
  created_at?: string;
}

export type Category = 
  | 'Plumber'
  | 'Doctor'
  | 'AC Technician'
  | 'Car Mechanic'
  | 'Electrician'
  | 'Dentist'
  | 'Lawyer'
  | 'Restaurant'
  | 'Salon'
  | 'Real Estate Agent';

export type PageView =
  | 'home'
  | 'businesses'
  | 'my-business'
  | 'add'
  | 'edit'
  | 'detail'
  | 'admin'
  | 'privacy'
  | 'terms'
  | 'login'
  | 'signup';
