export default function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-gold/20 pb-4 sm:flex-row sm:items-center">
      <div>
        <span className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-gold-600">
          {eyebrow}
        </span>
        <h1 className="font-serif text-2xl font-bold text-maroon sm:text-3xl">{title}</h1>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}