import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: 'easeOut',
      delay: i * 0.12,
    },
  }),
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gray-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.2),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:52px_52px]" />

      <section className="relative flex min-h-screen items-center justify-center px-6 py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-gray-950 to-slate-950" />

        <motion.div
          className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-center text-center"
          initial="hidden"
          animate="visible"
        >
          <motion.div custom={0} variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#3b82f6]/40 bg-[#3b82f6]/10 px-4 py-2 text-sm font-medium text-[#bfdbfe] shadow-[0_0_20px_rgba(59,130,246,0.18)] backdrop-blur-md">
            <ShieldCheck size={16} className="text-[#60a5fa]" />
            Class Profile & Security Lab
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            className="font-playfair text-5xl italic tracking-[-0.06em] text-white sm:text-6xl md:text-8xl"
          >
            XI TKJ 3
          </motion.h1>

          <motion.h2
            custom={2}
            variants={fadeUp}
            className="mt-3 text-2xl font-light tracking-[-0.04em] text-slate-300 sm:text-4xl md:text-5xl"
          >
            SMK Telkom Malang
          </motion.h2>

          <motion.p
            custom={3}
            variants={fadeUp}
            className="mt-8 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg"
          >
            Menjelajahi keahlian, kreativitas, dan semangat kolaborasi 32 siswa XI TKJ 3 dalam sebuah laboratorium digital yang penuh inovasi dan tantangan keamanan web.
          </motion.p>

          <motion.div custom={4} variants={fadeUp} className="mt-10 flex items-center gap-4">
            <Link
              href="/students"
              className="inline-flex items-center gap-2 rounded-full bg-[#3b82f6] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_28px_rgba(59,130,246,0.42)] transition hover:scale-[1.02] hover:bg-[#2563eb]"
            >
              Mulai Eksplorasi Lab
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.7 }}
          className="pointer-events-auto absolute bottom-8 right-6 z-20 sm:bottom-10 sm:right-10"
        >
          <Link
            href="/students"
            className="group inline-flex items-center gap-3 rounded-full border border-[#3b82f6]/40 bg-[#3b82f6]/15 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(59,130,246,0.28)] backdrop-blur-xl transition hover:scale-[1.02] hover:bg-[#3b82f6]/20"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#3b82f6] text-white shadow-[0_0_18px_rgba(59,130,246,0.45)]">
              <Sparkles size={16} />
            </span>
            Mulai Eksplorasi Lab <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}

