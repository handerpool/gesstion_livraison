export interface Transaction {
    id: number;
    date: string | Date;
    clientName: string;
    amount: number;
    status: string;
    reference: string;
}
