export interface Client {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    joinDate: Date;
    totalOrders: number;
    status: 'active' | 'inactive';
    notes?: string;
  }