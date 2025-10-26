
import React from 'react';
import { ACCOUNTING_ACCOUNTS } from '../constants';
import type { AccountingAccount } from '../types';

interface AccountSelectorProps {
  selectedValue: string;
  onChange: (newValue: string) => void;
}

const AccountSelector: React.FC<AccountSelectorProps> = ({ selectedValue, onChange }) => {
  return (
    <select
      value={selectedValue}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
    >
      <option value="">Select Account</option>
      {ACCOUNTING_ACCOUNTS.map((account: AccountingAccount) => (
        <option key={account.number} value={account.number}>
          {account.number} - {account.name}
        </option>
      ))}
    </select>
  );
};

export default AccountSelector;
