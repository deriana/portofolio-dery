import { WebLayout } from "@/components/layouts/web-layout";
import { Card, CardContent } from "@/components/ui/card";
import {
  Code,
  Database,
  Cpu,
  Terminal,
  MonitorSmartphone,
  Server,
  Settings2,
  GitBranch,
  Network,
} from "lucide-react";

function SkillIcon({ icon: Icon }: { icon: React.ElementType }) {
  return <Icon className="w-7 h-7 text-primary" />;
}

const skills = [
  {
    icon: Code,
    label: "JavaScript",
    desc: "Frontend & Backend • JS, TS, React, Express, Hono, Elysia",
  },
  {
    icon: Database,
    label: "SQL / NoSQL",
    desc: "MySQL, PostgreSQL, MongoDB",
  },
  {
    icon: Cpu,
    label: "Laravel",
    desc: "REST API, MVC • PHP, Blade, Inertia",
  },
  {
    icon: Terminal,
    label: "CLI",
    desc: "Bash, Artisan, WSL, Linux",
  },
  {
    icon: MonitorSmartphone,
    label: "Responsive UI",
    desc: "TailwindCSS, Bootstrap, ShadCN UI",
  },
  {
    icon: Server,
    label: "DevOps",
    desc: "Docker, Nginx, CI/CD",
  },
  {
    icon: Settings2,
    label: "Problem Solving",
    desc: "Algorithms, Python, Logical thinking",
  },
  {
    icon: GitBranch,
    label: "Git & GitHub",
    desc: "Version control & collaboration",
  },
  {
    icon: Network,
    label: "API & Web",
    desc: "RESTful APIs, HTTP",
  },
];

const interests = ["Web3", "Machine Learning", "Design Systems", "Open Source"];
const softSkills = ["Communication", "Teamwork", "Adaptability", "Problem-Solving"];

export function Skills() {
  return (
    <WebLayout>
      <div className="container mx-auto px-4 py-12 space-y-16">
        <section>
          <h2 className="text-3xl font-bold mb-6 text-center">
            Technical Skills
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {skills.map((skill, i) => (
              <Card
                key={i}
                className="transition-transform hover:-translate-y-2 duration-300 shadow-md rounded-2xl hover-target"
              >
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <SkillIcon icon={skill.icon} />
                    <h3 className="text-lg font-semibold">{skill.label}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">{skill.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Other Things About Me</h2>

          <div className="flex flex-wrap justify-center gap-4 text-muted-foreground text-sm">
            {interests.map((item, index) => (
              <span
                key={index}
                className={index !== 0 ? "px-2 border-l border-muted" : "px-2"}
              >
                {index === 0 ? "Interested in: " : ""}
                {item}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-4 text-muted-foreground text-sm">
            {softSkills.map((item, index) => (
              <span
                key={index}
                className={index !== 0 ? "px-2 border-l border-muted" : "px-2"}
              >
                {index === 0 ? "Soft Skills: " : ""}
                {item}
              </span>
            ))}
          </div>
        </section>
      </div>
    </WebLayout>
  );
}
