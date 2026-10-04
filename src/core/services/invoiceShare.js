/**
 * Print / share for sales invoices (the original used window.print + a wa.me link).
 *  - printInvoice():     browser print dialog (also "Save as PDF") — ORIGINAL + COPY pages
 *  - shareInvoicePdf():  print dialog, then opens the customer's WhatsApp chat so the PDF can be attached
 */
import logoUrl from '@/assets/logo.png';
import { calculateTotalReturns } from '@/core/billing';
import { db } from '@/core/db';
import { printHtml } from '@/platform';
import { buildCombinedInvoiceHtml } from './invoiceHtml';
import { normalizeWhatsAppPhone, openWhatsApp } from './whatsapp';

let logoPromise = null;

/** Company logo as a data URI so it is embedded in printed documents (works offline and inside the print iframe). */
export function getLogoSrc() {
  if (!logoPromise) {
    logoPromise = (async () => {
      try {
        const blob = await (await fetch(logoUrl)).blob();
        return await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.warn('Could not load logo for invoice', error);
        return '';
      }
    })();
  }
  return logoPromise;
}

async function buildContext(invoice) {
  const totalReturns = await calculateTotalReturns(invoice.invoiceNo);
  const returns = await db.getReturnsByInvoice(invoice.invoiceNo);
  return {
    invoice,
    totalReturns,
    adjustedBalanceDue: invoice.balanceDue - totalReturns,
    returns,
    logoSrc: await getLogoSrc(),
  };
}

/** Opens the print dialog for the combined ORIGINAL + COPY invoice. */
export async function printInvoice(invoice) {
  const html = buildCombinedInvoiceHtml(await buildContext(invoice));
  await printHtml(html);
}

/**
 * "Share BILL": print dialog (save as PDF) and open the customer's WhatsApp chat to attach it.
 * Returns 'fallback' (kept from the mobile port so callers can word their toast).
 */
export async function shareInvoicePdf(invoice) {
  await printInvoice(invoice);
  if (normalizeWhatsAppPhone(invoice.customerPhone)) await openWhatsApp(invoice.customerPhone);
  return 'fallback';
}
