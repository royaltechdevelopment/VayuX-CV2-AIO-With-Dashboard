"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Bell,
  ExternalLink,
  LogIn,
  Menu,
  MessageSquare,
  ScrollText,
  Settings,
  Shield,
  ShieldCheck,
  Tags,
  Ticket,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";

/* ==========================================================================
   Configuration — replace these three values with your real ones.
   Everything else in this file works as-is.
   ========================================================================== */

// Your Discord application's Client ID (Discord Developer Portal → OAuth2).
// Optionally set it as NEXT_PUBLIC_DISCORD_BOT_CLIENT_ID in your .env instead.
const DISCORD_BOT_CLIENT_ID =
  process.env.NEXT_PUBLIC_DISCORD_BOT_CLIENT_ID ?? "";

// Discord permission bitfield requested during authorization.
// "8" = Administrator. Replace with a narrower bitfield if you prefer.
const DISCORD_BOT_PERMISSIONS = "8";

// Real documentation / support URLs. Leave empty and the navbar simply
// renders those items in a muted, non-clickable state — no fake links.
const DOCS_URL = "";
const SUPPORT_URL = "";

// Bot invitation / OAuth2 authorization URL with bot + applications.commands
// scopes. The server owner picks their server and approves the permissions.
const botInviteUrl = DISCORD_BOT_CLIENT_ID
  ? `https://discord.com/oauth2/authorize?client_id=${DISCORD_BOT_CLIENT_ID}&permissions=${DISCORD_BOT_PERMISSIONS}&scope=bot%20applications.commands`
  : null;

if (!botInviteUrl && typeof console !== "undefined") {
  console.warn(
    "[VayuX] 'Add Bot' buttons are disabled: set DISCORD_BOT_CLIENT_ID in app/page.tsx."
  );
}

/* ==========================================================================
   Shared design tokens (scoped to this file)
   ========================================================================== */

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4d4d]/60 disabled:cursor-not-allowed";

const btnPrimary = `${btnBase} bg-gradient-to-r from-[#ff3b3b] via-[#d61f2b] to-[#8a0f1c] text-white shadow-[0_10px_30px_-10px_rgba(255,60,60,0.55)] hover:shadow-[0_14px_42px_-8px_rgba(255,60,60,0.7)] hover:brightness-110 active:scale-[0.98]`;

const btnGhost = `${btnBase} border border-white/10 bg-white/[0.04] text-white/90 backdrop-blur hover:border-[#ff4d4d]/40 hover:bg-white/[0.08] hover:text-white active:scale-[0.98]`;

const sectionTitle =
  "text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl";

const cardBase =
  "group rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#ff4d4d]/30 hover:bg-white/[0.05] hover:shadow-[0_20px_50px_-20px_rgba(220,38,38,0.35)]";

const features = [
  {
    icon: ShieldCheck,
    title: "Moderation & Server Security",
    body: "Automod filters, raid protection, warning trails and escalation actions that keep your community safe around the clock.",
  },
  {
    icon: BadgeCheck,
    title: "Welcome & Verification",
    body: "Greet new members with custom welcome cards and gate your server behind verification rules you fully control.",
  },
  {
    icon: Tags,
    title: "Auto Roles & Reaction Roles",
    body: "Assign roles automatically on join, or let members pick their own through clean reaction role menus.",
  },
  {
    icon: Ticket,
    title: "Ticket Management",
    body: "Private support threads with transcripts, claiming and staff categories — support without the chaos.",
  },
  {
    icon: Trophy,
    title: "Leveling & Engagement",
    body: "XP, ranks, role rewards and leaderboards that keep members active and coming back for more.",
  },
  {
    icon: ScrollText,
    title: "Server Logs & Activity",
    body: "Every join, delete, ban and role change captured in organized, searchable, easy-to-audit logs.",
  },
] as const;

const modules = [
  { icon: ShieldCheck, name: "Moderation", note: "Warnings · mutes · bans · automod" },
  { icon: BadgeCheck, name: "Welcome & Verification", note: "Greeting cards · gatekeeper" },
  { icon: Tags, name: "Reaction Roles", note: "Self-roles · auto roles on join" },
  { icon: Ticket, name: "Tickets", note: "Transcripts · staff claiming" },
  { icon: Trophy, name: "Leveling", note: "XP · rank cards · rewards" },
  { icon: ScrollText, name: "Logging", note: "Message · member · mod logs" },
] as const;

const feed = [
  { icon: ShieldCheck, tone: "text-[#ff5c5c]", text: "Raid filter triggered in #general", time: "2m ago" },
  { icon: Users, tone: "text-[#8b93a7]", text: "Member joined — verification sent", time: "6m ago" },
  { icon: Ticket, tone: "text-[#ff8a4c]", text: "Ticket #214 claimed by @moderator", time: "14m ago" },
  { icon: Trophy, tone: "text-[#ffd166]", text: "@ember reached Level 25", time: "31m ago" },
] as const;

/* ==========================================================================
   Small building blocks
   ========================================================================== */

function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff3b3b] via-[#d61f2b] to-[#5c0a0a] shadow-[0_8px_24px_-6px_rgba(255,50,50,0.6)]"
      style={{ width: size, height: size }}
    >
      <Shield className="text-white" style={{ width: size * 0.55, height: size * 0.55 }} strokeWidth={2.2} />
    </span>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <LogoMark size={compact ? 36 : 40} />
      <span className="flex flex-col leading-tight">
        <span className="text-lg font-extrabold tracking-tight text-white">
          Vayu<span className="text-[#ff4d4d]">X</span>
        </span>
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
          Discord Bot Dashboard
        </span>
      </span>
    </span>
  );
}

function LoginButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
      className={className ?? `${btnPrimary} h-12 px-6 text-sm`}
    >
      <LogIn className="h-4 w-4" />
      Login with Discord
    </button>
  );
}

function AddBotButton({ className, label = "Add VayuX to Discord" }: { className?: string; label?: string }) {
  if (botInviteUrl) {
    return (
      <a
        href={botInviteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className ?? `${btnPrimary} h-12 px-6 text-sm`}
      >
        <ExternalLink className="h-4 w-4" />
        {label}
      </a>
    );
  }
  return (
    <button
      type="button"
      disabled
      title="Set DISCORD_BOT_CLIENT_ID in app/page.tsx to enable this button."
      className={`${className ?? `${btnPrimary} h-12 px-6 text-sm`} cursor-not-allowed opacity-50`}
    >
      <ExternalLink className="h-4 w-4" />
      {label}
    </button>
  );
}

function DocLink({ href, label }: { href: string; label: string }) {
  if (!href) {
    return (
      <span
        title="Add your real URL in the DOCS_URL / SUPPORT_URL constants in app/page.tsx."
        className="cursor-not-allowed text-sm font-medium text-white/30"
      >
        {label}
      </span>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white/60 transition-colors hover:text-[#ff6b6b]">
      {label}
    </a>
  );
}

function DashboardPreview() {
  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-8 rounded-[2rem] bg-[#d61f2b]/15 blur-3xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d15]/90 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        {/* Window bar */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/40">
            app.vayux.xyz/dashboard
          </span>
          <span className="rounded-md border border-[#ff4d4d]/25 bg-[#ff4d4d]/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#ff8a8a]">
            Sample data
          </span>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="hidden w-44 shrink-0 border-r border-white/[0.06] p-4 sm:block">
            <div className="mb-4 flex items-center gap-2">
              <LogoMark size={26} />
              <span className="text-sm font-bold text-white">VayuX</span>
            </div>
            {["Overview", "Moderation", "Tickets", "Leveling", "Logs"].map((item, i) => (
              <div
                key={item}
                className={`mb-1 flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                  i === 0
                    ? "bg-gradient-to-r from-[#d61f2b]/25 to-transparent font-semibold text-white"
                    : "text-white/40"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-[#ff4d4d]" : "bg-white/20"}`} />
                {item}
              </div>
            ))}
          </div>

          {/* Main panel */}
          <div className="min-w-0 flex-1 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">Overview</p>
                <p className="text-[11px] text-white/40">Your server at a glance</p>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-white/30" />
                <Settings className="h-4 w-4 text-white/30" />
              </div>
            </div>

            {/* Stat tiles — illustrative sample data, not live metrics */}
            <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { label: "Members", value: "12,482", icon: Users },
                { label: "Active now", value: "318", icon: Zap },
                { label: "Open tickets", value: "6", icon: Ticket },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                  <stat.icon className="mb-2 h-3.5 w-3.5 text-[#ff6b6b]" />
                  <p className="text-base font-bold text-white sm:text-lg">{stat.value}</p>
                  <p className="text-[10px] text-white/40">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Activity feed */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                <Activity className="h-3.5 w-3.5 text-[#ff6b6b]" />
                Moderation feed
              </p>
              {feed.map((row) => (
                <div key={row.text} className="flex items-center gap-2.5 border-t border-white/[0.04] py-2 first:border-t-0">
                  <row.icon className={`h-3.5 w-3.5 shrink-0 ${row.tone}`} />
                  <p className="min-w-0 flex-1 truncate text-xs text-white/70">{row.text}</p>
                  <span className="shrink-0 text-[10px] text-white/30">{row.time}</span>
                </div>
              ))}
            </div>

            <p className="mt-3 text-center text-[10px] text-white/25">
              Illustrative preview — sample data, not live metrics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Page
   ========================================================================== */

// NOTE: keep your existing default export name if it differs from `Page`.
export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = (
    <>
      <a href="#features" className="text-sm font-medium text-white/60 transition-colors hover:text-[#ff6b6b]">
        Features
      </a>
      <a href="#modules" className="text-sm font-medium text-white/60 transition-colors hover:text-[#ff6b6b]">
        Modules
      </a>
      <DocLink href={DOCS_URL} label="Documentation" />
      <DocLink href={SUPPORT_URL} label="Support" />
    </>
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#05060a] text-white antialiased selection:bg-[#d61f2b]/60">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes vx-fade-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes vx-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes vx-glow { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.85; } }
        .vx-fade-up { animation: vx-fade-up 0.7s ease-out both; }
        .vx-float { animation: vx-float 7s ease-in-out infinite; }
        .vx-glow { animation: vx-glow 5s ease-in-out infinite; }
      ` }} />

      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#05060a]/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#" aria-label="VayuX home" className="flex items-center">
            <Brand compact />
          </a>

          <nav className="hidden items-center gap-8 md:flex">{navItems}</nav>

          <div className="hidden items-center gap-3 md:flex">
            <LoginButton className={`${btnGhost} h-10 px-4 text-sm`} />
            <AddBotButton className={`${btnPrimary} h-10 px-4 text-sm`} label="Add Bot" />
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/80 md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="border-t border-white/[0.06] bg-[#05060a]/95 px-4 pb-6 pt-4 backdrop-blur-xl md:hidden">
            <nav className="flex flex-col gap-4">{navItems}</nav>
            <div className="mt-6 flex flex-col gap-3">
              <LoginButton className={`${btnGhost} h-11 w-full text-sm`} />
              <AddBotButton className={`${btnPrimary} h-11 w-full text-sm`} />
            </div>
          </div>
        )}
      </header>

      {/* ================= HERO ================= */}
      <section className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="vx-glow absolute -top-48 left-1/2 h-[520px] w-[860px] -translate-x-1/2 rounded-full bg-[#e11d2e]/20 blur-[140px]" />
          <div className="vx-float absolute -right-32 top-64 h-[380px] w-[380px] rounded-full bg-[#7f1020]/25 blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.04),transparent_55%)]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 md:pt-24 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-8 lg:pb-28">
          <div>
            <div className="vx-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-[#ff4d4d]/25 bg-[#d61f2b]/10 px-4 py-1.5 text-xs font-medium text-[#ff8a8a]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff4d4d]" />
              Built for serious Discord communities
            </div>

            <h1 className="vx-fade-up text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl" style={{ animationDelay: "80ms" }}>
              Your Server.
              <br />
              Your Rules.
              <br />
              <span className="bg-gradient-to-r from-[#ff5c5c] via-[#e11d2e] to-[#8a0f1c] bg-clip-text text-transparent">
                VayuX.
              </span>
            </h1>

            <p className="vx-fade-up mt-6 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg" style={{ animationDelay: "160ms" }}>
              VayuX gives Discord server owners one clean dashboard for
              moderation, automation, community engagement and everyday server
              tools — so your community runs itself while you stay in control.
            </p>

            <div className="vx-fade-up mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "240ms" }}>
              <LoginButton className={`${btnPrimary} h-14 px-8 text-base`} />
              <AddBotButton className={`${btnGhost} h-14 px-8 text-base`} />
            </div>

            <p className="vx-fade-up mt-5 flex items-center gap-2 text-xs text-white/35" style={{ animationDelay: "320ms" }}>
              <Shield className="h-3.5 w-3.5 text-[#ff6b6b]" />
              You approve every permission on Discord&apos;s own authorization screen.
            </p>
          </div>

          <div className="vx-fade-up lg:justify-self-end" style={{ animationDelay: "200ms" }}>
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#ff6b6b]">Features</p>
          <h2 className={sectionTitle}>Everything your server needs, in one place</h2>
          <p className="mt-4 text-base text-white/50">
            Each feature is designed to work together — configure them from the VayuX dashboard, no cluttered commands required.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className={cardBase}>
              <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#ff4d4d]/20 bg-gradient-to-br from-[#d61f2b]/20 to-transparent">
                <feature.icon className="h-5 w-5 text-[#ff6b6b]" />
              </span>
              <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-white/50">{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ================= MODULES ================= */}
      <section id="modules" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/3 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[#8a0f1c]/10 blur-[130px]" />
        </div>

        <div className="relative grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#ff6b6b]">Modules</p>
            <h2 className={sectionTitle}>Turn modules on. Tune them your way.</h2>
            <p className="mt-4 text-base text-white/50">
              Every module is independent — enable what your community needs and leave the rest off. Configure each one from the dashboard whenever your server evolves.
            </p>
            <div className="mt-8">
              <AddBotButton className={`${btnPrimary} h-12 px-6 text-sm`} label="Add VayuX & explore modules" />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm">
            {modules.map((mod, i) => (
              <div
                key={mod.name}
                className={`group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[#d61f2b]/[0.08] ${
                  i !== modules.length - 1 ? "border-b border-white/[0.05]" : ""
                }`}
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#ff4d4d]/20 bg-[#d61f2b]/10">
                  <mod.icon className="h-4 w-4 text-[#ff6b6b]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">{mod.name}</p>
                  <p className="truncate text-xs text-white/40">{mod.note}</p>
                </div>
                <span className="hidden shrink-0 rounded-full border border-[#ff4d4d]/25 bg-[#d61f2b]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#ff8a8a] sm:inline">
                  Included
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-white/25 transition-transform group-hover:translate-x-0.5" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section id="get-started" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="relative overflow-hidden rounded-3xl border border-[#ff4d4d]/20 bg-gradient-to-br from-[#3d0810] via-[#20060c] to-[#0a0d15] px-6 py-16 text-center sm:px-12 lg:py-20">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="vx-glow absolute left-1/2 top-0 h-[300px] w-[560px] -translate-x-1/2 rounded-full bg-[#e11d2e]/25 blur-[110px]" />
          </div>

          <div className="relative">
            <div className="mb-6 flex justify-center">
              <LogoMark size={56} />
            </div>
            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to run your server on VayuX?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/55">
              Sign in with Discord to open your dashboard, or invite VayuX to your server and start configuring in minutes.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <LoginButton className={`${btnGhost} h-14 px-8 text-base`} />
              <AddBotButton className={`${btnPrimary} h-14 px-8 text-base`} />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/[0.06] bg-[#05060a]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm">
              <Brand />
              <p className="mt-4 text-sm leading-relaxed text-white/40">
                Moderation, automation, engagement and server tools — one dashboard for your entire Discord community.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-12 sm:gap-16">
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/30">Product</p>
                <div className="flex flex-col gap-3">
                  <a href="#features" className="text-sm text-white/60 transition-colors hover:text-[#ff6b6b]">Features</a>
                  <a href="#modules" className="text-sm text-white/60 transition-colors hover:text-[#ff6b6b]">Modules</a>
                  <DocLink href={DOCS_URL} label="Documentation" />
                </div>
              </div>
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/30">Resources</p>
                <div className="flex flex-col gap-3">
                  <DocLink href={SUPPORT_URL} label="Support" />
                  <a href="#get-started" className="text-sm text-white/60 transition-colors hover:text-[#ff6b6b]">Get started</a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.05] pt-8 sm:flex-row">
            <p className="text-xs text-white/30">© {new Date().getFullYear()} VayuX. All rights reserved.</p>
            <p className="flex items-center gap-2 text-xs text-white/30">
              <MessageSquare className="h-3.5 w-3.5 text-[#ff6b6b]" />
              Not affiliated with Discord Inc.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
