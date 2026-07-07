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
