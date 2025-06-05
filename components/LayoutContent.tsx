'use client';

import { usePathname } from 'next/navigation';
import { Footer } from "./footer";
import Navbar from "./navbar";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');
  const isAdmin = pathname?.startsWith('/admin');
  
  if (isDashboard || isAdmin) {
    return <>{children}</>;
  }

  // Evitar problemas de hidratación asegurando que el renderizado sea consistente
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow bg-white">
        {children}
      </main>
      <Footer />
    </div>
  );
}
