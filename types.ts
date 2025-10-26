
export interface AccountingAccount {
  number: string;
  name: string;
  description?: string;
  category: string;
}

export interface InvoiceLineItem {
  pos: number;
  articleNumber: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate: number;
  suggestedAccountNumber: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  totalNet: number;
  totalTax: number;
  totalGross: number;
  lineItems: InvoiceLineItem[];
}
