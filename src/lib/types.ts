export type StudioRole = 'owner' | 'admin' | 'kasir' | 'magang' | 'user';

export interface StudioUser {
  id: string;
  name: string;
  email?: string;
  username: string;
  passcode?: string; // Access code for kasir / magang / staff
  password?: string; // Password for email login
  role: StudioRole;
  status: 'active' | 'inactive';
  phone?: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface StudioRoomPricing {
  id: string;
  name: string;
  code: string;
  dimensions: string;
  halfDayPrice: number; // in IDR Rupiah
  fullDayPrice: number; // in IDR Rupiah
  hourlyRate: number;
  description: string;
  features: string[];
  isActive: boolean;
}

export interface StudioAddon {
  id: string;
  name: string;
  price: number; // in IDR Rupiah
  category: string;
  desc: string;
  isActive: boolean;
}

export interface StudioBooking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  roomId: string;
  roomName: string;
  date: string;
  timeSlot: string;
  duration: 'half' | 'full' | 'hourly';
  selectedAddons: Array<{ id: string; name: string; price: number }>;
  totalPrice: number;
  depositPaid: number;
  paymentStatus: 'unpaid' | 'dp_paid' | 'paid' | 'refunded';
  bookingStatus: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  handledBy?: string;
}

export interface StudioGalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  photographer: string;
  date: string;
  client?: string;
  featured: boolean;
  aspectRatio: 'portrait' | 'landscape' | 'square';
}

export interface StaffSession {
  userId: string;
  name: string;
  username: string;
  role: StudioRole;
  email?: string;
  loginTime: string;
}

export interface StudioSpaceItem {
  id: string;
  number: string;
  name: string;
  tagline: string;
  image: string;
  secondaryImage: string;
  area: string;
  ceiling: string;
  cove: string;
  power: string;
  hourlyRate: string;
  features: string[];
  idealFor: string[];
  equipmentIncluded: string[];
  isActive: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  gear: string;
}

export interface CoreValue {
  id: string;
  title: string;
  desc: string;
}

export interface StudioAboutContent {
  headline?: string;
  subheadline?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  storyParagraph1: string;
  storyParagraph2: string;
  ethosQuote?: string;
  milestones?: Array<{ label: string; value: string }>;
  team: TeamMember[];
  values: CoreValue[];
  clientBrands: string[];
}

export interface StudioContactSettings {
  brandName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  addressLine1: string;
  addressSubdistrict: string;
  addressCity: string;
  googleMapsUrl: string;
  operatingHours: string;
  instagramHandle: string;
}

export interface DurationOption {
  id: string;
  label: string;
  minutes: number;
  price: number;
  isPopular?: boolean;
}

export interface PersonOption {
  count: number;
  label: string;
  extraPrice: number;
}

export interface BookingExperiencePackage {
  id: string;
  name: string;
  category?: string;
  badge: string;
  badgeColor?: string;
  image: string;
  basePriceTag: string;
  description: string;
  durationOptions: DurationOption[];
  personOptions: PersonOption[];
  features: string[];
  isActive?: boolean;
}
