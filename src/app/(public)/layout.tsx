import Header from "@/components/header/Header";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />

      <div className="container py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <main id="conteudo-principal" className="min-w-0 lg:col-span-2">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
