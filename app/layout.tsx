import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'India360 — Policy Intelligence & World Rankings',
  description:
    'Comprehensive 360° analytics platform tracking 60+ global index rankings, sub-national state SDG performance, multi-country comparisons, trend projections, and AI-driven policy intelligence for India.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
