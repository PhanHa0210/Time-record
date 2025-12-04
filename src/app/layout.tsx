import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chấm Công - Time Record',
  description: 'Hệ thống chấm công nhân viên',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}

