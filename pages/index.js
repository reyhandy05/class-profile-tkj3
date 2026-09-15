import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

export default function HomePage() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch('/api/students', { cache: 'no-store' });
        const data = await res.json();
        setStudents(data.students || []);
      } catch (err) {
        console.error('Failed to fetch students', err);
      }
    }

    fetchStudents();
  }, []);

  const handleStudentLogin = (e) => {
    e.preventDefault();

    if (!selectedStudent) {
      setError('Pilih siswa terlebih dahulu.');
      return;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('userSession', JSON.stringify({ role: 'student', studentId: selectedStudent }));
    }

    router.push('/students');
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: adminUsername, password: adminPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login admin gagal');
        setLoading(false);
        return;
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('userSession', JSON.stringify({ role: 'admin', isAdmin: true }));
      }

      router.push('/students');
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat login admin');
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gray-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.2),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:52px_52px]" />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-16">
        <div className="w-full space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#93c5fd]">Class Profile & Security Lab</p>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">XI TKJ 3</h1>
            <h2 className="mt-3 text-xl text-slate-300 sm:text-2xl">SMK Telkom Malang</h2>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.5)] backdrop-blur-xl"
            >
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#93c5fd]">Portal Siswa</p>
                <h3 className="mt-2 text-2xl font-bold text-white">Login Siswa</h3>
              </div>

              <form onSubmit={handleStudentLogin} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Login sebagai...</label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-[#3b82f6]/50 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/30"
                  >
                    <option value="">Pilih nama siswa</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-[#3b82f6] px-5 py-3.5 font-semibold text-white shadow-[0_0_24px_rgba(59,130,246,0.35)] transition hover:bg-[#2563eb]"
                >
                  Masuk sebagai Siswa
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="rounded-[28px] border border-[#3b82f6]/30 bg-[#0b1220]/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.5)] backdrop-blur-xl"
            >
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#93c5fd]">Portal Admin</p>
                <h3 className="mt-2 text-2xl font-bold text-white">Login Admin</h3>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Username</label>
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-slate-400 focus:border-[#3b82f6]/50 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/30"
                    placeholder="Masukkan username"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-slate-400 focus:border-[#3b82f6]/50 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/30"
                    placeholder="Masukkan password"
                  />
                </div>

                {error ? (
                  <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-[#2563eb] px-5 py-3.5 font-semibold text-white shadow-[0_0_24px_rgba(37,99,235,0.35)] transition hover:bg-[#1d4ed8] disabled:opacity-60"
                >
                  {loading ? 'Memproses...' : 'Login Admin'}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}

