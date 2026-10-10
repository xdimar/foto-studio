import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Galeri Portofolio & Karya Terpilih',
  description:
    'Eksplorasi arsip kurasi editorial fashion haute couture, potret chiaroscuro seni rupa, prewedding Bromo, dan kampanye komersial di Origine Studio Malang.',
  alternates: {
    canonical: '/portfolio',
  },
  openGraph: {
    title: 'Galeri Portofolio & Karya Terpilih | Origine Studio Malang',
    description:
      'Arsip visual terkurasi editorial mode, potret wisuda eksklusif, dan karya komersial di kawasan Belung, Poncokusumo, Malang.',
    url: 'https://www.origine-studio.my.id/portfolio',
    images: [
      {
        url: '/images/hero-fashion.jpg',
        width: 1200,
        height: 800,
        alt: 'Editorial Fashion Portfolio — Origine Studio Malang',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Galeri Portofolio & Karya Terpilih | Origine Studio Malang',
    description: 'Arsip visual terkurasi editorial mode, potret wisuda, dan prewedding di Origine Studio.',
    images: ['/images/hero-fashion.jpg'],
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
