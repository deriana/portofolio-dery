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
  Database,
  GitBranch,
  Terminal,
} from "lucide-react";

const experiences = [
  {
    company: "Asqi",
    role: "Backend Developer",
    type: "Karyawan Magang",
    duration: "1 Tahun",
    period: "2024 – 2025",
    color: "from-violet-500/20 to-indigo-500/10",
    accent: "violet",
    metrics: ["Response Time -45%", "Indexing & Query Refactor", "Queue Worker Automation"],
    description:
      "Bertanggung jawab atas perancangan arsitektur RESTful API skala produksi dan integrasi database relasional. Berhasil memangkas waktu respons API rata-rata hingga 45% lewat optimasi query dan index tuning, serta mengotomasi background processing dengan asynchronous queue workers.",
    skills: ["Laravel", "PHP", "MySQL", "RESTful API", "Microservices", "Git"],
  },
  {
    company: "Asqi",
    role: "Backend Developer",
    type: "Magang",
    duration: "3 Bulan",
    period: "2023 – 2024",
    color: "from-blue-500/15 to-cyan-500/10",
    accent: "blue",
    metrics: ["Defect Rate -30%", "Postman API Suite", "Business Logic Isolation"],
    description:
      "Mengembangkan modul backend fitur baru, menangani logic bisnis kompleks, dan melakukan debugging berkala. Mengimplementasikan pengujian endpoint komprehensif dengan Postman yang menekan tingkat defect bug sebelum fase rilis.",
    skills: ["Laravel", "PHP", "MySQL", "Postman", "Git"],
  },
  {
    company: "Mobilus Interactive",
    role: "Backend Developer",
    type: "PKL",
    duration: "6 Bulan",
    period: "2023",
    color: "from-emerald-500/15 to-teal-500/10",
    accent: "emerald",
    metrics: ["Schema Normalization (3NF)", "CRUD Optimization", "Git Flow Standard"],
    description:
      "Praktik kerja lapangan dengan fokus pada rekayasa backend web, perancangan skema database relasional ternormalisasi, implementasi endpoint API yang aman, dan penerapan kolaborasi Git team.",
    skills: ["PHP", "Database Design", "REST API", "Git"],
  },
];

const stats = [
  { label: "Pengalaman", value: "1 Thn 9 Bln", icon: Briefcase },
  { label: "Spesialisasi", value: "Backend Dev", icon: Code2 },
  { label: "Proyek",       value: "8+ Produksi", icon: FolderGit2 },
];

const specialties = [
  { icon: Server,    label: "API Architecture",      desc: "REST, microservices, high-throughput systems" },
  { icon: Database,  label: "Database Engineering",   desc: "MySQL, PostgreSQL, query optimization, ACID" },
  { icon: Terminal,  label: "Laravel & Go",           desc: "Enterprise MVC, goroutines, Fiber engine" },
  { icon: GitBranch, label: "Git & Collaboration",    desc: "Branching strategy, code review, CI flow" },
];

const principles = [
  { icon: Zap,        title: "Kinerja & Efisiensi",     desc: "Kode bersih dengan waktu respon minimal dan memori optimal." },
  { icon: ShieldCheck, title: "Integritas & Keamanan",  desc: "Validasi ketat, transaksi ACID, dan proteksi menyeluruh." },
  { icon: Users,      title: "Kolaborasi & Adaptasi",   desc: "Git workflow aktif, komunikasi lintas tim, dan growth mindset." },
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

                {/* Text */}
                <div className="flex-1 min-w-0 text-center sm:text-left space-y-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80 mb-1">
                      Backend Developer
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                      Deryana Maruf
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium mt-0.5">
                      Software Engineer · Bandung, Indonesia
                    </p>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                    Backend developer dengan pengalaman nyata membangun sistem enterprise —
                    mulai dari platform ekspor UMKM teh, HRIS biometrik Face ID, sistem rumah sakit
                    SIMRS, hingga logistik perkebunan. Spesialis Laravel, Go, dan arsitektur database
                    yang handal.
                  </p>

                  <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start pt-1">
                    <Link
                      to="/portfolio"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow hover:opacity-90 hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      <span>Lihat Portofolio</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border/80 bg-muted/40 text-foreground text-xs font-bold hover:bg-muted transition-colors cursor-pointer"
                    >
                      <Mail className="w-3 h-3 text-primary" />
                      <span>Hubungi Saya</span>
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
                      <p className="text-[10px] text-muted-foreground font-medium">{s.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── SPECIALTIES GRID ── */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                Core Expertise
              </span>
              <div className="h-px flex-1 bg-border/60" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {specialties.map((sp) => {
                const Icon = sp.icon;
                return (
                  <div
                    key={sp.label}
                    className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-4 hover:border-primary/40 hover:-translate-y-1 transition-all duration-200 shadow-sm group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-2.5 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-xs font-bold text-foreground">{sp.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{sp.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── EXPERIENCE TIMELINE ── */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                Pengalaman Kerja
              </span>
              <div className="h-px flex-1 bg-border/60" />
              <span className="text-[10px] text-muted-foreground font-semibold">3 Riwayat</span>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-5 top-5 bottom-5 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent hidden sm:block" />

              <div className="space-y-3">
                {experiences.map((exp, i) => (
                  <div
                    key={i}
                    className="relative sm:pl-14"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-3.5 top-5 w-3 h-3 rounded-full border-2 border-primary bg-background hidden sm:block" />

                    <div className={`rounded-2xl border border-border/60 bg-gradient-to-br ${exp.color} bg-card/80 backdrop-blur-sm p-5 hover:border-primary/40 transition-all duration-200 shadow-sm`}>
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
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

                      {exp.metrics && exp.metrics.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-border/25">
                          {exp.metrics.map((m) => (
                            <span
                              key={m}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25 shadow-xs"
                            >
                              ⚡ {m}
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
