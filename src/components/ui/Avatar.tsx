type AvatarProps = {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
};

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-16 w-16 text-xl",
  xl: "h-28 w-28 text-3xl",
};

export function Avatar({ name, src, size = "md" }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover border border-[var(--line)]`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} rounded-full border border-[var(--line)] bg-[var(--accent-soft)] text-[var(--accent-deep)] flex items-center justify-center font-semibold`}
      aria-label={name}
    >
      {initials || "A"}
    </div>
  );
}
