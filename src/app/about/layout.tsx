import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tentang Kami & Tim Kreatif',
  description:
    'Filosofi, nilai estetika, dan tim fotografer profesional di balik Origine Studio Malang. Menghadirkan standar visual internasional ke panorama alam Poncokusumo.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'Tentang Kami & Tim Kreatif | Origine Studio Malang',
    description:
      'Studio fotografi eksklusif yang memadukan keindahan lanskap Malang dengan presisi tata cahaya editorial internasional.',
    url: 'https://www.origine-studio.my.id/about',
    images: [
      {
        url: '/images/portrait-art.jpg',
        width: 1200,
        height: 800,
        alt: 'Tim Kreatif & Filosofi Origine Studio Malang',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tentang Kami & Tim Kreatif | Origine Studio Malang',
    description: 'Filosofi dan dedikasi seni visual Origine Studio di Poncokusumo, Malang.',
    images: ['/images/portrait-art.jpg'],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
