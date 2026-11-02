import React from 'react';
import { Box, ArrowLeft, MessageSquare } from 'lucide-react';
import { RoutePath } from '../types';
import { WA_ADMIN_URL } from '../data/curriculum';
import { audioService } from '../utils/audio';

interface TermsPageProps {
  onNavigate: (route: RoutePath) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
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
            Syarat Layanan
          </h1>
          <p className="text-xs text-emerald-400 font-semibold tracking-wide uppercase mt-2">
            Berlaku sejak 24 Oktober 2026
          </p>
        </div>

        <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">Akun</h2>
            <p>
              Satu akun untuk satu guru dan hanya boleh dipakai oleh pemiliknya. Akun tidak boleh dipinjamkan atau dipakai bersama.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">Langganan</h2>
            <p>
              Langganan berlaku satu tahun sejak diaktifkan oleh admin. Harga normal <strong>Rp150.000</strong> per tahun. Early Supporter <strong>Rp100.000</strong> per tahun untuk 25 guru pertama, dengan harga yang tetap sama setiap kali diperpanjang.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">Materi</h2>
            <p>
              Modul disusun mengikuti Kurikulum Merdeka. Modul berlabel <em>Pratinjau</em> sedang diverifikasi. Kami berusaha menjaga ketepatan materi; jika menemukan kesalahan, mohon kabari kami.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">Penggunaan yang diizinkan</h2>
            <p>
              Modul boleh dipakai untuk kegiatan belajar mengajar dan dibagikan ke murid lewat fitur <strong>Bagikan ke murid</strong>. Model 3D, teks, dan isi modul tidak boleh disalin, diunduh untuk dijual kembali, atau diterbitkan ulang tanpa izin.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">Perubahan layanan</h2>
            <p>
              Kami dapat menambah, mengubah, atau memperbaiki modul dan fitur. Perubahan penting diumumkan kepada pelanggan.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h2 className="text-base font-bold text-white">Kontak</h2>
            <p className="text-xs text-slate-400">
              Pertanyaan tentang layanan ini dapat disampaikan kepada admin 3dFunlearn lewat WhatsApp.
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
              className="hover:text-slate-200 transition-colors"
            >
              Kebijakan Privasi
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('/syarat')}
              className="text-emerald-400 font-semibold"
            >
              Syarat Layanan
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
