import DriverPageClient from './Client';

export default function DriverPage({ params }: any) {
  const { id } = params as { id: string };
  return <DriverPageClient id={id} />;
}
