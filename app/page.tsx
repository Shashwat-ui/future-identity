import ModuleSelector from '@/components/identity/ModuleSelector';
import QRProjection from '@/components/identity/QRProjection';

export default function Home() {
  return (
    <main className="h-screen flex flex-col items-center justify-center gap-8">
      <ModuleSelector />
      <QRProjection
        payload={{
          type: 'contact',
          data: { mobile: '+919999999999' },
        }}
      />
    </main>
  );
}