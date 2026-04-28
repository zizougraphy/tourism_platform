export enum UserRole {
  TOURIST = 'tourist',
  PROVIDER = 'provider',
  ADMIN = 'admin',
}

export enum ServiceCategory {
  HOTEL = 'hotel',
  RESTAURANT = 'restaurant',
  TOUR = 'tour',
  TRANSPORT = 'transport',
  ACTIVITY = 'activity',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  price: number;
  rating: number;
  reviewCount: number;
  location: string;
  city: string;
  images: string[];
  providerId: string;
  providerName: string;
  amenities: string[];
  featured?: boolean;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  userId: string;
  date: string;
  status: BookingStatus;
  totalPrice: number;
  guests: number;
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  image: string;
  serviceCount: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}
