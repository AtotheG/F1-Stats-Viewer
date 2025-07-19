import DriverPageClient from './Client';

export default async function DriverPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DriverPageClient id={id} />;
}
