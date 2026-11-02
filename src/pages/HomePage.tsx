import React, { useState } from 'react';
import { Sparkles, ArrowRight, RotateCw, Layers, ZoomIn, QrCode, CheckCircle, Clock } from 'lucide-react';
import { RoutePath } from '../types';
import { getStoredModules } from '../data/curriculum';
import { LungCanvas3D } from '../components/LungCanvas3D';
import { audioService } from '../utils/audio';

interface HomePageProps {
  onNavigate: (route: RoutePath) => void;
  onOpenCatalog: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [selectedHotspot, setSelectedHotspot] = useState<number | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="w-full lg:w-1/2 text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                MEDIA BELAJAR 3D UNTUK KELAS INDONESIA
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                Belajar tidak berhenti di halaman buku.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                Materi pelajaran dalam 3D yang bisa diputar, dibuka, dan diselami. Tayangkan di layar kelas — murid ikut dari HP lewat QR, tanpa akun dan tanpa instal.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    audioService.playClick();
                    onNavigate('/modul/sistem-pernapasan');
                  }}
                  className="px-6 py-3.5 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-xl hover:shadow-emerald-500/25 flex items-center gap-2 active:scale-95"
                >
                  <span>Coba modul gratis</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    audioService.playClick();
                    document.getElementById('cara-kerja')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-all"
                >
                  Lihat cara kerjanya
                </button>
              </div>

              <div className="pt-4 flex items-center gap-6 text-xs text-slate-400 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Kurikulum Merdeka</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Tanpa Install App</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Akses HP & Layar</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative">
              <div className="relative w-full h-[460px] sm:h-[520px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-gradient-to-b from-slate-900 to-[#070b14]">
                <LungCanvas3D
                  selectedHotspotId={selectedHotspot}
                  onSelectHotspot={(id) => setSelectedHotspot(id)}
                  isBreathingActive={true}
                />

                <div className="absolute top-4 right-4 z-20 pointer-events-none">
                  <span className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-[11px] font-medium text-slate-300 shadow-lg">
                    Gulir untuk masuk ke layar
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cara Kerja Section */}
      <section id="cara-kerja" className="py-24 bg-[#080d1a] border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">
              CARA KERJA INTERAKTIF
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Bawa sains hidup di depan mata murid.
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <RotateCw className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Putar.</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Lihat bentuknya dari segala arah. Putar organ secara 360 derajat untuk mengamati struktur anatomi secara utuh.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Buka.</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Buka bagian dalamnya, satu per satu. Pisahkan lobus paru-paru, trakea, hingga percabangan bronkus.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ZoomIn className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Selami.</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Masuk ke bagian yang tidak terlihat dari luar. Zoom ke kantong mikroskopis alveoli dan amati pertukaran O₂ serta CO₂.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <QrCode className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Murid ikut dari HP lewat QR.</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Tanpa akun, tanpa instal — cukup scan dari layar kelas. Setiap murid bisa memutar dan mengeksplorasi sendiri di genggaman.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dimulai Dari IPA Section */}
      <section id="modul" className="py-24 bg-[#0b0f19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
                KURIKULUM KELAS 8
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Dimulai dari IPA.
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
                6 modul IPA Kelas 8 siap dipakai hari ini. Menyusul fisika, matematika, bumi, budaya, dan teknik — semua dalam satu langganan.
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <button
                onClick={() => {
                  audioService.playClick();
                  onNavigate('/masuk');
                }}
                className="text-xs sm:text-sm text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5"
              >
                <span>Lihat penawaran Early Supporter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getStoredModules().map((mod) => {
              const isAvailable = mod.status === 'Tersedia';

              return (
                <div
                  key={mod.id}
                  onClick={() => {
                    if (isAvailable) {
                      audioService.playClick();
                      onNavigate('/modul/sistem-pernapasan');
                    }
                  }}
                  className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                    isAvailable
                      ? 'bg-slate-900/90 border-slate-700/80 hover:border-emerald-500/60 cursor-pointer shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1'
                      : 'bg-slate-900/40 border-slate-800/70 opacity-80 cursor-default'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold tracking-wider text-slate-400">
                        {mod.number}
                      </span>
                      {isAvailable ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          COBA GRATIS
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Segera Hadir
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{mod.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                      {mod.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-slate-300 font-medium">Spesimen: {mod.specimen}</span>
                    <span>{mod.hotspotsCount} Titik Belajar</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                Mulai gunakan 3dFunlearn di kelas Anda
              </h3>
              <p className="text-sm text-slate-300">
                Coba Modul Sistem Pernapasan tanpa perlu login, atau masuk untuk membuka seluruh materi.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <button
                onClick={() => {
                  audioService.playClick();
                  onNavigate('/modul/sistem-pernapasan');
                }}
                className="px-5 py-3 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg active:scale-95"
              >
                Coba modul gratis
              </button>

              <button
                onClick={() => {
                  audioService.playClick();
                  onNavigate('/masuk');
                }}
                className="px-5 py-3 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 transition-all"
              >
                Masuk dengan Google
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
