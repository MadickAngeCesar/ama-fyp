import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

/**
 * Privacy Policy page for ASSS.
 * Outlines data collection, usage, and user rights.
 */
export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0B0F14] text-[#E6EAF2]">
      <header className="max-w-6xl sticky top-0 bg-[#0B0F14] z-50 mx-auto px-3 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="ASSS" width={40} height={40} className="rounded-full" />
          <div>
            <div className="text-lg font-semibold">ASSS</div>
            <div className="text-xs text-[#A9B1C7]">Student Support System</div>
          </div>
        </div>
        <Link href="/">
          <Button variant="outline" className="bg-gray-400 text-gray-950 cursor-pointer hover:bg-gray-950 hover:text-gray-400" size="sm">Back to Home</Button>
        </Link>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold mb-6">Privacy Policy</h1>
        <p className="text-[#A9B1C7] mb-8">Last updated: January 24, 2026</p>

        <div className="space-y-8 text-[#A9B1C7]">
          <section>
            <h2 className="text-xl font-medium text-white mb-4">1. Introduction</h2>
            <p>
              Welcome to the AI-powered Student Support System (ASSS). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">2. Information We Collect</h2>
            <h3 className="text-lg font-medium text-[#E6EAF2] mb-2">Personal Information</h3>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Name, email address, and Clerk ID (provided via Clerk authentication)</li>
              <li>Complaints, suggestions, and chat messages you submit</li>
              <li>Optional file attachments (images, PDFs) stored securely</li>
            </ul>
            <h3 className="text-lg font-medium text-[#E6EAF2] mb-2">Usage Data</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>IP address, browser type, and device information</li>
              <li>Pages visited, time spent, and interaction data</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To provide and maintain our services</li>
              <li>To process complaints, suggestions, and AI chatbot interactions</li>
              <li>To communicate updates and responses</li>
              <li>To ensure security and prevent abuse</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">4. Information Sharing and Disclosure</h2>
            <p className="mb-2">We do not sell or rent your personal information. We may share information in the following circumstances:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>With service providers (Clerk, Supabase, Gemini AI) for operational purposes</li>
              <li>To comply with legal requests or protect rights</li>
              <li>In connection with a business transfer</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction. This includes encryption in transit and at rest where supported by our providers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">6. Data Retention</h2>
            <p>
              We retain your information for as long as necessary to provide our services and comply with legal obligations. Complaints and suggestions are archived after 5 years by default. You can request deletion of your data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">7. Your Rights</h2>
            <p className="mb-2">Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate data</li>
              <li>Deletion of your data</li>
              <li>Data portability</li>
              <li>Opt-out of certain processing</li>
            </ul>
            <p>To exercise these rights, contact us at privacy@asss.app.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">8. Cookies</h2>
            <p>
              We use cookies to enhance your experience. You can control cookie settings through your browser. Essential cookies are required for the platform to function.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">9. Third-Party Services</h2>
            <p>
              Our platform integrates with Clerk (authentication), Supabase (database and storage), and Gemini AI (chatbot). These services have their own privacy policies, which we encourage you to review.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes via email or platform notification.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">11. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at privacy@asss.app or through our support channels.
            </p>
          </section>
        </div>
      </section>

<footer className="mt-16 border-t border-[#273046] bg-[#0B0F14]">
        <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 items-center justify-center gap-10 text-[#A9B1C7]">
          {/* Logo & tagline */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/images/logo.png" alt="ASSS" width={40} height={40} className="rounded-full" />
              <span className="text-lg font-semibold text-white">ASSS</span>
            </Link>
            <span className="text-xs mt-2">
              AI-powered Student Support System for universities
            </span>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#features" className="hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white">
                  Status
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white">
                  Developer
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2 mb-4">
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
            <h4 className="text-sm font-semibold text-white mb-3">Connect</h4>
            <div className="flex gap-4">
              <a
                href="mailto:info@asss.app"
                aria-label="Email"
                className="hover:text-white"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeWidth="1.5"
                    d="M3 7.5V17a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7.5m-18 0A2 2 0 0 1 5 5.5h14a2 2 0 0 1 2 2m-18 0 9 6.5 9-6.5"
                  />
                </svg>
              </a>
              {/* Facebook social link */}
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener"
                aria-label="Facebook"
                className="hover:text-white"
              >
                {/* Facebook SVG icon */}
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeWidth="1.5"
                    d="M17 2.5h-2.5A4.5 4.5 0 0 0 10 7v2H7.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5H10v8.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5V13h2.09a.5.5 0 0 0 .5-.44l.41-3a.5.5 0 0 0-.5-.56H14V7a1 1 0 0 1 1-1H17a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5Z"
                  />
                </svg>
              </a>
              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener"
                aria-label="LinkedIn"
                className="hover:text-white"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeWidth="1.5"
                    d="M16 8a6 6 0 0 1 6 6v5a1 1 0 0 1-1 1h-3v-5a2 2 0 0 0-4 0v5h-3a1 1 0 0 1-1-1v-5a6 6 0 0 1 6-6ZM2 9h4v12H2zM4 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col items-center justify-center gap-4 text-xs text-[#5A637A] border-t border-[#273046] mt-4">
          <div>© 2026 ASSS. All rights reserved.</div>
        </div>
      </footer>
    </main>
  )
}