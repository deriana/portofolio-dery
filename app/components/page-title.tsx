interface PageTitle {
    title: string
}

export function PageTitle({title}: PageTitle) {
  return (
    <h2 className="text-3xl font-bold mb-6 text-center">{title}</h2>
  );
}
