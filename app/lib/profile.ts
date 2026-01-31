export interface UserProfile {
  id?: string;
  userId: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: boolean;
  mobile?: string | null;
  photo?: string | null;
  instagram?: string | null;
  instagramVerified?: boolean;
  facebook?: string | null;
  facebookVerified?: boolean;
  linkedin?: string | null;
  linkedinVerified?: boolean;
  tiktok?: string | null;
  youtube?: string | null;
  company?: string | null;
  designation?: string | null;
  officeAddress?: string | null;
  upi?: string | null;
  bankAccount?: string | null;
  crypto?: string | null;
  home?: string | null;
  holidayHome?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProfileData = Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>;
