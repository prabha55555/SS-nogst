import { memo } from 'react';

import { Card, Divider, KeyValue } from '@/ui';
import { AddressText, CustomerName, PhoneReveal, ReminderAction, TONE_CLASS } from './CustomerCells';
import { buildRowModel } from './rowModel';

/** One table row of the web page as a card (phones / tablets): identity, the six amounts, reminder action. */
export const CustomerCard = memo(function CustomerCard({ customer, onRemind }) {
  const row = buildRowModel(customer);
  return (
    <Card className="flex h-full flex-col p-3.5">
      <CustomerName name={customer.name} hasReturns={row.hasReturns} />
      <PhoneReveal phone={customer.phone} showIcon />
      <AddressText address={customer.address} showIcon />
      <Divider />
      <KeyValue label="Total Invoices" value={row.invoices} />
      <KeyValue label="Total Amount" value={row.amount} valueClassName={TONE_CLASS[row.tones.amount]} />
      <KeyValue label="Amount Paid" value={row.paid} valueClassName={TONE_CLASS[row.tones.paid]} />
      <KeyValue label="Discount" value={row.discount} valueClassName={TONE_CLASS[row.tones.discount]} />
      <KeyValue label="Returns" value={row.returns} valueClassName={TONE_CLASS[row.tones.returns]} />
      <KeyValue label="Balance Due" value={row.balance} valueClassName={TONE_CLASS[row.tones.balance]} bold />
      <div className="mt-auto pt-3">
        <ReminderAction customer={customer} onRemind={onRemind} />
      </div>
    </Card>
  );
});
