import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SideLine RO & Margin Tracker | BELIZE Micro-SaaS',
  description: 'AI-Powered Repair Order Camera OCR & Margin Tracker',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-[#070b14] text-slate-100 min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
