/**
 * Supplier Details — replaces legacy/supplier-details.html + js/supplier-details.js.
 * Per-supplier totals built from the purchase bills: stats grid, search, table (desktop) / cards (phones, tablets),
 * revealable phone numbers and CSV export. `?phone=` opens the page already searching for that supplier.
 */
import { Download, FileText, RefreshCw, Truck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { db } from '@/core/db';
import { useFocusLoad } from '@/hooks/useFocusLoad';
import { useRouteParams } from '@/hooks/useRouteParams';
import {
  Button,
  EmptyState,
  ErrorState,
  LoadingState,
  Page,
  SearchBar,
  SectionHeader,
  useFeedback,
} from '@/ui';
import { SupplierList } from '../components/SupplierList';
import { SupplierStatsGrid } from '../components/SupplierStatsGrid';
import { aggregateSuppliers, filterSuppliers, supplierStats } from '../supplierDetails';
import { exportSuppliersCsv } from '../supplierExport';

export default function SupplierDetailsPage() {
  const { toast } = useFeedback();
  const { params } = useRouteParams();
  const [bills, setBills] = useState([]);
  const [query, setQuery] = useState(() => (typeof params.phone === 'string' ? params.phone : ''));
  const [exporting, setExporting] = useState(false);

  const { loading, refreshing, error, refresh } = useFocusLoad(async () => {
    setBills(await db.getAllPurchaseBills());
  });

  const suppliers = useMemo(() => aggregateSuppliers(bills), [bills]);
  const stats = useMemo(() => supplierStats(suppliers), [suppliers]);
  const visible = useMemo(() => filterSuppliers(suppliers, query), [suppliers, query]);

  const onExport = async () => {
    if (suppliers.length === 0) {
      toast('Nothing to export', 'No supplier data to export.', 'warning');
      return;
    }
    setExporting(true);
    try {
      // like the original, the export covers every supplier, not just the searched ones
      await exportSuppliersCsv(suppliers);
    } catch (e) {
      console.error('Error exporting suppliers:', e);
      toast('Export failed', 'Could not export the supplier list.', 'error');
    } finally {
      setExporting(false);
    }
  };

  if (loading && bills.length === 0) {
    return (
      <Page title="Supplier Details" icon={Truck}>
        <LoadingState label="Loading supplier data…" />
      </Page>
    );
  }
  if (error && bills.length === 0) {
    return (
      <Page title="Supplier Details" icon={Truck}>
        <ErrorState message={`Error loading supplier data: ${error}`} onRetry={refresh} />
      </Page>
    );
  }

  return (
    <Page title="Supplier Details" icon={Truck} max="7xl">
      <div className="space-y-4">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search by supplier name, phone, or address..."
          aria-label="Search suppliers"
        />
        <SupplierStatsGrid stats={stats} />
        <SectionHeader
          title="Supplier List"
          icon={FileText}
          className="mb-0"
          right={
            <div className="flex gap-2">
              <Button variant="success" icon={Download} loading={exporting} onClick={onExport}>
                Export
              </Button>
              <Button variant="danger" icon={RefreshCw} loading={refreshing} onClick={refresh}>
                Refresh
              </Button>
            </div>
          }
        />
        <SupplierList
          suppliers={visible}
          empty={
            <EmptyState
              icon={Truck}
              title="No Suppliers Found"
              message={
                query.trim()
                  ? 'No supplier matches your search.'
                  : 'Start by creating purchase bills to see supplier data here'
              }
            />
          }
        />
      </div>
    </Page>
  );
}
