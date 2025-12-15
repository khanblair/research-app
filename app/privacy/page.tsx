import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Privacy Policy",
  description: "Learn how Khan Blair protects your privacy and handles your data.",
};

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-10 p-6 bg-muted/30 rounded-lg border border-border">
          <p className="text-muted-foreground leading-relaxed">
            At Khan Blair, we take your privacy seriously. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you visit our website or use our services. 
            Please read this privacy policy carefully. If you do not agree with the terms of this privacy 
            policy, please do not access the site.
          </p>
        </section>

        {/* Content Sections */}
        <div className="space-y-10">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-emerald-600 to-blue-600 rounded-full" />
              1. Information We Collect
            </h2>
            <div className="space-y-4 ml-3 pl-6 border-l-2 border-muted">
              <div>
                <h3 className="text-lg font-medium mb-2">Personal Data</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We may collect personally identifiable information, such as your name, email address, 
                  phone number, and other contact information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside mt-2 ml-4 space-y-1 text-muted-foreground">
                  <li>Fill out contact forms on our website</li>
                  <li>Subscribe to our newsletters or updates</li>
                  <li>Engage with our services or request information</li>
                  <li>Create an account on our platform</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Derivative Data</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our servers automatically collect information when you access our website, including your 
                  IP address, browser type, operating system, access times, and the pages you view directly 
                  before and after accessing the website.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Financial Data</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Financial information, such as data related to your payment method (e.g., valid credit card 
                  number, card brand, expiration date) that we may collect when you purchase, order, return, 
                  exchange, or request information about our services. We store only very limited, if any, 
                  financial information that we collect. Otherwise, all financial information is stored by our 
                  payment processor.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-emerald-600 to-blue-600 rounded-full" />
              2. How We Use Your Information
            </h2>
            <div className="ml-3 pl-6 border-l-2 border-muted">
              <p className="text-muted-foreground leading-relaxed mb-3">
                We use the information we collect or receive to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-1">•</span>
                  <span>Provide, operate, and maintain our website and services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-1">•</span>
                  <span>Improve, personalize, and expand our services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-1">•</span>
                  <span>Understand and analyze how you use our services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-1">•</span>
                  <span>Develop new products, services, features, and functionality</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-1">•</span>
                  <span>Communicate with you, either directly or through one of our partners</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-1">•</span>
                  <span>Send you updates, newsletters, and marketing communications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-1">•</span>
                  <span>Process your transactions and manage your orders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-1">•</span>
                  <span>Find and prevent fraud and respond to legal requests</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-emerald-600 to-blue-600 rounded-full" />
              3. Disclosure of Your Information
            </h2>
            <div className="ml-3 pl-6 border-l-2 border-muted">
              <p className="text-muted-foreground leading-relaxed mb-3">
                We may share information we have collected about you in certain situations. Your information 
                may be disclosed as follows:
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">By Law or to Protect Rights</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    If we believe the release of information about you is necessary to respond to legal process, 
                    to investigate or remedy potential violations of our policies, or to protect the rights, 
                    property, and safety of others, we may share your information as permitted or required by law.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Third-Party Service Providers</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We may share your information with third parties that perform services for us or on our behalf, 
                    including payment processing, data analysis, email delivery, hosting services, customer service, 
                    and marketing assistance.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Business Transfers</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We may share or transfer your information in connection with, or during negotiations of, any 
                    merger, sale of company assets, financing, or acquisition of all or a portion of our business 
                    to another company.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-emerald-600 to-blue-600 rounded-full" />
              4. Security of Your Information
            </h2>
            <div className="ml-3 pl-6 border-l-2 border-muted">
              <p className="text-muted-foreground leading-relaxed">
                We use administrative, technical, and physical security measures to help protect your personal 
                information. While we have taken reasonable steps to secure the personal information you provide 
                to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, 
                and no method of data transmission can be guaranteed against any interception or other type of misuse.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-emerald-600 to-blue-600 rounded-full" />
              5. Data Retention
            </h2>
            <div className="ml-3 pl-6 border-l-2 border-muted">
              <p className="text-muted-foreground leading-relaxed">
                We will retain your personal information only for as long as is necessary for the purposes set 
                out in this Privacy Policy. We will retain and use your information to the extent necessary to 
                comply with our legal obligations, resolve disputes, and enforce our policies.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-emerald-600 to-blue-600 rounded-full" />
              6. Your Privacy Rights
            </h2>
            <div className="ml-3 pl-6 border-l-2 border-muted">
              <p className="text-muted-foreground leading-relaxed mb-3">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-1">•</span>
                  <span>The right to access – You have the right to request copies of your personal data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-1">•</span>
                  <span>The right to rectification – You have the right to request correction of inaccurate information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-1">•</span>
                  <span>The right to erasure – You have the right to request deletion of your personal data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-1">•</span>
                  <span>The right to restrict processing – You have the right to request restriction of processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-1">•</span>
                  <span>The right to data portability – You have the right to request transfer of your data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-1">•</span>
                  <span>The right to object – You have the right to object to our processing of your data</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-emerald-600 to-blue-600 rounded-full" />
              7. Cookies and Tracking Technologies
            </h2>
            <div className="ml-3 pl-6 border-l-2 border-muted">
              <p className="text-muted-foreground leading-relaxed mb-3">
                We may use cookies and similar tracking technologies to track activity on our website and hold 
                certain information. Cookies are files with small amounts of data which may include an anonymous 
                unique identifier.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. 
                However, if you do not accept cookies, you may not be able to use some portions of our service.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-emerald-600 to-blue-600 rounded-full" />
              8. Changes to This Privacy Policy
            </h2>
            <div className="ml-3 pl-6 border-l-2 border-muted">
              <p className="text-muted-foreground leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the "Last updated" date. You are advised to 
                review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are 
                effective when they are posted on this page.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="p-6 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 rounded-lg border border-border">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have questions or comments about this Privacy Policy, please contact us at:
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
        </div>
      </main>
    </div>
  );
}
