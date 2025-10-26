
import React from 'react';
import type { InvoiceData, InvoiceLineItem } from '../types';
import AccountSelector from './AccountSelector';

interface InvoiceTableProps {
  invoiceData: InvoiceData;
  onAccountChange: (itemIndex: number, newAccountNumber: string) => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoiceData, onAccountChange }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Invoice Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                <div>
                    <p className="text-gray-500 font-semibold">Invoice #</p>
                    <p className="text-gray-800">{invoiceData.invoiceNumber}</p>
                </div>
                <div>
                    <p className="text-gray-500 font-semibold">Date</p>
                    <p className="text-gray-800">{invoiceData.invoiceDate}</p>
                </div>
                <div className="md:text-right">
                    <p className="text-gray-500 font-semibold">Net</p>
                    <p className="text-gray-800">{formatCurrency(invoiceData.totalNet)}</p>
                </div>
                <div className="md:text-right">
                    <p className="text-gray-500 font-semibold">Tax</p>
                    <p className="text-gray-800">{formatCurrency(invoiceData.totalTax)}</p>
                </div>
                <div className="col-span-2 md:col-span-4 md:text-right">
                    <p className="text-gray-500 font-bold text-lg">Total Gross</p>
                    <p className="text-blue-600 font-bold text-xl">{formatCurrency(invoiceData.totalGross)}</p>
                </div>
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pos</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accounting Account</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {invoiceData.lineItems.map((item, index) => (
                    <tr key={item.pos}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.pos}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(item.totalPrice)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" style={{minWidth: '250px'}}>
                            <AccountSelector 
                                selectedValue={item.suggestedAccountNumber} 
                                onChange={(newValue) => onAccountChange(index, newValue)}
                            />
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="p-6 bg-gray-50 flex justify-end">
             <button
                type="button"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => alert('Booking confirmed (demo)!')}
                >
                Book Entries
            </button>
        </div>
    </div>
  );
};

export default InvoiceTable;

