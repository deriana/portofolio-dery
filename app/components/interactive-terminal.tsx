import { useState } from "react";
import { Terminal, Copy, Check, Play } from "lucide-react";

interface CommandTab {
  id: string;
  command: string;
  output: string;
  lang: string;
}

const COMMAND_TABS: CommandTab[] = [
  {
    id: "neofetch",
    command: "neofetch --ascii_distro arch",
    lang: "bash",
    output: `       /\\          deryana@archlinux
      /  \\         -----------------
     /\\   \\        OS: Arch Linux x86_64
    /      \\       Host: Custom Linux Workstation
   /   ,,   \\      Kernel: 6.12.9-zen-hardened
  /   |  |  -\\     Uptime: 99.98% High Availability
 /_-''    ''-_\\    Shell: zsh 5.9 (x86_64-pc-linux-gnu)
                   Primary Stack: Go, Java, Laravel, K8s, Docker, Redis
                   Protocols: gRPC, Protobuf, RESTful APIs
                   Database: PostgreSQL, MySQL, Redis Cluster
                   Editor: Neovim / VSCode
                   Terminal: Alacritty (tmux)
                   Status: Active Engineering at Asqi (Microservices & Backend)`,
  },
  {
    id: "stack",
    command: "cat production-stack.json",
    lang: "json",
    output: `{
  "engineer": "Deryana Maruf",
  "experience": "Mobilus (2025 PKL) -> Asqi (2026 Magang) -> Asqi (2026-2027 Contract)",
  "backend": [
    "Golang (Go Fiber, Goroutines, High Concurrency)",
    "Java (Spring Boot, Project Loom Virtual Threads)",
    "Laravel (PHP, Eloquent ORM, Queues, MVC)"
  ],
  "distributed_systems": [
    "gRPC & Protocol Buffers Multiplexing",
    "Redis Cache-Aside & Idempotency Locks",
    "Multi-Service Data Synchronization (5 Microservices)"
  ],
  "devops_cloud": [
    "Docker Multi-Stage Containerization",
    "Kubernetes (K8s) Cluster Pod Deployment",
    "Linux Server Hardening & Nginx Reverse Proxy"
  ],
  "frontend_mobile": [
    "React.js", "React Native", "Next.js", "Tailwind CSS"
  ]
}`,
  },
  {
    id: "health",
    command: "curl -I https://api.deryana.dev/v1/healthcheck",
    lang: "http",
    output: `HTTP/2 200 OK
server: envoy/1.28.0 (k8s-ingress)
date: Sat, 19 Sep 2026 00:45:00 GMT
content-type: application/json; charset=utf-8
x-response-time: 1.18ms
x-cluster-nodes: 5-microservices-mesh

{
  "system_status": "OPERATIONAL",
  "engine": "Go + Java Hybrid Architecture",
  "active_services": {
    "banking_cashflow_ledger": "HEALTHY (sub-15ms)",
    "civil_hris_service": "HEALTHY (50k+ records)",
    "government_core_data_hub": "HEALTHY (52k RPS throughput)"
  },
  "redis_cache_hit_ratio": "98.4%",
  "active_goroutines": 1284
}`,
  },
  {
    id: "uptime",
    command: "uptime && free -h",
    lang: "bash",
    output: ` 00:45:00 up 42 days, 18:24,  1 user,  load average: 0.12, 0.18, 0.15

               total        used        free      shared  buff/cache   available
Mem:            31Gi       8.4Gi        18Gi       412Mi       4.6Gi        22Gi
Swap:          8.0Gi          0B       8.0Gi`,
  },
];

export function InteractiveTerminal() {
  const [activeTabId, setActiveTabId] = useState<string>("neofetch");
  const [copied, setCopied] = useState(false);

  const currentTab = COMMAND_TABS.find((t) => t.id === activeTabId) || COMMAND_TABS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(`${currentTab.command}\n\n${currentTab.output}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
            System Console
          </span>
          <div className="h-px flex-1 bg-border/60" />
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
          <Terminal className="w-3.5 h-3.5 text-primary" />
          <span>Interactive Linux Shell</span>
        </div>
      </div>

      {/* Terminal Window Container */}
      <div className="rounded-2xl border border-border/80 bg-[#0c101d] text-slate-200 overflow-hidden shadow-xl font-mono text-xs">
        {/* Terminal Titlebar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#070a14] border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block border border-red-600/30" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block border border-yellow-600/30" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block border border-green-600/30" />
            <span className="text-[11px] text-slate-400 font-semibold ml-2 select-none">
              deryana@archlinux: ~ (zsh)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors px-2 py-1 rounded bg-slate-900/60 border border-slate-800 cursor-pointer"
              title="Salin output terminal"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 text-[10px]">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span className="text-[10px]">Salin</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Command Tabs Bar */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-[#090d1a] border-b border-slate-800/80 overflow-x-auto">
          {COMMAND_TABS.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTabId(tab.id)}
                className={`px-3 py-1 rounded-lg text-[11px] transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 font-mono ${
                  isActive
                    ? "bg-slate-800 text-cyan-300 font-bold border border-cyan-500/40 shadow-xs"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/80"
                }`}
              >
                <Play className={`w-2.5 h-2.5 ${isActive ? "text-cyan-400 fill-cyan-400" : "text-slate-500"}`} />
                <span>{tab.command.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Terminal Body */}
        <div className="p-4 sm:p-5 overflow-x-auto space-y-3 bg-[#0a0e1c]">
          {/* Prompt line */}
          <div className="flex items-center gap-2 text-slate-300 flex-wrap">
            <span className="text-emerald-400 font-bold">deryana@archlinux</span>
            <span className="text-slate-500">:</span>
            <span className="text-cyan-400 font-bold">~</span>
            <span className="text-slate-500">$</span>
            <span className="text-yellow-300 font-semibold">{currentTab.command}</span>
            <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-0.5" />
          </div>

          {/* Output Block */}
          <pre className="text-[11px] sm:text-xs text-slate-300 leading-relaxed font-mono whitespace-pre selection:bg-cyan-900 selection:text-cyan-200">
            {currentTab.output}
          </pre>
        </div>

        {/* Terminal Footer */}
        <div className="px-4 py-2 bg-[#070a14] border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
          <span>ARCH LINUX X86_64 · ZSH 5.9</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            LIVE WORKSTATION ENVIRONMENT
          </span>
        </div>
      </div>
    </section>
  );
}
