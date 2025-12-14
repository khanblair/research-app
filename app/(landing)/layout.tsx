import { Header } from "@/components/layout/landing/Header";
import { Footer } from "@/components/layout/landing/Footer";
import { ScrollToTopButton } from "@/components/shared/ScrollToTopButton";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <ScrollToTopButton />
      <Footer />
    </div>
  );
}
