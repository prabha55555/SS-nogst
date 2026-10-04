/**
 * "Bill to Party": the phone drives the lookup, name/address are read-only (customers are created on Add Customer).
 * When a full phone number matches nobody, a hint links to Add Customer with `?phone=`. Below it, the
 * "Customer Account Summary" (total of previous bills + balance carried forward) when the customer has history.
 *
 * Props
 *  - customers: Array<{phone, name, address}>
 *  - phone, name, address: string
 *  - notFoundPhone: string | null        from useCustomerLookup().notFoundPhone
 *  - onPhoneChange(phone) · onSelect(party)
 *  - summary: { totalPreviousBills, balanceCarriedForward } | null
 */
import { PartyNotFoundHint, PartyPicker } from '@/components/bill';
import { formatCurrency } from '@/core/format';

const rupees = (n) => `₹${formatCurrency(n)}`;

export function CustomerSection({
  customers,
  phone,
  name,
  address,
  notFoundPhone,
  onPhoneChange,
  onSelect,
  summary,
}) {
  const showHint = notFoundPhone !== null && notFoundPhone === phone.trim();
  return (
    <div className="space-y-3">
      <PartyPicker
        partyLabel="Customer"
        parties={customers}
        phone={phone}
        name={name}
        address={address}
        onPhoneChange={onPhoneChange}
        onSelect={onSelect}
        notFound={
          showHint ? (
            <PartyNotFoundHint
              partyLabel="Customer"
              to={`/sales/add-customer?phone=${encodeURIComponent(notFoundPhone)}`}
            />
          ) : null
        }
      />
      {summary ? (
        <div className="rounded-lg bg-brand-50 p-3" aria-label="Customer Account Summary">
          <h3 className="mb-1 text-sm font-bold text-brand-800">Customer Account Summary</h3>
          <div className="flex justify-between gap-3 text-sm">
            <span className="text-slate-600">Total Previous Bills:</span>
            <span className="font-semibold tabular-nums">{rupees(summary.totalPreviousBills)}</span>
          </div>
          <div className="flex justify-between gap-3 text-sm">
            <span className="text-slate-600">Balance Carried Forward:</span>
            <span className="font-semibold text-red-600 tabular-nums">
              {rupees(summary.balanceCarriedForward)}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
