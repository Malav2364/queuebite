export type QueueStatus = 'WAITING' | 'NOTIFIED' | 'ARRIVING' | 'SEATED' | 'CANCELLED';

export interface ActiveQueueEntry {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  status: QueueStatus;
  waitRange: string; // e.g., "18–25 min"
  updatedAgo: string; // e.g., "1 min ago"
  partiesAhead: number;
  partySize: number;
  joinedAt: string;
  estimatedSeatingTime: string;
}

export type QueueState = 'OPEN' | 'PAUSED' | 'CLOSED' | 'UNKNOWN';

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  priceRange: string;
  distance: string; // e.g. "0.8 km"
  travelTime: string; // e.g. "~4 min drive"
  waitRange: string; // e.g. "12-18 min", or "None (<5 min)", or "Wait unavailable"
  waitMinutesEstimated: number | null; // e.g. 15 (for color badge logic: <15 green, 15-30 amber, >30 red, null grey)
  queueState: QueueState;
  maxPartySize: number;
  minPartySize: number;
  partiesInQueue: number;
  lastUpdated: string; // e.g. "2 min ago"
  address: string;
  rating: number;
  reviewCount: number;
  isFavorite?: boolean;
  tag?: string; // e.g. "Trending", "Must Try", "Top Rated"
  waitLabel?: string; // e.g. "Live", "Moderate", "Busy"
  description?: string;
  categories?: string[];
  timings?: string;
  phone?: string;
  groupsAhead?: number;
  dishes?: Dish[];
  photos?: PhotoItem[];
  reviews?: ReviewItem[];
}

export interface Dish {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
}

export interface PhotoItem {
  id: string;
  image: string;
  isVideo?: boolean;
}

export interface ReviewItem {
  id: string;
  author: string;
  avatar: string;
  dateAgo: string;
  rating: number;
  content: string;
  images?: string[];
}

export interface UserLocation {
  city: string;
  area: string;
  pincode?: string;
  isCustom?: boolean;
}

