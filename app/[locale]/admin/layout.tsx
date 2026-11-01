import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Administration',
  description: 'Panneau de gestion de l\'annuaire',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}