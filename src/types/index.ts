export interface User {
  userId: string;
  username: string;
  userEmail: string;
  userPhone: string;
  userAddress: string;
  userPassword: string;
  userRole: 'LANDLORD' | 'CLIENT';
}

export interface Property {
  propertyId: number;
  user: User;
  propertyName: string;
  propertyDescription: string;
  propertyPrice: number;
  propertyType: 'APARTMENT' | 'HOUSE' | 'ROOM';
  propertySize: number;
  bedroomsAvailable: number;
  bathroomsAvailable: number;
  propertyImageUrl: string;
  propertyReview: string;
}

export interface Review {
  reviewId: number;
  user: User;
  property: Property;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Booking {
  bookingId: number;
  user: User;
  totalAmount: number;
  bookingDate: string;
  checkInDate: string;
  checkInTime: string;
  checkOutTime: string;
  checkOutDate: string;
  checkedByOwner: boolean;
  conformedByOwner: boolean;
  status: string;
}

export interface Message {
  id: number;
  sender: User;
  receiver: User;
  content: string;
  sentAt: string;
}