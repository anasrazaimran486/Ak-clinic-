export interface AppointmentRequest {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  timeSlot: string;
  message: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  details?: string[];
  iconName: string;
}

export interface AwarenessTopic {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string[];
  readTime: string;
  iconName: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  altText: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  fee: number;
  isActive: boolean;
}

export interface Token {
  id: string;
  tokenNumber: string; // e.g., "001", "002"
  fullName: string;
  dob: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorFee: number;
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  date: string; // YYYY-MM-DD
  treatment?: string;
}

export interface Invoice {
  id: string;
  invoiceId: string; // INV-2026-0001
  tokenNumber: string;
  patientName: string;
  age: number;
  gender: string;
  doctorName: string;
  doctorFee: number;
  totalAmount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Partial';
  paymentMethod: 'Cash' | 'Online';
  generatedAt: string;
  dob?: string;
  treatment?: string;
}

