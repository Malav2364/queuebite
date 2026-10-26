export type MemberReadinessStatus = 'arrived' | 'parking' | 'on_the_way' | 'delayed';

export interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: 'host' | 'co-host' | 'member';
  status: MemberReadinessStatus;
  eta: string;
  distance?: string;
  dietary?: string[];
  joinedAt: string;
  isCurrentUser?: boolean;
}

export type GroupStatus = 'planning' | 'in_queue' | 'seated' | 'completed' | 'cancelled';

export interface DiningGroup {
  id: string;
  name: string;
  inviteCode: string;
  hostId: string;
  hostName: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  restaurantAddress: string;
  targetTime: string;
  occasion: string;
  partySizeTarget: number;
  members: GroupMember[];
  queueToken?: string;
  queuePosition?: number;
  partiesAhead?: number;
  estimatedWaitMinutes?: number;
  status: GroupStatus;
  seatingPreference: string;
  notes: string;
  isLocked?: boolean;
}

export const MOCK_ACTIVE_GROUP: DiningGroup = {
  id: 'grp-01',
  name: 'Friday Foodies Squad',
  inviteCode: 'QB-8842',
  hostId: 'usr-malav',
  hostName: 'Malav (You)',
  restaurantId: '1',
  restaurantName: 'The Daily Bean',
  restaurantImage:
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
  restaurantAddress: 'Alkapuri, Vadodara',
  targetTime: 'Tonight, 8:15 PM',
  occasion: 'Weekend Hangout',
  partySizeTarget: 4,
  queueToken: 'G-14',
  queuePosition: 2,
  partiesAhead: 1,
  estimatedWaitMinutes: 8,
  status: 'in_queue',
  seatingPreference: 'Quiet Booth / Outdoor',
  notes: 'Celebrating Rohan’s promotion, 2 pure veg diners in group',
  isLocked: false,
  members: [
    {
      id: 'usr-malav',
      name: 'Malav (Host)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      role: 'host',
      status: 'arrived',
      eta: 'At Entrance',
      distance: '0 m',
      dietary: ['Pure Veg'],
      joinedAt: '7:30 PM',
      isCurrentUser: true,
    },
    {
      id: 'usr-rohan',
      name: 'Rohan Sharma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      role: 'member',
      status: 'arrived',
      eta: 'At Entrance',
      distance: '10 m',
      dietary: [],
      joinedAt: '7:34 PM',
    },
    {
      id: 'usr-priya',
      name: 'Priya Patel',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      role: 'member',
      status: 'parking',
      eta: '3 mins (Parking)',
      distance: '80 m',
      dietary: ['Jain Food'],
      joinedAt: '7:40 PM',
    },
    {
      id: 'usr-ananya',
      name: 'Ananya Verma',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      role: 'member',
      status: 'on_the_way',
      eta: '6 mins (Cab)',
      distance: '450 m',
      dietary: ['Gluten-Free'],
      joinedAt: '7:45 PM',
    },
  ],
};
