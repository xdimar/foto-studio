import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portal Akses Produser & Klien',
  description: 'Masuk ke portal klien dan staf Origine Studio Malang.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
