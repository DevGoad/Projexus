import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/lib/query-provider';
import { AuthProvider } from '@/lib/auth-context';
import Header from '@/components/Header';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PROJEXUS // Student Industry Showcase',
  description:
    'Where engineering work gets seen before the interview. Production-ready student projects across robotics, civil, AI, and energy engineering.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-[#060d1a] text-slate-100 antialiased flex flex-col font-sans">
        <QueryProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <footer className="border-t border-[#152943] bg-[#070e1c] py-6 text-center text-xs font-mono text-slate-500">
              <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
                <span>PROJEXUS // ENGINEERING SHOWCASE SYSTEM v2.0</span>
                <span>PRODUCTION-READY EVALUATION STANDARD · THRESHOLD &ge; 75%</span>
              </div>
            </footer>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
