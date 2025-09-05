'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TermsModalProps {
  children: React.ReactNode;
}

export function TermsModal({ children }: TermsModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Terms of Service</DialogTitle>
        </DialogHeader>
        
        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using PurelyBiome's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              PurelyBiome provides personalized skincare recommendations based on facial microbiome testing. Our service includes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Microbiome analysis and testing</li>
              <li>Personalized skincare recommendations</li>
              <li>Educational content about skin health</li>
              <li>Access to our digital platform and tools</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
            <p className="text-gray-700 mb-4">
              As a user of our service, you agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Provide accurate and complete information</li>
              <li>Use the service only for lawful purposes</li>
              <li>Not share your account credentials with others</li>
              <li>Follow all instructions provided for sample collection</li>
              <li>Respect the intellectual property rights of PurelyBiome</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Privacy and Data Protection</h2>
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Medical Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              The information provided by PurelyBiome is for educational and informational purposes only and is not intended as medical advice. Our recommendations are not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              PurelyBiome shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through our platform. Your continued use of the service after such modifications constitutes acceptance of the updated terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>PurelyBiome</strong><br />
                Email: contact@purelybiome.com<br />
                Website: https://purelybiome.com
              </p>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
