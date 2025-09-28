import Header from "@/components/header/Header";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />

      <div className="container grid grid-cols-1 gap-6 py-6 lg:grid-cols-[260px_1fr]">
        <main id="conteudo-principal" className="min-w-0">
          {children}
        </main>
      </div>
    </>
  );
}
