/** Purchase Recycle Bin — replaces legacy/purchase-recycle-bin.html + js/purchase-recycle-bin.js (shared screen). */
import RecycleBinScreen from './RecycleBinScreen';

export default function PurchaseBinPage() {
  return <RecycleBinScreen kind="purchase" title="Purchase Recycle Bin" />;
}
