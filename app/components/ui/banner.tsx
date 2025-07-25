interface BannerProps{
    path: string
}

export function Banner({path}:BannerProps) {
  return (
    <img
      src={path}
      alt="Banner"
      className="w-full h-full object-cover rounded-2xl shadow-2xl"
    />
  );
}
