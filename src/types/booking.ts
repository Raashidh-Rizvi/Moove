export interface BookingRequest {
  id: number;
  propertyId: number;
  tenantId: string;
  landlordId: string;
  moveInDate: string;
  moveOutDate: string;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
  createdAt: string;
  updatedAt: string;
  property?: Property;
  tenant?: User;
  landlord?: User;
  documents?: RequestDocument[];
}

export interface RequestDocument {
  id: number;
  requestId: number;
  documentType: 'ID' | 'INCOME_PROOF' | 'REFERENCE' | 'OTHER';
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadedAt: string;
}

export interface Notification {
  id: number;
  userId: string;
  type: 'BOOKING_REQUEST' | 'BOOKING_ACCEPTED' | 'BOOKING_DECLINED' | 'MESSAGE' | 'PROPERTY_UPDATE';
  title: string;
  message: string;
  readStatus: boolean;
  createdAt: string;
  relatedId?: number;
}

export interface District {
  id: number;
  name: string;
  nameEn: string;
  nameSi: string;
  nameTa: string;
}

export interface Town {
  id: number;
  districtId: number;
  name: string;
  nameEn: string;
  nameSi: string;
  nameTa: string;
}

export interface PropertyLocation {
  district: string;
  town: string;
  area?: string;
  latitude?: number;
  longitude?: number;
  formattedAddress?: string;
}

export interface PropertyImage {
  id: number;
  propertyId: number;
  imageUrl: string;
  imageOrder: number;
  isMainImage: boolean;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
}