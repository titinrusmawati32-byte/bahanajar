import React from 'react';
import { Box, ArrowLeft, MessageSquare } from 'lucide-react';
import { RoutePath } from '../types';
import { WA_ADMIN_URL } from '../data/curriculum';
import { audioService } from '../utils/audio';

interface PrivacyPageProps {
  onNavigate: (route: RoutePath) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between">
      <header className="border-b border-slate-800/80 bg-[#0b0f19] px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div
            onClick={() => {
              audioService.playClick();
              onNavigate('/');
            }}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Box className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-lg font-extrabold text-white">
              3d<span className="text-emerald-400">Funlearn</span>
            </span>
          </div>

          <div className="px-2.5 py-1 rounded bg-slate-800 text-xs font-bold text-slate-400 border border-slate-700">
            ID
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8 flex-1">
        <div>
          <button
            onClick={() => {
              audioService.playClick();
              onNavigate('/');
            }}
            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5 mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke beranda</span>
          </button>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Kebijakan Privasi
          </h1>
          <p className="text-xs text-emerald-400 font-semibold tracking-wide uppercase mt-2">
            Berlaku sejak 24 Oktober 2026
          </p>
        </div>

        <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">Siapa kami</h2>
            <p>
              3dFunlearn adalah media belajar 3D untuk kelas Indonesia, didukung TutorFlow. Halaman ini menjelaskan data apa yang kami simpan dan bagaimana kami menjaganya.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">Data yang kami simpan</h2>
            <p>
              Saat guru masuk dengan Google, kami menyimpan nama, alamat email, dan foto profil dari akun Google tersebut. Kami juga menyimpan status langganan (paket dan tanggal aktif) serta catatan teknis yang diperlukan untuk menjaga keamanan akun, seperti waktu masuk dan jenis perangkat.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">Data murid</h2>
            <p>
              Kami tidak mengumpulkan data pribadi murid. Murid membuka modul lewat QR dari guru tanpa membuat akun.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">Untuk apa data dipakai</h2>
            <p>
              Data dipakai untuk menyediakan akun, mengelola langganan, menjaga keamanan akun, dan menghubungi guru tentang langganannya. Kami tidak menjual data dan tidak membagikannya untuk iklan.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">Di mana data disimpan</h2>
            <p>
              Data akun disimpan di layanan Supabase (server di Singapura). Situs dijalankan di layanan Vercel.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">Cookie</h2>
            <p>
              Kami memakai cookie untuk menjaga sesi masuk dan menyimpan pilihan bahasa. Kami tidak memakai cookie iklan.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">Menghapus akun</h2>
            <p>
              Guru dapat meminta akunnya dihapus dengan menghubungi admin lewat WhatsApp. Permintaan diproses paling lambat 14 hari.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">Perubahan kebijakan</h2>
            <p>
              Jika kebijakan ini berubah, versi terbarunya diumumkan di halaman ini.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h2 className="text-base font-bold text-white">Kontak</h2>
            <p className="text-xs text-slate-400">
              Punya pertanyaan seputar data pribadi atau akun Anda?
            </p>
            <a
              href={WA_ADMIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Hubungi admin 3dFunlearn lewat WhatsApp</span>
            </a>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-[#070b14] py-6 text-xs text-slate-400">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('/')}
            className="hover:text-slate-200 transition-colors"
          >
            Kembali ke beranda
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('/privasi')}
              className="text-emerald-400 font-semibold"
            >
              Kebijakan Privasi
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('/syarat')}
              className="hover:text-slate-200 transition-colors"
            >
              Syarat Layanan
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
