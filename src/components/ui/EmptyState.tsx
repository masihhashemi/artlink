type EmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="panel relative overflow-hidden px-6 py-12 text-center">
      <div className="art-blob pink absolute -left-8 -top-8 h-28 w-28 opacity-60" />
      <div className="art-blob mint absolute -bottom-10 -right-6 h-32 w-32 opacity-50" />
      <div className="relative">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-[var(--sun)] text-2xl shadow-[3px_3px_0_var(--ink)]">
          ✦
        </div>
        <h3 className="font-[family-name:var(--font-display)] text-2xl font-extrabold mb-2">
          {title}
        </h3>
        <p className="text-[var(--muted)] max-w-md mx-auto mb-6">{description}</p>
        {action}
      </div>
    </div>
  );
}
