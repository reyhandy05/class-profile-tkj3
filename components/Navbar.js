import Link from 'next/link';
import { Shield, Sparkles, Home } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-[999] pointer-events-auto px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 shadow-[0_0_30px_rgba(59,130,246,0.12)] backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-3 rounded-full px-2 py-1 transition hover:bg-white/5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3b82f6]/20 text-[#60a5fa] shadow-[0_0_24px_rgba(59,130,246,0.45)]">
            <Shield size={18} />
          </div>
          <div className="leading-none">
            <p className="text-base font-black tracking-tight text-white">XI TKJ 3</p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-black/20 px-2 py-1.5 md:flex">
          <Link
            href="/"
            className="rounded-full px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <span className="inline-flex items-center gap-2">
              <Home size={14} />
              Home
            </span>
          </Link>
          <Link
            href="/students"
            className="rounded-full px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <span className="inline-flex items-center gap-2">
              <Sparkles size={14} />
              Security Lab
            </span>
          </Link>
        </div>

        <Link
          href="/students"
          className="rounded-full border border-[#3b82f6]/40 bg-[#3b82f6]/10 px-4 py-2 text-sm font-semibold text-[#dbeafe] shadow-[0_0_18px_rgba(59,130,246,0.25)] transition hover:bg-[#3b82f6]/20"
        >
          Explore Lab
        </Link>
      </div>
    </nav>
  );
}
