export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-100 via-white to-white" />

      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-brand-200 blur-3xl opacity-60" />
      <div className="pointer-events-none absolute -right-40 -bottom-40 h-[28rem] w-[28rem] rounded-full bg-accent-200 blur-3xl opacity-60" />

      <div className="relative container grid min-h-dvh items-center">
        {children}
      </div>
    </div>
  );
}
