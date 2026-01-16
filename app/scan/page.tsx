type ScanPageProps = {
  searchParams: { id?: string };
};

export default async function ScanPage({ searchParams }: ScanPageProps) {
  const id = searchParams.id;

  if (!id) {
    return <p className="p-6">Missing scan id</p>;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/qr/validate`,
    {
      method: 'POST',
      body: JSON.stringify({ id }),
      cache: 'no-store',
    }
  );

  if (!res.ok) return <p>Projection expired</p>;

  const data = await res.json();

  return (
    <pre className="p-6">
      {JSON.stringify(data.payload, null, 2)}
    </pre>
  );
}