import { useState, useMemo } from "react";
import { WebLayout } from "@/components/layouts/web-layout";
import { PageLayout } from "@/components/page-layout";
import { SkillIcon } from "@/components/skill-icon";
import data from "@/data/skills.json";
import type { SkillsJson, ArchitectureStudy } from "@/types/props";
import { Zap } from "lucide-react";

export function Skills() {
  const skillsData = data as SkillsJson;
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "Semua Tech" },
    { id: "backend", label: "Backend" },
    { id: "frontend", label: "Frontend" },
    { id: "database", label: "Database" },
    { id: "devops", label: "DevOps & Cloud" },
    { id: "ai", label: "AI & Tools" },
  ];

  // Core daily drivers highlighted
  const coreStacks = [
    {
      name: "Laravel",
      version: "v11",
      role: "Enterprise Backend",
      icon: "/tech_stack_icons/laravel.svg",
      highlight: "REST API, Eloquent ORM, Queue Workers, MVC Architecture",
    },
    {
      name: "Golang",
      version: "v1.23",
      role: "High Concurrency",
      icon: "/tech_stack_icons/golang.svg",
      highlight: "Goroutines, Fiber Engine, Low Memory, High Throughput",
    },
    {
      name: "PHP",
      version: "v8.3",
      role: "Core Web Engine",
      icon: "/tech_stack_icons/php.svg",
      highlight: "Object-Oriented, Native Core, Enterprise Reliability",
    },
    {
      name: "React.js",
      version: "v19",
      role: "Modern Frontend",
      icon: "/tech_stack_icons/react.svg",
      highlight: "Component Architecture, Virtual DOM, Reactive State",
    },
    {
      name: "PostgreSQL",
      version: "v16",
      role: "Relational ACID",
      icon: "/tech_stack_icons/postgresql.svg",
      highlight: "JSONB indexing, Complex Queries, High Consistency",
    },
    {
      name: "Docker",
      version: "Containers",
      role: "DevOps Standard",
      icon: "/tech_stack_icons/docker.svg",
      highlight: "Containerization, Multi-Stage Builds, CI/CD Readiness",
    },
  ];

  const filteredSkills = useMemo(() => {
    if (activeCategory === "all") return skillsData.technical;
    return skillsData.technical.filter(
      (s) => s.category?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [activeCategory, skillsData.technical]);

  const architectureStudies: ArchitectureStudy[] = skillsData.architectureStudies || [];

  return (
    <WebLayout>
      <PageLayout title="Skills & Tech Stack">
        {/* Section 1: Core Daily Drivers */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                Core Specialty & Primary Stack
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Teknologi utama yang saya gunakan sehari-hari untuk membangun sistem produksi.
              </p>
            </div>
            <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 hidden sm:inline-block">
              Daily Drivers
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coreStacks.map((core) => (
              <div
                key={core.name}
                className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5 shadow-sm hover:border-primary/40 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-11 h-11 rounded-2xl bg-muted/70 p-2.5 flex items-center justify-center border border-border/60">
                      <SkillIcon icon={core.icon} className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {core.version}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground">{core.name}</h3>
                  <p className="text-xs font-semibold text-primary/90 mt-0.5">{core.role}</p>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {core.highlight}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Complete Interactive Tech Ecosystem Cloud */}
        <section className="space-y-4 pt-6 border-t border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                Ekosistem Teknologi Lengkap
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Klik filter di bawah untuk melihat teknologi berdasarkan kategori.
              </p>
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {filteredSkills.length} Teknologi
            </span>
          </div>

          {/* Clean Rounded-Full Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-muted/40 backdrop-blur-sm rounded-full border border-border/60 w-fit max-w-full overflow-x-auto">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm scale-[1.03]"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Icon-only Tech Cloud — label shows on hover tooltip */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {filteredSkills.map((skill) => (
              <div
                key={skill.label}
                title={skill.version ? `${skill.label} ${skill.version}` : skill.label}
                className="group relative aspect-square rounded-2xl border border-border/70 bg-card/90 flex items-center justify-center hover:border-primary/60 hover:bg-primary/8 hover:-translate-y-1.5 hover:shadow-lg transition-all duration-200 shadow-sm cursor-default"
              >
                <SkillIcon icon={skill.icon} className="w-8 h-8" />
                {/* Tooltip */}
                <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold px-2 py-0.5 rounded-full bg-popover border border-border shadow-md text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-[9999]">
                  {skill.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Architecture & Engineering Studies */}
        <section className="space-y-4 pt-6 border-t border-border/60">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
              High-Scale Engineering
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-foreground mt-2">
              Architecture & System Design Studies
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Pendekatan arsitektur untuk memecahkan tantangan latensi, konkurensi, dan integritas data enterprise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {architectureStudies.map((study, idx) => (
              <div
                key={study.id}
                className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5 shadow-sm hover:border-primary/40 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                      CASE 0{idx + 1}
                    </span>
                    <Zap className="w-3.5 h-3.5 text-primary opacity-70" />
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-foreground leading-snug">
                    {study.title}
                  </h3>

                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {study.architecture}
                  </p>

                  <div className="space-y-1.5 pt-1 text-xs text-muted-foreground">
                    {study.challenges.map((c, cIdx) => (
                      <div key={cIdx} className="flex items-start gap-1.5">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span className="line-clamp-2">{c.solution}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-3 mt-3 border-t border-border/40">
                  {study.tags.slice(0, 3).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Soft Skills & Interests */}
        <section className="pt-6 border-t border-border/60 text-center space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Kompetensi & Minat Riset
          </h3>
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {skillsData.softSkills.concat(skillsData.interests).map((item, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1 text-xs font-medium rounded-full bg-muted/70 text-foreground/80 border border-border/50"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      </PageLayout>
    </WebLayout>
  );
}
