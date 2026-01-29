import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

/**
 * Terms of Service page for ASSS.
 * Outlines user responsibilities, service usage, and legal terms.
 */
export default function TermsPage() {
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
        <h1 className="text-3xl font-semibold mb-6">Terms of Service</h1>
        <p className="text-[#A9B1C7] mb-8">Last updated: January 24, 2026</p>

        <div className="space-y-8 text-[#A9B1C7]">
          <section>
            <h2 className="text-xl font-medium text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the AI-powered Student Support System (ASSS), you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">2. Description of Service</h2>
            <p>
              ASSS provides a web-based platform for students to submit complaints and suggestions, interact with an AI chatbot, and track resolutions. Staff and administrators can manage issues via dedicated dashboards.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">3. User Responsibilities</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide accurate and truthful information</li>
              <li>Use the platform for lawful purposes only</li>
              <li>Respect the privacy and rights of others</li>
              <li>Do not upload harmful, offensive, or illegal content</li>
              <li>Maintain the confidentiality of your account credentials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">4. Account Registration</h2>
            <p>
              To access certain features, you must register via Clerk. You are responsible for all activities under your account. Notify us immediately of any unauthorized use.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">5. Intellectual Property</h2>
            <p>
              ASSS and its content are protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">6. AI and Content Generation</h2>
            <p>
              Our AI chatbot (powered by Gemini) provides assistance based on available data. Responses are not guaranteed to be accurate or complete. You are responsible for verifying information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">7. Privacy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which governs how we collect, use, and protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">8. Termination</h2>
            <p>
              We may terminate or suspend your account for violations of these terms. You may also terminate your account at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">9. Disclaimers</h2>
            <p>
              ASSS is provided &quot;as is&quot; without warranties of any kind. We do not guarantee uninterrupted service or the accuracy of AI responses. Use at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">10. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, ASSS shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">11. Governing Law</h2>
            <p>
              These terms are governed by the laws of [Your Jurisdiction]. Any disputes will be resolved in the courts of [Your Jurisdiction].
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">12. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">13. Contact Us</h2>
            <p>
              For questions about these Terms, contact us at legal@asss.app or through our support channels.
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