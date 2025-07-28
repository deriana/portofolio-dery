import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center md:text-left">
        <h2 className="text-2xl font-bold">Let’s Collaborate</h2>
        <p className="text-muted-foreground text-sm">
          Feel free to reach out for collaborations, questions, or just to say hi 👋
        </p>
      </div>

      <div className="space-y-4">
        <Input placeholder="Your Name" />
        <Input type="email" placeholder="Your Email" />
        <Textarea
          placeholder="Your Message"
          className="min-h-[120px]"
        />
        <Button className="w-full">Send Message</Button>
      </div>
    </div>
  );
}
