import { WebLayout } from "@/components/layouts/web-layout";
import { SocialLinks } from "@/components/ui/social-icon";

export function About() {
  return (
    <WebLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-12 items-center">
          {/* Gambar */}
          <div className="flex justify-center">
            <img
              src="test.jpeg"
              alt="My Photo"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md h-auto object-cover rounded-2xl shadow-xl border border-muted"
            />
          </div>

          {/* Konten Teks */}
          <div className="flex flex-col gap-4 items-start px-2 sm:px-4">
            <h2 className="text-3xl font-bold">About Me</h2>
            <p className="text-muted-foreground text-justify max-w-prose">
              I'm a passionate web developer who started my journey in high
              school. I love building web apps that solve real-world problems
              and are easy to use. My focus is on Laravel, React, and modern
              JavaScript frameworks. Lorem, ipsum dolor sit amet consectetur
              adipisicing elit. Voluptatem adipisci animi magnam quidem facere
              odio sed repudiandae similique eum et ipsa repellat dolorum, quas
              est a commodi molestiae sunt. Obcaecati. Lorem ipsum, dolor sit
              amet consectetur adipisicing elit. Quisquam doloremque harum qui
              adipisci illo odit voluptatum officiis dolore odio ducimus
              mollitia dolorum ex assumenda repudiandae, eum sequi. Aperiam,
              cupiditate. Molestias?
            </p>
            <div className="mt-4">
              <SocialLinks direction="row" iconSize={32} />
            </div>
          </div>
        </div>
      </div>
    </WebLayout>
  );
}