import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ruang Studio & Fasilitas Cyclorama',
  description:
    'Tiga suite studio eksklusif: Cyclorama Utama 180m², Loft Cahaya Alami, dan Ruang Noir Chiaroscuro di Poncokusumo, Malang. Daya industri 3-fase & plafon tinggi 6,2 meter.',
  alternates: {
    canonical: '/spaces',
  },
  openGraph: {
    title: 'Ruang Studio & Fasilitas Cyclorama | Origine Studio Malang',
    description:
      'Sewa studio foto dengan fasilitas cyclorama lengkung 12m, generator Broncolor, dan privasi penuh di Malang.',
    url: 'https://www.origine-studio.my.id/spaces',
    images: [
      {
        url: '/images/studio-space.jpg',
        width: 1200,
        height: 630,
        alt: 'Fasilitas Cyclorama Utama — Origine Studio Malang',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ruang Studio & Fasilitas Cyclorama | Origine Studio Malang',
    description:
      'Sewa studio foto dengan fasilitas cyclorama lengkung 12m dan pencahayaan Broncolor di Malang.',
    images: ['/images/studio-space.jpg'],
  },
};

export default function SpacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
