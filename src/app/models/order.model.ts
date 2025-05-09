export interface Order {
    id: string;
    customer: {
      name: string;
      email: string;
      phone: string;
    };
    date: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    items: OrderItem[];
    total: string;
    paymentMethod: string;
    address: string;
  }
  
  export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: string;
  }