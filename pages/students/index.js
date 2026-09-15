import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function StudentListPage() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('userRole');
      if (role !== 'student' && role !== 'admin') {
        router.replace('/');
        return;
      }
      setAuthReady(true);
    }

    const fetchStudents = async () => {
      const query = typeof search === 'string' ? search.trim() : '';
      setLoading(true);

      try {
        const url = query
          ? `/api/students?search=${encodeURIComponent(query)}&_t=${Date.now()}`
          : `/api/students?_t=${Date.now()}`;

        const response = await fetch(url, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
        });

        const data = await response.json();
        setStudents(data.students || []);
      } catch (error) {
        console.error(error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [search, router]);

  if (!authReady) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-950 px-4 pb-16 pt-28 text-white sm:px-6">
      <motion.div
        initial={{ opacity: 0, x: 36 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="mx-auto max-w-6xl"
      >
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#93c5fd]">Security Lab</p>
          <h1 className="font-playfair text-4xl italic text-white md:text-5xl">Class Roster</h1>
        </div>

        <div className="mb-8 relative">
          <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center text-[#93c5fd]">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            placeholder="Cari siswa berdasarkan nama..."
            className="w-full rounded-full border border-white/15 bg-white/5 px-12 py-4 text-base text-white placeholder:text-slate-400 focus:border-[#3b82f6]/60 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/30 backdrop-blur-xl"
          />
        </div>

        {loading ? (
          <div className="flex min-h-[240px] items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-lg text-slate-300 backdrop-blur-xl">
            Memuat data siswa...
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {students.length > 0 ? (
              students.map((student) => (
                <Tilt
                  key={student.id}
                  tiltMaxAngleX={10}
                  tiltMaxAngleY={10}
                  glareEnable={true}
                  glareMaxOpacity={0.3}
                  className="h-full"
                >
                  <Link href={`/students/${student.id}`} className="group block h-full">
                    <article className="flex h-full cursor-pointer flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_10px_40px_rgba(15,23,42,0.45)] backdrop-blur-xl transition duration-300 hover:border-[#3b82f6]/40 hover:bg-white/10">
                      <div className="mb-4 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#3b82f6]/20 via-white/5 to-[#0f172a]">
                        <img
                          src={student.profile_picture_path || '/images/default.svg'}
                          alt={student.full_name}
                          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div className="flex flex-1 flex-col">
                        <h3 className="text-2xl font-bold text-white">{student.full_name}</h3>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#93c5fd]">
                          {student.expertise}
                        </p>
                        <p className="mt-4 text-sm leading-6 text-slate-300">
                          {student.skills || 'Skill belum tersedia'}
                        </p>

                        <div className="mt-auto pt-5">
                          <span className="inline-flex items-center gap-2 rounded-full bg-[#3b82f6] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_18px_rgba(59,130,246,0.28)] transition group-hover:bg-[#2563eb]">
                            Lihat Profil
                            <ArrowRight size={16} />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </Tilt>
              ))
            ) : (
              <div className="col-span-full rounded-[28px] border border-white/10 bg-white/5 p-10 text-center text-slate-300 backdrop-blur-xl">
                Tidak ada siswa yang ditemukan.
              </div>
            )}
          </div>
        )}
      </motion.div>
    </main>
  );
}

