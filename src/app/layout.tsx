import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chấm Công - Time Record',
  description: 'Hệ thống chấm công nhân viên',
  robots: {
    index: false, // Không index vì là app nội bộ
    follow: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#3b82f6',
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
        {/* Preconnect đến domain Supabase project cụ thể nếu có */}
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <link 
            rel="preconnect" 
            href={new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin} 
            crossOrigin="anonymous" 
          />
        )}
        {/* Preconnect to common Supabase domains */}
        <link rel="preconnect" href="https://supabase.co" />
        <link rel="dns-prefetch" href="https://supabase.co" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

