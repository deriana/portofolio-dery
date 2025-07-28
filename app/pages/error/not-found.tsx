import { ArrowLeft, Fingerprint } from "lucide-react";
import { Link } from "react-router";

export function NotFound() {
  return (
    <div className="relative min-h-screen text-white flex items-center justify-center px-4 overflow-hidden">
      {/* Half glowing circle background */}
      <div className="absolute bottom-[-200px] w-[600px] h-[300px] bg-white rounded-full blur-3xl opacity-10" />

      <div className="relative z-10 max-w-xl text-center flex flex-col items-center gap-4">
        <h1 className="text-[100px] sm:text-[160px] font-extrabold leading-none tracking-tight">
          404
        </h1>
        <p className="text-gray-400 text-lg sm:text-xl">
          It seems you got a little bit lost
        </p>
        <Link
          to="/"
          className="flex flex-row items-center hover-target gap-2 text-base text-gray-400 hover:text-white transition"
        >
          <Fingerprint className="w-8 h-8" />
          Go back to homepage
        </Link>
      </div>
    </div>
  );
}
