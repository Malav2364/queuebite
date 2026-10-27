import { Platform } from 'react-native';
import { ActiveQueueEntry, Restaurant } from '@/types/queuebite';

// In Android emulator, localhost is 10.0.2.2; on web/iOS it is localhost
const DEFAULT_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_HOST;

interface FetchOptions extends RequestInit {
  token?: string | null;
}

async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers = {}, ...customConfig } = options;

  const authHeaders: Record<string, string> = {};
  if (token) {
    authHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...(headers as Record<string, string>),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.error?.message || data?.message || `Request failed with status ${response.status}`;
    const error = new Error(message);
    (error as any).code = data?.error?.code;
    (error as any).status = response.status;
    throw error;
  }

  return data?.data !== undefined ? data.data : data;
}

/**
 * Transforms backend restaurant entity into mobile Restaurant type.
 */
export function mapBackendRestaurant(raw: any): Restaurant {
  const distanceKm = raw.distanceKm;
  const estimatedWait = raw.estimatedWaitMinutes ?? 0;
  const isOpen = raw.isQueueOpen ?? true;

  return {
    id: raw.id,
    name: raw.name,
    image:
      raw.coverImageUrl ||
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    cuisine:
      raw.cuisines?.map((c: any) => c.name).join(', ') || 'Multi-Cuisine',
    priceRange: raw.priceRange || 'MODERATE',
    distance: distanceKm ? `${distanceKm} km` : '1.2 km',
    travelTime: distanceKm ? `~${Math.round(distanceKm * 3)} min drive` : '~6 min drive',
    waitRange: !isOpen
      ? 'Queue closed'
      : estimatedWait > 0
      ? `${estimatedWait}–${estimatedWait + 10} min`
      : 'None (<5 min)',
    waitMinutesEstimated: isOpen ? estimatedWait : null,
    queueState: isOpen ? 'OPEN' : 'CLOSED',
    maxPartySize: raw.operatingSettings?.maxPartySize ?? 12,
    minPartySize: raw.operatingSettings?.minPartySize ?? 1,
    partiesInQueue: raw.activeQueueCount ?? 0,
    lastUpdated: 'Live',
    address: raw.location
      ? `${raw.location.addressLine1}, ${raw.location.city}`
      : 'Bengaluru',
    rating: 4.8,
    reviewCount: 142,
    description: raw.description,
    categories: raw.cuisines?.map((c: any) => c.name) || [],
    phone: raw.phone,
    photos: raw.photos?.map((p: any) => ({ id: p.id, image: p.url })) || [],
  };
}

/**
 * Transforms backend queue entry into mobile ActiveQueueEntry type.
 */
export function mapBackendQueueEntry(raw: any): ActiveQueueEntry {
  const waitMins = raw.currentEstimatedWaitMinutes ?? raw.estimatedWaitMinutes ?? 15;
  const joinedDate = raw.joinedAt ? new Date(raw.joinedAt) : new Date();

  return {
    id: raw.id,
    restaurantId: raw.restaurantId,
    restaurantName: raw.restaurant?.name || 'Restaurant',
    restaurantImage:
      raw.restaurant?.coverImageUrl ||
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    status: raw.status,
    waitRange: `${waitMins}–${waitMins + 8} min`,
    updatedAgo: 'Live',
    partiesAhead: raw.partiesAhead ?? (raw.positionInLine ? Math.max(0, raw.positionInLine - 1) : 0),
    partySize: raw.partySize,
    joinedAt: joinedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    estimatedSeatingTime: new Date(Date.now() + waitMins * 60000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}

// ==========================================
// REST API CLIENT METHODS
// ==========================================

export const api = {
  // Restaurants
  async getRestaurants(params?: {
    search?: string;
    cuisine?: string;
    lat?: number;
    lng?: number;
  }): Promise<Restaurant[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.cuisine) query.append('cuisine', params.cuisine);
    if (params?.lat !== undefined) query.append('lat', String(params.lat));
    if (params?.lng !== undefined) query.append('lng', String(params.lng));

    const qs = query.toString();
    const result = await request<{ restaurants: any[] }>(`/api/v1/restaurants${qs ? `?${qs}` : ''}`);
    return (result.restaurants || []).map(mapBackendRestaurant);
  },

  async getRestaurantById(idOrSlug: string): Promise<any> {
    const raw = await request<any>(`/api/v1/restaurants/${idOrSlug}`);
    return {
      ...mapBackendRestaurant(raw),
      hours: raw.hours,
      totalTables: raw.totalTables,
    };
  },

  async getRestaurantMenu(restaurantId: string): Promise<any> {
    return request<any>(`/api/v1/restaurants/${restaurantId}/menu`);
  },

  // Cuisines
  async getCuisines(): Promise<Array<{ id: string; name: string; slug: string; iconUrl?: string }>> {
    return request<any[]>('/api/v1/cuisines');
  },

  // Queue Operations
  async joinQueue(
    restaurantId: string,
    payload: {
      guestName: string;
      guestPhone: string;
      partySize: number;
      notes?: string;
      idempotencyKey?: string;
    },
    token?: string | null
  ): Promise<ActiveQueueEntry> {
    const raw = await request<any>(`/api/v1/restaurants/${restaurantId}/queue/join`, {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    });
    return mapBackendQueueEntry(raw);
  },

  async getQueueEntry(queueEntryId: string): Promise<ActiveQueueEntry> {
    const raw = await request<any>(`/api/v1/queue/entries/${queueEntryId}`);
    return mapBackendQueueEntry(raw);
  },

  async cancelQueueEntry(queueEntryId: string, reason?: string, token?: string | null): Promise<any> {
    return request<any>(`/api/v1/queue/entries/${queueEntryId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
      token,
    });
  },

  // User Profile & Clerk Sync
  async syncUser(
    profile: {
      clerkId?: string;
      email: string;
      name?: string | null;
      phone?: string | null;
      avatarUrl?: string | null;
    },
    token?: string | null
  ): Promise<any> {
    return request<any>('/api/v1/users/sync', {
      method: 'POST',
      body: JSON.stringify(profile),
      token,
    });
  },

  async getMe(token: string): Promise<any> {
    return request<any>('/api/v1/users/me', {
      token,
    });
  },

  async updatePreferences(
    preferences: {
      maxWaitMinutes?: number | null;
      preferredPartySize?: number;
      pushNotifications?: boolean;
      smsNotifications?: boolean;
      dietaryTags?: string[];
      cuisineIds?: string[];
    },
    token: string
  ): Promise<any> {
    return request<any>('/api/v1/users/me/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
      token,
    });
  },

  // ==========================================
  // GROUP DINING & PARTY LINKS (OPTION 2)
  // ==========================================
  async createGroupSession(
    payload: {
      restaurantId: string;
      creatorName: string;
      creatorPhone?: string;
      name?: string;
    },
    token?: string | null
  ): Promise<any> {
    return request<any>('/api/v1/groups', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    });
  },

  async getGroupSession(codeOrId: string): Promise<any> {
    return request<any>(`/api/v1/groups/${codeOrId}`);
  },

  async joinGroupSession(
    codeOrId: string,
    payload: {
      name: string;
      phone?: string;
      dietaryNotes?: string;
    },
    token?: string | null
  ): Promise<any> {
    return request<any>(`/api/v1/groups/${codeOrId}/join`, {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    });
  },

  async toggleMemberReady(
    sessionId: string,
    memberId: string,
    isReady: boolean
  ): Promise<any> {
    return request<any>(`/api/v1/groups/${sessionId}/members/${memberId}/ready`, {
      method: 'PATCH',
      body: JSON.stringify({ isReady }),
    });
  },

  async submitGroupQueue(
    sessionId: string,
    notes?: string
  ): Promise<any> {
    return request<any>(`/api/v1/groups/${sessionId}/queue`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  },

  async getGroupPreOrders(sessionId: string): Promise<any[]> {
    return request<any[]>(`/api/v1/groups/${sessionId}/pre-orders`);
  },

  // ==========================================
  // QUEUE-AWARE PRE-ORDERING (OPTION 3)
  // ==========================================
  async createPreOrder(
    payload: {
      restaurantId: string;
      queueEntryId?: string;
      groupSessionId?: string;
      customerName?: string;
      customerPhone?: string;
      specialNotes?: string;
      items: Array<{
        menuItemId: string;
        quantity: number;
        specialNotes?: string;
      }>;
    },
    token?: string | null
  ): Promise<any> {
    return request<any>('/api/v1/orders/pre-order', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    });
  },

  async getPreOrder(orderId: string): Promise<any> {
    return request<any>(`/api/v1/orders/${orderId}`);
  },

  async getQueuePreOrders(queueEntryId: string): Promise<any[]> {
    return request<any[]>(`/api/v1/queue/entries/${queueEntryId}/pre-orders`);
  },

  async getRestaurantPreOrders(restaurantId: string, status?: string): Promise<any[]> {
    const qs = status ? `?status=${status}` : '';
    return request<any[]>(`/api/v1/restaurants/${restaurantId}/pre-orders${qs}`);
  },

  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    return request<any>(`/api/v1/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};
