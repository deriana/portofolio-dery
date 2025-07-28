import type { PageTitleProps } from "@/types/props";

export function PageTitle({title}: PageTitleProps) {
  return (
    <h2 className="text-3xl font-bold mb-6 text-center">{title}</h2>
  );
}
