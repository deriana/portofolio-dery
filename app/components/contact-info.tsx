import { useState } from "react";
import { Mail, MapPin, Github, Linkedin, Phone, Copy, Check, ExternalLink } from "lucide-react";

interface ContactItem {
  id: string;
  label: string;
  icon: typeof Mail;
  text: string;
  href?: string;
  copyable?: boolean;
}

const contactList: ContactItem[] = [
  {
    id: "email",
    label: "Email Resmi",
    icon: Mail,
    text: "deryana.maruf@gmail.com",
    href: "mailto:deryana.maruf@gmail.com",
    copyable: true,
  },
  {
    id: "phone",
    label: "WhatsApp / Direct Call",
    icon: Phone,
    text: "+62 895 8084 7470 30",
    href: "https://wa.me/628958084747030",
    copyable: true,
  },
  {
    id: "github",
    label: "GitHub Profile",
    icon: Github,
    text: "github.com/deriana",
    href: "https://github.com/deriana",
    copyable: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn Network",
    icon: Linkedin,
    text: "linkedin.com/in/Deryana",
    href: "https://www.linkedin.com/in/deryana-ma-ruf-00b926292/",
    copyable: false,
  },
  {
    id: "location",
    label: "Lokasi Kerja",
    icon: MapPin,
    text: "Bandung, Jawa Barat, Indonesia (GMT+7)",
    copyable: false,
  },
];

export function ContactInfo() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((curr) => (curr === id ? null : curr));
    }, 2000);
  };

  return (
    <div className="space-y-6 pt-6 md:pt-0">
      <div>
        <h3 className="text-xl font-bold tracking-tight text-foreground text-center md:text-left">
          Contact Information &amp; Direct Channels
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 text-center md:text-left">
          Hubungi saya langsung untuk penawaran proyek, diskusi arsitektur sistem, atau kolaborasi teknis.
        </p>
      </div>

      {/* Interactive Contact List with Quick Copy */}
      <div className="space-y-2.5">
        {contactList.map((item) => {
          const Icon = item.icon;
          const isCopied = copiedId === item.id;

          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-card/60 hover:bg-card hover:border-primary/40 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1 truncate"
                    >
                      <span className="truncate">{item.text}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </a>
                  ) : (
                    <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                      {item.text}
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Copy Button */}
              {item.copyable && (
                <button
                  type="button"
                  onClick={(e) => handleCopy(item.id, item.text, e)}
                  className={`ml-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                    isCopied
                      ? "bg-emerald-500 text-white shadow-xs scale-105"
                      : "bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60"
                  }`}
                  title={`Salin ${item.label}`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[10px] hidden sm:inline">Salin</span>
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
