import React from "react";
import Link from "next/link";

export default function ActivationPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Welcome to Your Microbiome Journey!</h1>
        <p className="text-gray-600 mb-6">Ready to discover your gut health insights? Let's activate your kit.</p>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-1">Activate Your Kit</h2>
          <p className="text-gray-600 mb-4">Enter your kit serial number and share your skin background to get deeper insights into your microbiome results.</p>
          <Link href="/survey">
            <button className="bg-blue-400 text-white font-medium px-5 py-2 rounded-full hover:bg-blue-500 transition">Start Activation</button>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-1">Sample Collection Guide</h2>
          <p className="text-gray-600 mb-4">Follow our step-by-step guide to collect your sample for accurate microbiome analysis.</p>
          <Link href="/instructions">
            <button className="bg-blue-400 text-white font-medium px-5 py-2 rounded-full hover:bg-blue-500 transition">View Guide</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
