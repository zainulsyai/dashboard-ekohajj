
export enum Role {
  ADMINISTRATOR = 'Administrator EkoHajj',
  EXECUTIVE = 'Eksekutif EkoHajj',
  SURVEYOR = 'Surveyor EkoHajj',
}

export interface BumbuRecord {
  id: number;
  name: string;
  isUsed: boolean;
  volume: string;
  price: string;
  otherIngredients: string;
  originProduct: string;
  productPrice: string;
  companyName?: string;
  // Metadata Identitas
  kitchenName?: string;
  address?: string;
  pic?: string;
  surveyor?: string;
  date?: string;
  time?: string;
  notes?: string;
}

export interface RTERecord {
  id: number;
  companyName: string;
  menu: string; // Renamed from spiceType to match PDF
  isUsed: boolean;
  volume: string; // Porsi/Paket
  price: string;
  // Metadata Identitas
  kitchenName?: string;
  address?: string;
  hotelName?: string;   // Added from PDF Page 7
  hotelNumber?: string; // Added from PDF Page 7
  kloterName?: string;  // Added from PDF Page 7
  pic?: string; // Used for "Petugas" in some contexts or generic PIC
  surveyor?: string;
  date?: string;
  time?: string;
  notes?: string;
}

export interface TenantRecord {
  id: number;
  shopName: string;
  productType: string;
  bestSeller: string;
  rentCost: string;
  // Metadata Identitas
  hotelName?: string;
  address?: string;
  sector?: string;      // Added from PDF Page 10
  location?: string;    
  pic?: string;        
  surveyor?: string;
  date?: string;
  time?: string;
  notes?: string;
}

export interface ExpeditionRecord {
  id: number;
  companyName: string;
  pricePerKg: string;
  weight: string;
  // Metadata Identitas
  hotelName?: string;
  address?: string;
  sector?: string;      // Added from PDF Page 11
  location?: string;
  pic?: string;
  surveyor?: string;
  date?: string;
  time?: string;
  notes?: string;
}

export interface TelecomRecord {
  id: number;
  providerName: string;
  roamingPackage: string;
  // Metadata Identitas
  respondentName?: string;
  kloter?: string;      // Added from PDF Page 13
  embarkation?: string; // Added from PDF Page 13
  province?: string;    // Added from PDF Page 13
  surveyor?: string;
  date?: string;
  notes?: string;
}

export interface RiceRecord {
  id: number;
  companyName: string;
  riceType: string; // Premium or other
  isUsed: boolean;
  volume: string;
  price: string;
  otherRice: string;
  originProduct: string;
  productPrice: string;
  // Metadata
  kitchenName?: string;
  address?: string;
  pic?: string;
  surveyor?: string;
  date?: string;
  time?: string;
  notes?: string;
}

export enum Page {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  DATA_ENTRY_PORTAL = 'DATA_ENTRY_PORTAL',
  FORM_BUMBU = 'FORM_BUMBU',
  FORM_RTE = 'FORM_RTE',
  FORM_TENANT = 'FORM_TENANT',
  FORM_EXPEDITION = 'FORM_EXPEDITION',
  FORM_TELECOM = 'FORM_TELECOM',
  FORM_RICE = 'FORM_RICE', // Added
  REPORTS = 'REPORTS',
  VISUALIZATION = 'VISUALIZATION',
  SETTINGS = 'SETTINGS'
}

export enum Status {
  ALL = 'ALL',
  DONE = 'DONE',
  ON_PROGRESS = 'ON_PROGRESS',
  FAILED = 'FAILED',
}
