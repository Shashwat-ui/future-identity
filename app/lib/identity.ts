export type ContactIdentity = {
  mobile?: string;
  landline?: string;
  home?: string;
  office?: string;
};

export type SocialIdentity = {
  instagram?: string;
  snapchat?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
};

export type WorkIdentity = {
  company?: string;
  designation?: string;
  linkedin?: string;
  website?: string;
  officeAddress?: string;
  departmentContact?: string;
};

export type PaymentIdentity = {
  upi?: string;
  bankAccount?: string;
  creditCard?: string;
  patreon?: string;
  crypto?: string;
};

export type AddressIdentity = {
  home?: string;
  office?: string;
  holidayHome?: string;
};

export type EnterpriseIdentity = {
  allowScanLimit?: boolean;
  auditLogs?: boolean;
  departmentRouting?: boolean;
};

export type IdentityPayload =
  | { type: 'contact'; data: ContactIdentity }
  | { type: 'social'; data: SocialIdentity }
  | { type: 'work'; data: WorkIdentity }
  | { type: 'payment'; data: PaymentIdentity }
  | { type: 'address'; data: AddressIdentity }
  | { type: 'enterprise'; data: EnterpriseIdentity };

export function sanitizeIdentity(payload: IdentityPayload) {
  return Object.fromEntries(
	Object.entries(payload.data).filter(([, value]) => value)
  );
}