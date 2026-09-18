import { WebLayout } from "@/components/layouts/web-layout";
import { PageLayout } from "@/components/page-layout";
import { Link } from "react-router";
import {
  Briefcase,
  Calendar,
  Code2,
  FolderGit2,
  Mail,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Server,
  Terminal,
  Cpu,
  Boxes,
} from "lucide-react";

const experiences = [
  {
    company: "Asqi",
    role: "Backend Developer",
    type: "Contract / Full-Time",
    duration: "1 Year",
    period: "2024 – 2025",
    color: "from-violet-500/20 to-indigo-500/10",
    accent: "violet",
    metrics: ["-45% API Latency", "Query Indexing & Schema Tuning", "Async Queue Worker Pipeline"],
    description:
      "Architected enterprise-grade RESTful backend services and streamlined relational database structures. Slashed average response latencies by 45% through aggressive query optimization and index tuning, while orchestrating high-volume background tasks with asynchronous queue workers.",
    skills: ["Laravel", "PHP", "MySQL", "Redis", "REST APIs", "Microservices", "Docker", "Git"],
  },
  {
    company: "Asqi",
    role: "Backend Developer",
    type: "Internship",
    duration: "3 Months",
    period: "2023 – 2024",
    color: "from-blue-500/15 to-cyan-500/10",
    accent: "blue",
    metrics: ["-30% Bug Defect Rate", "Postman Test Automation", "Clean Modular Architecture"],
    description:
      "Engineered core backend business logic and third-party API integrations. Developed comprehensive Postman endpoint verification suites that decreased production staging defect rates by 30% prior to release cycles.",
    skills: ["Laravel", "PHP", "MySQL", "Postman", "Git"],
  },
  {
    company: "Mobilus Interactive",
    role: "Backend Developer",
    type: "Apprenticeship",
    duration: "6 Months",
    period: "2023",
    color: "from-emerald-500/15 to-teal-500/10",
    accent: "emerald",
    metrics: ["3NF Normalized Schemas", "Secure CRUD Services", "Git Team Workflows"],
    description:
      "Designed normalized relational database schemas (3NF) and built resilient CRUD endpoints. Contributed to production web backends adhering to rigorous team Git branching and code review standards.",
    skills: ["PHP", "Database Design", "REST API", "Linux", "Git"],
  },
];

const stats = [
  { label: "Experience", value: "2+ Years", icon: Briefcase },
  { label: "Core Focus", value: "Backend & DevOps", icon: Code2 },
  { label: "Shipped Apps", value: "8+ In Production", icon: FolderGit2 },
];

const specialties = [
  {
    icon: Server,
    label: "Backend & Concurrency",
    desc: "Java, Go, Node.js, and Laravel. Scalable microservices, RESTful & gRPC APIs, clean architecture, sub-100ms response times.",
  },
  {
    icon: Terminal,
    label: "DevOps & Linux Cloud",
    desc: "Linux power user, Docker containerization, Kubernetes orchestration, server hardening, and automated CI/CD pipelines.",
  },
  {
    icon: Boxes,
    label: "Modern Frontend",
    desc: "React, Next.js, and Vue. Responsive client-side applications, SSR/SSG workflows, and seamless fullstack API integration.",
  },
  {
    icon: Cpu,
    label: "Data Science & AI/ML",
    desc: "Python for data analysis pipelines, custom LLM fine-tuning, automated workflow agents, and model inference services.",
  },
];

const principles = [
  {
    icon: Zap,
    title: "High Performance & Efficiency",
    desc: "Crafting lean, memory-conscious code engineered to withstand high concurrent loads with minimal latency.",
  },
  {
    icon: ShieldCheck,
    title: "System Integrity & Security",
    desc: "Enforcing ACID compliance, defensive error boundaries, strict input sanitization, and automated test coverage.",
  },
  {
    icon: Users,
    title: "Agile Collaboration & Continuous Learning",
    desc: "Thriving in fast-paced environments with structured Git flows, transparent documentation, and cloud-native practices.",
  },
];

export function About() {
  return (
    <WebLayout>
      <PageLayout title="About Me">
        <div className="max-w-4xl mx-auto w-full space-y-8">

          {/* ── HERO ── */}
          <section className="rounded-3xl border border-border/60 bg-card/70 backdrop-blur-md overflow-hidden shadow-lg">
            {/* Top accent strip */}
            <div className="h-1 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/40" />

            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
                {/* Photo */}
                <div className="shrink-0 mx-auto sm:mx-0">
                  <div className="relative">
                    <img
                      src="about-profile.webp"
                      alt="Deryana Maruf"
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-primary/30 shadow-xl"
                    />
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
                  </div>
                </div>

                {/* Bio Details */}
                <div className="flex-1 min-w-0 text-center sm:text-left space-y-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-1">
                      Backend Developer & DevOps Engineer
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                      Deryana Maruf
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
                      Linux Power User · Based in Bandung, Indonesia · Open to Global Remote Roles
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
                    I engineer reliable backend systems, high-throughput APIs, and cloud-native Linux environments.
                    My primary stack centers on <strong className="text-foreground font-semibold">Java, Go, Node.js, and Laravel</strong>,
                    paired with modern frontend delivery in <strong className="text-foreground font-semibold">React, Next.js, and Vue</strong>.
                    I leverage <strong className="text-foreground font-semibold">Python</strong> for data science & ML workflows,
                    and automate containerized infrastructure with <strong className="text-foreground font-semibold">Docker & Kubernetes</strong>.
                  </p>

                  <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start pt-1">
                    <Link
                      to="/portfolio"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow hover:opacity-90 hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      <span>Explore Portfolio</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border/80 bg-muted/40 text-foreground text-xs font-bold hover:bg-muted transition-colors cursor-pointer"
                    >
                      <Mail className="w-3 h-3 text-primary" />
                      <span>Get In Touch</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-border/40">
                {stats.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="text-center">
                      <Icon className="w-4 h-4 text-primary mx-auto mb-1 opacity-70" />
                      <p className="text-base sm:text-lg font-extrabold text-foreground leading-tight">{s.value}</p>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{s.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── CORE EXPERTISE ── */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                Core Expertise
              </span>
              <div className="h-px flex-1 bg-border/60" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {specialties.map((sp) => {
                const Icon = sp.icon;
                return (
                  <div
                    key={sp.label}
                    className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-4 hover:border-primary/40 hover:-translate-y-1 transition-all duration-200 shadow-sm group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-2.5 group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-xs font-bold text-foreground">{sp.label}</p>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">{sp.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── EXPERIENCE TIMELINE ── */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                Work Experience
              </span>
              <div className="h-px flex-1 bg-border/60" />
              <span className="text-[10px] text-muted-foreground font-semibold">3 Positions</span>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-5 top-5 bottom-5 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent hidden sm:block" />

              <div className="space-y-3.5">
                {experiences.map((exp, i) => (
                  <div
                    key={i}
                    className="relative sm:pl-14"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-3.5 top-5 w-3 h-3 rounded-full border-2 border-primary bg-background hidden sm:block" />

                    <div className={`rounded-2xl border border-border/60 bg-gradient-to-br ${exp.color} bg-card/80 backdrop-blur-sm p-5 hover:border-primary/40 transition-all duration-200 shadow-sm`}>
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2.5">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-extrabold text-foreground">{exp.role}</h3>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">
                              {exp.type}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-primary/80 mt-0.5">{exp.company}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold">
                          <Calendar className="w-3 h-3" />
                          <span>{exp.period}</span>
                          <span className="px-1.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground font-bold text-[9px]">{exp.duration}</span>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">{exp.description}</p>

                      {/* Measurable Technical Metrics */}
                      {exp.metrics && exp.metrics.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-border/25">
                          {exp.metrics.map((m) => (
                            <span
                              key={m}
                              className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25 shadow-xs"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2.5 border-t border-border/30">
                        {exp.skills.map((sk) => (
                          <span key={sk} className="text-[10px] px-2 py-0.5 rounded-full bg-background/60 border border-border/60 text-foreground/80 font-medium">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── PRINCIPLES ── */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                Engineering Principles
              </span>
              <div className="h-px flex-1 bg-border/60" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {principles.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.title}
                    className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-5 hover:border-primary/40 transition-all shadow-sm"
                  >
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <h4 className="text-sm font-bold text-foreground mb-1">{p.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </PageLayout>
    </WebLayout>
  );
}
