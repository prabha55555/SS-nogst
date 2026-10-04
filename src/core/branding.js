/** Company details printed on invoices / WhatsApp statements (taken verbatim from the web app's pdf.js). */
export const COMPANY = {
  name: 'SANTHAMANI TEXTILES',
  displayName: 'Santhamani Textiles',
  address: 'No.16/1, 25A, Thirumalai Nagar South, 1st Street, TIRUPUR - 641 602.',
  cell: '90872 93268, 9092779599',
  gpay: '90872 93268, 9092779599',
  /** printed above the logo on invoices */
  tagline: 'ஸ்ரீ அங்காளம்மன் துணை',
  /** shown in the WhatsApp statement footer (the web app used "Palladam" there) */
  whatsappLocation: 'Palladam',
  whatsappPhones: '90872 93268, 9092779599',
  /** developer credit appended to invoices and WhatsApp messages by the web app */
  creditName: 'Sabarish R.',
  creditPhone: '7845081278',
};
export const CREDIT_LINE = `Software created by ${COMPANY.creditName}\nFor custom billing solutions, contact: ${COMPANY.creditPhone}`;
/** Country calling code prepended to 10-digit Indian numbers for wa.me links. */
export const COUNTRY_CODE = '91';
