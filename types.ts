
export interface Location {
  lat: number;
  lng: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface RecyclingFacility {
  id: string;
  name: string;
  address: string;
  location: Location;
  materials: string[];
  type: 'Center' | 'Drop-off' | 'Store';
  isCrowdsourced?: boolean;
  phone?: string;
  openingHours?: string;
  description?: string;
  imageUrl?: string;
  status: 'approved' | 'pending';
  reviews: Review[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  sources?: GroundingSource[];
}
