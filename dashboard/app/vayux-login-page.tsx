"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDiscordLogin = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      // Reuses the existing NextAuth Discord provider.
      await signIn("discord", { callbackUrl: "/dashboard" });
    } catch {
      setIsLoading(false);
      setErrorMessage("Unable to start Discord login. Please try again.");
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080808] px-4 py-10 text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-18rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-red-600/15 blur-[120px]" />
        <div className="absolute bottom-[-18rem] right-[-10rem] h-[30rem] w-[30rem] rounded-full bg-red-900/15 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#080808_72%)]" />
      </div>

      <header className="absolute left-0 right-0 top-0 z-10 flex items-center px-5 py-5 sm:px-8 sm:py-7">
        <a href="/" className="group inline-flex items-center gap-3" aria-label="VayuX home">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/40 bg-red-500/10 shadow-[0_0_24px_rgba(239,68,68,0.12)]">
            <svg aria-hidden="true" viewBox="0 0 40 40" className="h-7 w-7" fill="none">
              <path d="M8 10L16 30H22L30 10H23L19 22L15 10H8Z" fill="currentColor" />
              <path d="M25 25L30 30L35 25" stroke="#FF3434" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-xl font-bold tracking-tight">Vayu<span className="text-red-500">X</span></span>
        </a>
      </header>

      <section className="relative z-10 w-full max-w-md">
        <div className="absolute -inset-px rounded-[1.6rem] bg-gradient-to-b from-red-500/40 via-red-900/15 to-white/5 blur-[2px]" />
        <div className="relative rounded-[1.55rem] border border-white/[0.09] bg-[#101010]/95 p-7 shadow-[0_25px_100px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:p-10">
          <div className="mb-8 flex justify-center">
            <div className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/20 to-red-950/30 shadow-[0_0_45px_rgba(239,68,68,0.15)]">
              <svg aria-hidden="true" viewBox="0 0 40 40" className="h-10 w-10" fill="none">
                <path d="M7 9L15.5 31H22L31 9H23.5L19 22.5L14.5 9H7Z" fill="currentColor" />
                <path d="M25 25L30 30L35 25" stroke="#FF3434" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <Sparkles className="absolute -right-2 -top-2 h-5 w-5 text-red-400" />
            </div>
          </div>

          <div className="text-center">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/[0.07] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-300">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_10px_#f87171]" />
              Your dashboard awaits
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-[2.1rem]">Welcome to <span className="text-red-500">VayuX</span></h1>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-zinc-400">Sign in with Discord to continue to your dashboard.</p>
          </div>

          <button
            type="button"
            onClick={handleDiscordLogin}
            disabled={isLoading}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-red-400/30 bg-gradient-to-r from-red-600 to-red-500 px-5 py-4 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(220,38,38,0.22)] transition duration-200 hover:-translate-y-0.5 hover:from-red-500 hover:to-red-400 hover:shadow-[0_12px_35px_rgba(220,38,38,0.32)] focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-[#101010] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {isLoading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Connecting to Discord...
              </>
            ) : (
              <>
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M19.27 5.33A18.1 18.1 0 0 0 14.83 4l-.22.45a16.6 16.6 0 0 0-5.22 0L9.17 4a18.1 18.1 0 0 0-4.44 1.33C1.92 9.48 1.16 13.53 1.54 17.53a18.3 18.3 0 0 0 5.44 2.75l1.18-1.92c-.65-.24-1.27-.55-1.85-.9l.45-.35c3.57 1.66 7.43 1.66 10.96 0l.46.35c-.59.35-1.21.66-1.86.9l1.18 1.92a18.2 18.2 0 0 0 5.44-2.75c.45-4.64-.77-8.65-3.67-12.2ZM8.55 15.5c-1.07 0-1.95-.98-1.95-2.18s.86-2.18 1.95-2.18c1.1 0 1.97.99 1.95 2.18 0 1.2-.86 2.18-1.95 2.18Zm6.9 0c-1.07 0-1.95-.98-1.95-2.18s.86-2.18 1.95-2.18c1.1 0 1.97.99 1.95 2.18 0 1.2-.86 2.18-1.95 2.18Z" />
                </svg>
                Login with Discord
                <ArrowUpRight className="ml-auto h-4 w-4 opacity-80" />
              </>
            )}
          </button>

          {errorMessage && <p role="alert" className="mt-4 text-center text-sm text-red-300">{errorMessage}</p>}

          <div className="my-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.08]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">Secure sign in</span>
            <div className="h-px flex-1 bg-white/[0.08]" />
          </div>

          <div className="flex items-start justify-center gap-2 text-center text-xs leading-5 text-zinc-500">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
            <p>Secure authentication powered by Discord OAuth2.</p>
          </div>
        </div>
        <p className="mt-6 text-center text-[11px] tracking-wide text-zinc-600">© 2026 VayuX. All rights reserved.</p>
      </section>
    </main>
  );
}
