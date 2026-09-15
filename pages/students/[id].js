import Link from 'next/link';
import { ArrowLeft, ArrowRight, MessageSquareQuote, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export default function StudentProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const fileInputRef = useRef(null);
  const [student, setStudent] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchStudent = async () => {
    if (!id) return;

    try {
      const response = await fetch(`/api/students/${id}`);
      const data = await response.json();
      setStudent(data.student || null);
    } catch (error) {
      console.error(error);
      setStudent(null);
    }
  };

  const fetchComments = async () => {
    if (!id) return;

    try {
      const response = await fetch(`/api/students/${id}/comments`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });
      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error(error);
      setComments([]);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('userSession');
      if (!raw) {
        setIsAdmin(false);
        return;
      }

      try {
        const session = JSON.parse(raw);
        setIsAdmin(session && session.role === 'admin');
      } catch (error) {
        setIsAdmin(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    fetchStudent();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) return;

    try {
      const response = await fetch(`/api/students/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment }),
      });

      const data = await response.json();
      if (data.comments) {
        setComments(data.comments);
      }
      setComment('');
      await fetchComments();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!commentId || !id) return;

    try {
      const response = await fetch(`/api/students/${id}/comments/${commentId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file || !id || !isAdmin) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/upload?id=${id}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data && data.url) {
        setStudent((prev) => ({ ...prev, photo_url: data.url }));
        await fetchStudent();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!student) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 px-6 text-white">
        <div className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-slate-300 backdrop-blur-xl">
          Memuat profil siswa...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 px-4 pb-16 pt-28 text-white sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="mx-auto max-w-5xl"
      >
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/students"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={16} />
            Kembali ke List
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#3b82f6]/25 bg-[#3b82f6]/10 px-5 py-2.5 text-sm font-medium text-[#dbeafe] transition hover:bg-[#3b82f6]/20"
          >
            Home
            <ArrowRight size={16} />
          </Link>
        </div>

        <section className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.5)] backdrop-blur-2xl md:p-8">
          <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
            <div className="relative">
              <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(circle,_rgba(59,130,246,0.38),transparent_60%)] blur-2xl" />
              <img
                src={student.photo_url || student.profile_picture_path || '/images/default.svg'}
                alt={student.full_name}
                className="relative h-[320px] w-full rounded-[28px] border border-white/10 object-cover shadow-[0_15px_40px_rgba(59,130,246,0.2)]"
              />

              {isAdmin && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#3b82f6]/40 bg-[#3b82f6]/10 px-4 py-3 text-sm font-medium text-[#dbeafe] transition hover:bg-[#3b82f6]/20"
                  >
                    Upload Photo
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#93c5fd]">{student.class_name}</p>
              <h1 className="mt-3 text-4xl font-black text-white md:text-5xl">{student.full_name}</h1>
              <p className="mt-2 text-lg text-slate-300">Nickname: {student.nickname}</p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#0b1120]/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Expertise</p>
                  <p className="mt-2 text-lg font-semibold text-white">{student.expertise}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0b1120]/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Skills</p>
                  <p className="mt-2 text-lg font-semibold text-white">{student.skills}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0b1120]/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Hobbies</p>
                  <p className="mt-2 text-lg font-semibold text-white">{student.hobbies}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0b1120]/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Future Goals</p>
                  <p className="mt-2 text-lg font-semibold text-white">{student.future_goals}</p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-[#3b82f6]/30 bg-[#3b82f6]/10 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#bfdbfe]">Description</p>
                <p className="mt-3 text-base leading-7 text-slate-200">{student.description}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[32px] border border-white/10 bg-[#0d1320]/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.5)] backdrop-blur-2xl md:p-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#3b82f6]/15 text-[#93c5fd]">
              <MessageSquareQuote size={18} />
            </div>
            <h2 className="text-2xl font-bold text-white">Komentar / Deskripsi Diri</h2>
          </div>

          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              placeholder="Tulis komentar atau deskripsi diri..."
              className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-white placeholder:text-slate-400 focus:border-[#3b82f6]/50 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/30"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-[#3b82f6] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(59,130,246,0.35)] transition hover:bg-[#2563eb]"
              >
                Kirim Komentar
                <UserRound size={16} />
              </button>
            </div>
          </form>

          <div className="mt-8 space-y-4">
            {comments.length === 0 ? (
              <p className="text-slate-400">Belum ada komentar.</p>
            ) : (
              comments.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200">
                  <div className="flex items-start justify-between gap-3">
                    <div dangerouslySetInnerHTML={{ __html: item.content }} />
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleCommentDelete(item.id)}
                        className="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-200 transition hover:bg-red-500/20"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </motion.div>
    </main>
  );
}

