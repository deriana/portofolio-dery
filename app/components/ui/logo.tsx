import { Link } from "react-router";

interface LogoProps {
  className?: string;
  imgClassName?: string;
  showText?: boolean;
}

export default function Logo({
  className = "",
  imgClassName = "h-8 w-auto",
  showText = true,
}: LogoProps) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 ${className}`}>
      <img src="/logo.jpeg" alt="Logo" className={imgClassName} />
      {showText && (
        <span className="text-xl font-bold text-indigo-600">KetangEdu</span>
      )}
    </Link>
  );
}
