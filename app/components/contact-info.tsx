import { Mail, MapPin, Github, Linkedin } from "lucide-react";

export function ContactInfo() {
  return (
    <div className="space-y-6 pt-6 md:pt-0">
      <h3 className="text-xl font-semibold text-center md:text-left">
        Contact Information
      </h3>
      <div className="space-y-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-primary" />
          <span>deryana.maruf@gmail.com</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-primary" />
          <span>Jawa Barat, Indonesia</span>
        </div>
        <div className="flex items-center gap-3">
          <Github className="w-5 h-5 text-primary" />
          <a
            href="https://github.com/deriana"
            className="hover:underline underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/deriana
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Linkedin className="w-5 h-5 text-primary" />
          <a
            href="https://www.linkedin.com/in/deryana-ma-ruf-00b926292/"
            className="hover:underline underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            linkedin.com/in/Deryana
          </a>
        </div>
      </div>
    </div>
  );
}
