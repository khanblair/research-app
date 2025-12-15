import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Terms of Service",
  description: "Read the terms and conditions for using Khan Blair's services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-muted/30 sticky top-0 z-10 backdrop-blur-sm">
        <div className="container mx-auto max-w-5xl px-4 md:px-6 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-5xl px-4 md:px-6 py-12 md:py-16">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-10 p-6 bg-muted/30 rounded-lg border border-border">
          <p className="text-muted-foreground leading-relaxed">
            Welcome to Khan Blair's services. These Terms of Service ("Terms") govern your access to and use of 
            our website, services, and applications. By accessing or using our services, you agree to be bound 
            by these Terms. If you disagree with any part of these terms, please do not use our services.
          </p>
        </section>

        {/* Content Sections */}
        <div className="space-y-10">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-emerald-600 to-blue-600 rounded-full" />
              1. Acceptance of Terms
            </h2>
            <div className="ml-3 pl-6 border-l-2 border-muted">
              <p className="text-muted-foreground leading-relaxed mb-3">
                By accessing and using our services, you accept and agree to be bound by these Terms and our 
                Privacy Policy. These Terms apply to all visitors, users, and others who access or use our services.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to update or modify these Terms at any time without prior notice. Your 
                continued use of our services following any changes constitutes acceptance of those changes.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-emerald-600 to-blue-600 rounded-full" />
              2. Use of Services
            </h2>
            <div className="space-y-4 ml-3 pl-6 border-l-2 border-muted">
              <div>
                <h3 className="text-lg font-medium mb-2">Eligibility</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You must be at least 18 years old to use our services. By using our services, you represent 
                  and warrant that you are of legal age to form a binding contract and meet all of the foregoing 
                  eligibility requirements.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Account Registration</h3>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  To access certain features of our services, you may be required to create an account. When 
                  creating an account, you agree to:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-muted-foreground">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your password</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized access</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Acceptable Use</h3>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  You agree not to use our services to:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">•</span>
                    <span>Violate any applicable laws or regulations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">•</span>
                    <span>Infringe upon or violate intellectual property rights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">•</span>
                    <span>Transmit harmful, offensive, or objectionable content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">•</span>
                    <span>Engage in fraudulent or deceptive practices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">•</span>
                    <span>Interfere with or disrupt our services or servers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">•</span>
                    <span>Attempt to gain unauthorized access to any portion of our services</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-emerald-600 to-blue-600 rounded-full" />
              3. Intellectual Property Rights
            </h2>
            <div className="space-y-4 ml-3 pl-6 border-l-2 border-muted">
              <div>
                <h3 className="text-lg font-medium mb-2">Our Property</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The services and their original content, features, and functionality are and will remain the 
                  exclusive property of Khan Blair. Our services are protected by copyright, trademark, and other 
                  laws of both Uganda and foreign countries. Our trademarks and trade dress may not be used in 
                  connection with any product or service without our prior written consent.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Your Content</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You retain all rights to any content you submit, post, or display on or through our services. 
                  By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, 
                  copy, modify, and display such content for the purpose of operating and providing our services.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Feedback</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Any feedback, comments, or suggestions you provide regarding our services is entirely voluntary. 
                  We will be free to use such feedback, comments, or suggestions as we see fit without any obligation 
                  to you.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-emerald-600 to-blue-600 rounded-full" />
              4. Services and Availability
            </h2>
            <div className="ml-3 pl-6 border-l-2 border-muted">
              <p className="text-muted-foreground leading-relaxed mb-3">
                We reserve the right to withdraw or amend our services, and any service or material we provide, 
                in our sole discretion without notice. We will not be liable if for any reason all or any part 
                of our services is unavailable at any time or for any period.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From time to time, we may restrict access to some parts of our services, or the entire services, 
                to users, including registered users. We may also impose limits on certain features and services 
                or restrict your access to parts or all of the services without notice or liability.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-emerald-600 to-blue-600 rounded-full" />
              5. Payment and Billing
            </h2>
            <div className="space-y-4 ml-3 pl-6 border-l-2 border-muted">
              <div>
                <h3 className="text-lg font-medium mb-2">Fees</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Some of our services may require payment of fees. You agree to pay all applicable fees as 
                  described on our website at the time of purchase. All fees are non-refundable unless otherwise 
                  stated or required by law.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Pricing Changes</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to change our prices at any time. If we change prices for services you 
                  have already purchased, we will notify you in advance and the new prices will apply to future 
                  billing periods.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Payment Methods</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We accept various payment methods as indicated on our website. By providing payment information, 
                  you represent and warrant that you are authorized to use the designated payment method and 
                  authorize us to charge your payment method.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-emerald-600 to-blue-600 rounded-full" />
              6. Disclaimers and Limitation of Liability
            </h2>
            <div className="space-y-4 ml-3 pl-6 border-l-2 border-muted">
              <div>
                <h3 className="text-lg font-medium mb-2">Disclaimer of Warranties</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our services are provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, 
                  expressed or implied, and hereby disclaim and negate all other warranties including, without 
                  limitation, implied warranties or conditions of merchantability, fitness for a particular 
                  purpose, or non-infringement of intellectual property.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Limitation of Liability</h3>
                <p className="text-muted-foreground leading-relaxed">
                  In no event shall Khan Blair, nor its directors, employees, partners, agents, suppliers, or 
                  affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, 
                  including without limitation, loss of profits, data, use, goodwill, or other intangible losses, 
                  resulting from your access to or use of or inability to access or use our services.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-emerald-600 to-blue-600 rounded-full" />
              7. Indemnification
            </h2>
            <div className="ml-3 pl-6 border-l-2 border-muted">
              <p className="text-muted-foreground leading-relaxed">
                You agree to defend, indemnify, and hold harmless Khan Blair and its licensee and licensors, and 
                their employees, contractors, agents, officers, and directors, from and against any and all claims, 
                damages, obligations, losses, liabilities, costs or debt, and expenses arising from: (i) your use 
                of and access to our services; (ii) your violation of any term of these Terms; (iii) your violation 
                of any third party right, including without limitation any copyright, property, or privacy right; 
                or (iv) any claim that your content caused damage to a third party.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-emerald-600 to-blue-600 rounded-full" />
              8. Termination
            </h2>
            <div className="ml-3 pl-6 border-l-2 border-muted">
              <p className="text-muted-foreground leading-relaxed mb-3">
                We may terminate or suspend your account and bar access to our services immediately, without prior 
                notice or liability, under our sole discretion, for any reason whatsoever and without limitation, 
                including but not limited to a breach of these Terms.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                If you wish to terminate your account, you may simply discontinue using our services or contact 
                us to request account deletion. All provisions of these Terms which by their nature should survive 
                termination shall survive termination, including, without limitation, ownership provisions, warranty 
                disclaimers, indemnity, and limitations of liability.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-emerald-600 to-blue-600 rounded-full" />
              9. Governing Law
            </h2>
            <div className="ml-3 pl-6 border-l-2 border-muted">
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws of Uganda, without regard 
                to its conflict of law provisions. Our failure to enforce any right or provision of these Terms 
                will not be considered a waiver of those rights. If any provision of these Terms is held to be 
                invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-emerald-600 to-blue-600 rounded-full" />
              10. Dispute Resolution
            </h2>
            <div className="ml-3 pl-6 border-l-2 border-muted">
              <p className="text-muted-foreground leading-relaxed mb-3">
                If you have any concern or dispute about our services, you agree to first try to resolve the 
                dispute informally by contacting us. We will attempt to resolve the dispute through good faith 
                negotiations.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                If we cannot resolve the dispute through informal negotiations, any legal action or proceeding 
                arising under these Terms will be brought exclusively in the courts located in Uganda, and the 
                parties irrevocably consent to the personal jurisdiction and venue there.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-emerald-600 to-blue-600 rounded-full" />
              11. Changes to Terms
            </h2>
            <div className="ml-3 pl-6 border-l-2 border-muted">
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a 
                revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. 
                What constitutes a material change will be determined at our sole discretion. By continuing to 
                access or use our services after any revisions become effective, you agree to be bound by the 
                revised terms.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-emerald-600 to-blue-600 rounded-full" />
              12. Entire Agreement
            </h2>
            <div className="ml-3 pl-6 border-l-2 border-muted">
              <p className="text-muted-foreground leading-relaxed">
                These Terms, together with our Privacy Policy and any other legal notices published by us on our 
                services, shall constitute the entire agreement between you and Khan Blair concerning our services. 
                If any provision of these Terms is deemed invalid by a court of competent jurisdiction, the 
                invalidity of such provision shall not affect the validity of the remaining provisions of these 
                Terms, which shall remain in full force and effect.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="p-6 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 rounded-lg border border-border">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="font-medium">Email:</span>
                <a href="mailto:blairKhan26@gmail.com" className="text-emerald-600 hover:underline">
                  blairKhan26@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium">Phone:</span>
                <span>+256 742 736 501</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-medium">Address:</span>
                <span>Fort Portal City, Uganda</span>
              </p>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="p-6 bg-muted/30 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-3">Acknowledgment</h3>
            <p className="text-muted-foreground leading-relaxed">
              By using our services, you acknowledge that you have read these Terms of Service and agree to be 
              bound by them. If you do not agree to these Terms, you must not use our services.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
