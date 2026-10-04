import { FileText } from 'lucide-react';
import { Page } from '@/ui';
import { COMPANY, PRODUCT } from '@/core/branding';

export default function TermsOfServicePage() {
  return (
    <Page title="Terms of Service" icon={FileText} onBack={() => window.history.back()}>
      <div className="mx-auto max-w-3xl rounded-3xl border border-line bg-white p-6 shadow-card sm:p-10">
        <div className="prose prose-slate max-w-none">
          <p className="lead text-slate-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p>
            Welcome to <strong>{PRODUCT.name}</strong>, a service provided by <strong>{COMPANY.displayName}</strong>. 
            By accessing or using our application, you agree to be bound by these Terms of Service.
          </p>

          <h3 className="mt-8 mb-4 font-display text-xl font-bold text-brand-800">1. Acceptance of Terms</h3>
          <p>
            By using this software, you agree to these terms. If you do not agree, please do not use the application. We may update these terms occasionally, and your continued use constitutes acceptance of those changes.
          </p>

          <h3 className="mt-8 mb-4 font-display text-xl font-bold text-brand-800">2. Use of the Service</h3>
          <p>
            You must provide accurate information when registering and use the service in compliance with all applicable local, state, and national laws. You are responsible for maintaining the confidentiality of your account credentials.
          </p>

          <h3 className="mt-8 mb-4 font-display text-xl font-bold text-brand-800">3. Data Ownership and Privacy</h3>
          <p>
            You retain all rights to the data (invoices, customer details, supplier details) you enter into {PRODUCT.name}. 
            Our handling of your data is strictly governed by our Privacy Policy.
          </p>

          <h3 className="mt-8 mb-4 font-display text-xl font-bold text-brand-800">4. Service Availability</h3>
          <p>
            While we strive for 100% uptime, {COMPANY.displayName} does not guarantee that the service will be uninterrupted or error-free. The service is provided on an "as is" and "as available" basis.
          </p>

          <h3 className="mt-8 mb-4 font-display text-xl font-bold text-brand-800">5. Limitation of Liability</h3>
          <p>
            To the maximum extent permitted by law, {COMPANY.displayName} shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the service.
          </p>
          
          <h3 className="mt-8 mb-4 font-display text-xl font-bold text-brand-800">6. Contact Information</h3>
          <p>
            For any queries regarding these terms, please reach out to us at:
            <br />
            <strong>Email:</strong> <a href={`mailto:${COMPANY.email}`} className="text-gold-600 hover:underline">{COMPANY.email}</a>
          </p>
        </div>
      </div>
    </Page>
  );
}
