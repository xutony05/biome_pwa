'use client';

import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { TermsModal } from "./terms-modal";
import { PrivacyModal } from "./privacy-modal";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Social Media Icons */}
          <div className="flex items-center gap-4">
            <Link 
              href="https://www.facebook.com/profile.php?id=61580186437838" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="h-5 w-5" />
            </Link>
            <Link 
              href="https://www.instagram.com/purelybiome/" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link 
              href="https://www.linkedin.com/company/purelybiome" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-6">
            <TermsModal>
              <button className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Terms of Service
              </button>
            </TermsModal>
            <PrivacyModal>
              <button className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Privacy Policy
              </button>
            </PrivacyModal>
          </div>
        </div>
      </div>
    </footer>
  );
}
