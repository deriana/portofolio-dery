import { Mail, MapPin, Github, Linkedin, Phone } from "lucide-react";

const contactItems = [
  {
    icon: Mail,
    text: "deryana.maruf@gmail.com",
    isLink: false,
  },
  {
    icon: MapPin,
    text: "Jawa Barat, Indonesia",
    isLink: false,
  },
  {
    icon: Github,
    text: "github.com/deriana",
    href: "https://github.com/deriana",
    isLink: true,
  },
  {
    icon: Linkedin,
    text: "linkedin.com/in/Deryana",
    href: "https://www.linkedin.com/in/deryana-ma-ruf-00b926292/",
    isLink: true,
  },
  {
    icon: Phone,
    text: "+62 8958084747030",
    isLink: false,
  },
];

export function ContactInfo() {
  return (
    <div className="space-y-6 pt-6 md:pt-0">
      <h3 className="text-xl font-semibold text-center md:text-left">
        Contact Information
      </h3>
      <div className="space-y-4 text-sm text-muted-foreground">
        {contactItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <item.icon className="w-5 h-5 text-primary" />
            {item.isLink ? (
              <a
                href={item.href}
                className="hover:underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.text}
              </a>
            ) : (
              <span>{item.text}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
