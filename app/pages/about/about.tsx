import { AboutDesc } from "@/components/about-desc";
import { AboutImage } from "@/components/about-image";
import { WebLayout } from "@/components/layouts/web-layout";
import { PageLayout } from "@/components/page-layout";

export function About() {
  return (
    <WebLayout>
      <PageLayout>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-12 items-center">
            <AboutImage path="about-image.jpg" />
            <AboutDesc
              text="   I'm a passionate web developer who started my journey in high
              school. I love building web apps that solve real-world problems
              and are easy to use. My focus is on Laravel, React, and modern
              JavaScript frameworks. Lorem, ipsum dolor sit amet consectetur
              adipisicing elit. Voluptatem adipisci animi magnam quidem facere
              odio sed repudiandae similique eum et ipsa repellat dolorum, quas
              est a commodi molestiae sunt. Obcaecati. Lorem ipsum, dolor sit
              amet consectetur adipisicing elit. Quisquam doloremque harum qui
              adipisci illo odit voluptatum officiis dolore odio ducimus
              mollitia dolorum ex assumenda repudiandae, eum sequi. Aperiam,
              cupiditate. Molestias?"
            />
          </div>
      </PageLayout>
    </WebLayout>
  );
}
