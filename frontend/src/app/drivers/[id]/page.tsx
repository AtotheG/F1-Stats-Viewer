import DriverPageClient from './Client';

export default function DriverPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return <DriverPageClient id={id} />;
}
