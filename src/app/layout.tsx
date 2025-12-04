import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chấm Công - Time Record',
  description: 'Hệ thống chấm công nhân viên',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#3b82f6',
  robots: {
    index: false, // Không index vì là app nội bộ
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        {/* Preconnect to Supabase for faster API calls */}
        <link rel="preconnect" href="https://supabase.co" />
        <link rel="dns-prefetch" href="https://supabase.co" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

