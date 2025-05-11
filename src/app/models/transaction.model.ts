export interface Transaction {
    id: number;
    date: string | Date;
    clientName: string;
    type: string;
    amount: number;
    status: string;
    paymentMethod: string;
    reference: string;
}
