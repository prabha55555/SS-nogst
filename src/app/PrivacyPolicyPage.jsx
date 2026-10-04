import { Shield } from 'lucide-react';
import { Page } from '@/ui';
import { COMPANY } from '@/core/branding';

export default function PrivacyPolicyPage() {
  return (
    <Page title="Privacy Policy" icon={Shield} onBack={() => window.history.back()}>
      <div className="mx-auto max-w-3xl rounded-3xl border border-line bg-white p-6 shadow-card sm:p-10">
        <div className="prose prose-slate max-w-none">
          <p className="lead text-slate-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p>
            At <strong>{COMPANY.displayName}</strong>, we respect your privacy and are committed to protecting your personal data.
            This privacy policy will inform you as to how we look after your personal data when you visit our application and tell you about your privacy rights.
          </p>

          <h3 className="mt-8 mb-4 font-display text-xl font-bold text-brand-800">1. Information We Collect</h3>
          <p>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
            <li><strong>Transaction Data</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
          </ul>

          <h3 className="mt-8 mb-4 font-display text-xl font-bold text-brand-800">2. How We Use Your Data</h3>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal obligation.</li>
          </ul>

          <h3 className="mt-8 mb-4 font-display text-xl font-bold text-brand-800">3. Data Security</h3>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. 
            All data is processed locally and securely stored via our Firebase backend infrastructure.
          </p>

          <h3 className="mt-8 mb-4 font-display text-xl font-bold text-brand-800">4. Your Legal Rights</h3>
          <p>
            Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.
          </p>
          
          <h3 className="mt-8 mb-4 font-display text-xl font-bold text-brand-800">5. Contact Us</h3>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
            <br />
            <strong>Email:</strong> <a href={`mailto:${COMPANY.email}`} className="text-gold-600 hover:underline">{COMPANY.email}</a>
            <br />
            <strong>Phone:</strong> {COMPANY.cell}
          </p>
        </div>
      </div>
    </Page>
  );
}
