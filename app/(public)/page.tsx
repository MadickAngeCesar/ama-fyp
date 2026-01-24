import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Landing page for the public site.
 * Uses Tailwind utility classes and shadcn `Button` component.
 * Follows the project's dark-first design tokens from `Design_system.md`.
 *
 * @returns React element for the landing page
 */
export default function Page() {
  const features = [
    {
      title: "AI-assisted triage",
      desc: "Guided AI helps students create focused complaints and suggests form fields.",
      emoji: "🤖",
    },
    {
      title: "Real-time updates",
      desc: "Status changes and staff responses delivered instantly via realtime channels.",
      emoji: "⚡",
    },
    {
      title: "Secure attachments",
      desc: "Files are stored with signed URLs and fine-grained access control.",
      emoji: "🔒",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0B0F14] text-[#E6EAF2]">
      <header className="max-w-6xl sticky top-0 bg-[#0B0F14] z-50 mx-auto px-3 py-3 flex items-center justify-between">
        {/* Logo and site name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#4F7DFF] flex items-center justify-center text-white font-semibold">
            A
          </div>
          <div >
            <div className="text-lg font-semibold">ASSS</div>
            <div className="text-xs text-[#A9B1C7]">Student Support System</div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="hidden sm:flex items-center gap-6 text-sm text-[#A9B1C7]">
          <Link href="/">Home</Link>
          <Link href="#about">About</Link>
          <Link href="#features" className="hover:text-white">
            Features
          </Link>
          <Link href="#pricing" className="hover:text-white">
            Pricing
          </Link>
        </nav>

        {/* Sign in button */}
        <Link href="/signin">
          <Button
            variant="outline"
            className="bg-gray-400 text-gray-950 cursor-pointer hover:bg-gray-950 hover:text-gray-400"
            size="sm"
          >
            Sign in
          </Button>
        </Link>
      </header>

      {/* Hero section */}
      <section
        id="hero"
        className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12"
      >
        <div>
          <h1 className="text-4xl lg:text-5xl font-semibold leading-tight">
            Helpful, safe student support — fast.
          </h1>
          <p className="mt-4 text-[#A9B1C7] max-w-xl">
            Submit complaints, get guided AI assistance, and track responses
            with realtime updates and secure attachments.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <Link href="/signup">
              <Button size="lg">Get started — it&apos;s free</Button>
            </Link>
            <Link href="/demo">
              <Button variant="ghost" size="lg">
                Try demo chat
              </Button>
            </Link>
          </div>

          <div className="mt-8 bg-[#121823] border border-[#273046] p-4 rounded-md inline-flex items-center gap-4">
            <span className="text-sm text-[#A9B1C7]">
              Trusted by universities • Secure • Privacy-first
            </span>
          </div>
        </div>

        <div>
          <div className="w-full h-80 bg-[#1A2232] rounded-2xl border border-[#273046] p-6">
            <div className="flex flex-col gap-4 h-full">
              <div className="bg-[#121823] rounded-lg p-4 text-[#E6EAF2]">
                Student: My lecture room is leaking — who can I contact?
              </div>
              <div className="flex-1 bg-[#121823] rounded-lg p-4 text-[#E6EAF2]">
                AI: I can help. Shall I create a complaint with these details?
              </div>
              <div className="self-end">
                <Button size="sm">Escalate to complaint</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About section */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold mb-4">About ASSS</h2>
        <p className="text-[#A9B1C7] max-w-3xl mb-6">
          The{" "}
          <span className="font-semibold text-white">
            AI-powered Student Support System (ASSS)
          </span>{" "}
          is a modern web platform designed to help students resolve issues
          quickly, securely, and with confidence. ASSS enables students to
          submit complaints, suggestions, and inquiries, while staff and
          administrators manage and resolve them efficiently. The system
          leverages AI for guided triage, real-time updates, and a privacy-first
          approach.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#121823] border border-[#273046] rounded-lg p-6">
            <h3 className="font-medium text-lg mb-2">Our Mission</h3>
            <p className="text-[#A9B1C7] text-sm">
              Empower students and staff with a secure, accessible, and
              intelligent support system that streamlines communication and
              resolution of campus issues.
            </p>
          </div>
          <div className="bg-[#121823] border border-[#273046] rounded-lg p-6">
            <h3 className="font-medium text-lg mb-2">Key Features</h3>
            <ul className="list-disc pl-5 text-[#A9B1C7] text-sm space-y-1">
              <li>AI-assisted complaint triage and chatbot help</li>
              <li>Real-time status updates and notifications</li>
              <li>Secure file attachments and privacy controls</li>
              <li>Role-based dashboards for students, staff, and admins</li>
              <li>Accessible, responsive design (WCAG 2.1 AA)</li>
            </ul>
          </div>
          <div className="bg-[#121823] border border-[#273046] rounded-lg p-6">
            <h3 className="font-medium text-lg mb-2">Our Values</h3>
            <ul className="list-disc pl-5 text-[#A9B1C7] text-sm space-y-1">
              <li>Student privacy and data protection</li>
              <li>Transparency and accountability</li>
              <li>Continuous improvement and accessibility</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold">Core features</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((f) => (
            <article
              key={f.title}
              className="bg-[#121823] border border-[#273046] rounded-lg p-6"
            >
              <div className="text-2xl">{f.emoji}</div>
              <h3 className="mt-4 text-lg font-medium">{f.title}</h3>
              <p className="mt-2 text-[#A9B1C7] text-sm">{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Pricing section */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold mb-4">Pricing</h2>
        <p className="text-[#A9B1C7] max-w-2xl mb-8">
          ASSS is free for students and offers flexible plans for universities
          and organizations. All plans include privacy-first design, secure
          storage, and AI-powered support features.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="bg-[#121823] border border-[#273046] rounded-lg p-8 flex flex-col">
            <h3 className="text-lg font-semibold mb-2">Student Access</h3>
            <div className="text-3xl font-bold text-white mb-2">Free</div>
            <ul className="list-disc pl-5 text-[#A9B1C7] text-sm mb-6 space-y-1">
              <li>Submit complaints & suggestions</li>
              <li>AI chatbot & guided forms</li>
              <li>Track status & receive updates</li>
              <li>Secure file uploads</li>
              <li>Unlimited usage</li>
            </ul>
            <Link href="/signup">
              <Button size="lg" className="w-full">
                Get started
              </Button>
            </Link>
          </div>
          {/* University/Enterprise Plan */}
          <div className="bg-[#121823] border border-[#4F7DFF] rounded-lg p-8 flex flex-col">
            <h3 className="text-lg font-semibold mb-2">
              University & Enterprise
            </h3>
            <div className="text-3xl font-bold text-[#4F7DFF] mb-2">Custom</div>
            <ul className="list-disc pl-5 text-[#A9B1C7] text-sm mb-6 space-y-1">
              <li>Admin & staff dashboards</li>
              <li>Advanced analytics & reporting</li>
              <li>Custom integrations (SIS, SSO)</li>
              <li>Priority support & onboarding</li>
              <li>Dedicated data region</li>
            </ul>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="w-full border-[#4F7DFF] text-[#4F7DFF] hover:bg-[#4F7DFF] hover:text-white"
              >
                Contact sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="mt-16 border-t border-[#273046] bg-[#0B0F14]">
        <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 items-center justify-center gap-10 text-[#A9B1C7]">
          {/* Logo & tagline */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#4F7DFF] flex items-center justify-center text-white font-semibold text-xl">
                A
              </div>
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
  );
}
