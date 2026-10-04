/**
 * Turning statement HTML into something the user can use: the browser print dialog ("Save as PDF" / print).
 */
import { printHtml } from '@/platform';

/** Opens the print dialog for the statement. */
export async function printStatementHtml(html) {
  await printHtml(html);
}

/** The browser has no silent PDF-file step: callers fall back to printing ('unavailable'). */
export async function shareStatementPdf() {
  return 'unavailable';
}

/** Kept for API parity with the mobile build; the browser prints directly. */
export async function createStatementPdf() {
  throw new Error('PDF files are produced through the browser print dialog.');
}
