import { WebLayout } from "@/components/layouts/web-layout";
import { PageLayout } from "@/components/page-layout";
import { InteractiveTerminal } from "@/components/interactive-terminal";
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
    role: "Backend & Microservices Engineer",
    type: "Contract / Full-Time",
    duration: "1 Tahun (Upcoming)",
    period: "2026 – 2027",
    color: "from-violet-500/20 to-indigo-500/10",
    accent: "violet",
    statusBadge: "Upcoming",
    metrics: ["High-Throughput gRPC & REST", "Distributed Microservices", "Docker & K8s Cluster Deployments"],
    description:
      "Arsitektur layanan microservices berkecepatan tinggi dengan Go dan Java, mengimplementasikan gRPC Protocol Buffers untuk inter-service communication dan RESTful API publik. Mengintegrasikan Redis cluster untuk distributed caching serta kontrol konkurensi. Mengotomatisasi deployment kontainerisasi dengan Docker dan Kubernetes (K8s).",
    skills: ["Go", "Java", "React", "React Native", "Microservices", "Kubernetes", "Docker", "Redis", "gRPC", "REST API"],
  },
  {
    company: "Asqi",
    role: "Backend Developer Intern",
    type: "Internship",
    duration: "3 Bulan",
    period: "2026",
    color: "from-blue-500/15 to-cyan-500/10",
    accent: "blue",
    statusBadge: "Completed",
    metrics: ["Microservice Endpoints", "gRPC Protobuf Contracts", "Dockerized Dev Environments"],
    description:
      "Berkontribusi dalam pengembangan endpoint microservice backend menggunakan Go dan Java. Membantu perancangan kontrak schema gRPC Protobuf, optimasi query basis data, redis cache layer, serta standardisasi environment pengembangan lokal dengan Docker.",
    skills: ["Go", "Java", "Docker", "gRPC", "REST API", "Redis", "PostgreSQL", "Git"],
  },
  {
    company: "Mobilus Interactive",
    role: "Backend Developer (Laravel Full)",
    type: "PKL / Apprenticeship",
    duration: "6 Bulan",
    period: "2025",
    color: "from-emerald-500/15 to-teal-500/10",
    accent: "emerald",
    statusBadge: "Completed",
    metrics: ["Full Laravel Architecture", "Eloquent ORM Optimization", "RESTful API Integration"],
    description:
      "Mengembangkan arsitektur backend dan aplikasi web komprehensif fullstack berbasis Laravel. Merancang skema relasional database normalisasi 3NF, membangun REST API terproteksi middleware otentikasi, manajemen background queue worker, serta alur Git branching tim.",
    skills: ["Laravel", "PHP", "MySQL", "REST API", "Blade", "Database Design", "Linux", "Git"],
  },
];

const stats = [
  { label: "Experience", value: "2+ Years", icon: Briefcase },
  { label: "Core Focus", value: "Backend & DevOps", icon: Code2 },
  { label: "Shipped Apps", value: "10+ In Production", icon: FolderGit2 },
];

const specialties = [
  {
    icon: Server,
    label: "Backend & Concurrency",
    desc: "Java, Go, Node.js, and Laravel. Scalable microservices, RESTful & gRPC APIs, Redis caching, sub-100ms response times.",
  },
  {
    icon: Terminal,
    label: "DevOps & Cloud Orchestration",
    desc: "Linux power user, Docker containerization, Kubernetes (K8s) orchestration, server hardening, and CI/CD pipelines.",
  },
  {
    icon: Boxes,
    label: "Modern Frontend & Mobile",
    desc: "React, React Native, Next.js, and Vue. Responsive client-side applications, cross-platform mobile apps, and fullstack API integrations.",
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

          {/* ── INTERACTIVE SYSTEM TERMINAL ── */}
          <InteractiveTerminal />

          {/* ── EXPERIENCE TIMELINE ── */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                Work Experience
              </span>
              <div className="h-px flex-1 bg-border/60" />
              <span className="text-[10px] text-muted-foreground font-semibold">{experiences.length} Positions</span>
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
                            {exp.statusBadge === "Upcoming" && (
                              <span className="inline-flex items-center gap-1.5 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-xs">
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
                                </span>
                                Upcoming
                              </span>
                            )}
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
