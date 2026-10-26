export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface CustomizationSection {
  id: string;
  title: string;
  required: boolean;
  maxSelect: number;
  options: CustomizationOption[];
}

export interface OrderItem {
  id: string;
  dishId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  isVeg: boolean;
  selectedOptions?: {
    size?: string;
    spiceLevel?: string;
    addOns?: string[];
  };
  specialInstructions?: string;
}

export type PreOrderTimingMode =
  | 'upon_seating'
  | 'ten_mins_before'
  | 'immediate'
  | 'scheduled';

export type OrderStatus =
  | 'confirmed'
  | 'standby'
  | 'cooking'
  | 'ready'
  | 'served'
  | 'cancelled'
  | 'refunded';

export interface PreOrder {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  restaurantAddress: string;
  queueToken: string;
  queuePosition: number;
  status: OrderStatus;
  timingMode: PreOrderTimingMode;
  scheduledTime?: string;
  items: OrderItem[];
  subtotal: number;
  taxes: number;
  serviceCharge: number;
  discount: number;
  total: number;
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
  estimatedServeTime: string;
  tableNumber?: string;
}

export const MOCK_CART_ITEMS: OrderItem[] = [
  {
    id: 'cart-1',
    dishId: 'd-1',
    name: 'Truffle Mushroom Risotto',
    price: 490,
    image:
      'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=600&auto=format&fit=crop&q=80',
    quantity: 1,
    isVeg: true,
    selectedOptions: {
      size: 'Regular',
      spiceLevel: 'Mild',
      addOns: ['Extra Truffle Oil (+₹60)'],
    },
    specialInstructions: 'Less garlic, please',
  },
  {
    id: 'cart-2',
    dishId: 'd-2',
    name: 'Woodfired Margherita Pizza',
    price: 420,
    image:
      'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80',
    quantity: 1,
    isVeg: true,
    selectedOptions: {
      size: '11 inch Large (+₹90)',
      addOns: ['Fresh Basil', 'Burrata Cheese (+₹80)'],
    },
  },
  {
    id: 'cart-3',
    dishId: 'd-3',
    name: 'Classic Cappuccino',
    price: 220,
    image:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80',
    quantity: 2,
    isVeg: true,
    selectedOptions: {
      size: 'Regular',
      addOns: ['Oat Milk (+₹40)'],
    },
  },
];
