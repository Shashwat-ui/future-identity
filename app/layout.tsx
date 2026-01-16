import "./styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white overflow-hidden">
        <div className="fixed inset-0 -z-10 bg-[url('/bg.jpg.jpg')] bg-cover bg-center opacity-40" />
        {children}
      </body>
    </html>
  );
}