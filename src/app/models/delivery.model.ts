export interface Delivery {
    id: string;
    customer: string;
    address: string;
    status: 'delivered' | 'in-progress' | 'pending';
    time: string;
    amount: string;
    courier: string;
  }
  export interface Deliveries {
    id: string;
    orderId: string;
    status: 'pending' | 'in_transit' | 'delivered' | 'failed' | 'returned';
    estimatedDelivery: string;
    actualDelivery?: string;
    customer: {
      name: string;
      address: string;
      phone: string;
    };
    deliveryAgent?: {
      id: string;
      name: string;
      phone: string;
      photo: string;
      rating: number;
    };
    items: number;
    location: {
      lat: number;
      lng: number;
    };
    notes?: string;
    signature?: string;
    trackingHistory: TrackingEvent[];
  }
  
  export interface TrackingEvent {
    timestamp: string;
    status: string;
    description: string;
    location?: string;
  }
  
  export interface Location {
    name: string;
    percentage: number;
  }