import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login gagal');
        setLoading(false);
        return;
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('isAdmin', 'true');
      }

      router.push('/students');
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat login');
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 px-6 py-16 text-white">
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.5)] backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#93c5fd]">Admin Access</p>
          <h1 className="mt-3 text-3xl font-bold text-white">Login Panel</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-slate-400 focus:border-[#3b82f6]/50 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/30"
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            className="w-full rounded-full bg-[#3b82f6] px-5 py-3 font-semibold text-white shadow-[0_0_24px_rgba(59,130,246,0.35)] transition hover:bg-[#2563eb] disabled:opacity-60"
          >
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Kembali ke{' '}
          <Link href="/students" className="font-medium text-[#93c5fd] hover:text-white">
            daftar siswa
          </Link>
        </div>
      </div>
    </main>
  );
}
