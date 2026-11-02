import React, { useState } from 'react';
import {
  ChevronLeft,
  Share2,
  MessageSquare,
  LogIn,
  Tv,
  Sparkles,
  Wind,
  Layers,
  Info,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { RoutePath } from '../types';
import {
  MODULE_01_DATA,
  HOTSPOTS_DATA,
  JALUR_UDARA,
  FAKTA_KUNCI,
  WA_FEEDBACK_URL,
} from '../data/curriculum';
import { LungCanvas3D } from '../components/LungCanvas3D';
import { AlveolusCanvas3D } from '../components/AlveolusCanvas3D';
import { ShareModal } from '../components/ShareModal';
import { PresentationOverlay } from '../components/PresentationOverlay';
import { audioService } from '../utils/audio';

interface ModulePageProps {
  onNavigate: (route: RoutePath) => void;
  onOpenCatalog: () => void;
}

export const ModulePage: React.FC<ModulePageProps> = ({ onNavigate, onOpenCatalog }) => {
  const [selectedHotspotId, setSelectedHotspotId] = useState<number | null>(1);
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(true);
  const [isDivingToAlveolus, setIsDivingToAlveolus] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);

  const activeHotspot = HOTSPOTS_DATA.find((h) => h.id === selectedHotspotId);

  return (
    <div className="flex flex-col min-h-screen bg-[#070b14] text-slate-100 selection:bg-emerald-500">
      <header className="border-b border-slate-800/80 bg-[#0b0f19] px-4 py-2.5">
        <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                audioService.playClick();
                onOpenCatalog();
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Katalog</span>
            </button>

            <div
              onClick={() => {
                audioService.playClick();
                onNavigate('/');
              }}
              className="font-extrabold text-sm tracking-tight text-white cursor-pointer hover:text-emerald-400 transition-colors"
            >
              3d<span className="text-emerald-400">Funlearn</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-700">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Pratinjau · materi sedang diverifikasi
              </span>
              <span className="text-xs text-slate-400">
                Belajar sains lewat 3D · didukung <span className="text-slate-200 font-medium">TutorFlow</span>
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-800">
            <span>1. Biologi</span>
            <span>›</span>
            <span className="text-slate-200">2. Sistem Pernapasan</span>
            <span>›</span>
            <span className="text-emerald-400 font-medium">3. Paru-paru</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                audioService.playClick();
                setIsShareModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors border border-slate-700"
              title="Bagikan ke murid lewat QR"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Bagikan ke murid</span>
              <span className="inline sm:hidden">Bagikan</span>
            </button>

            <a
              href={WA_FEEDBACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors border border-slate-700"
              title="Kirim masukan lewat WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Masukan</span>
            </a>

            <button
              onClick={() => {
                audioService.playClick();
                setIsPresentationMode(!isPresentationMode);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                isPresentationMode
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title="Beralih ke mode proyektor kelas"
            >
              <Tv className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Mode Presentasi</span>
            </button>

            <button
              onClick={() => {
                audioService.playClick();
                onNavigate('/masuk');
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 transition-all shadow-md"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </button>

            <span className="px-2 py-1 rounded bg-slate-800 text-[11px] font-bold text-slate-400 border border-slate-700">
              ID
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-[1800px] w-full mx-auto flex flex-col xl:flex-row overflow-hidden relative">
        <aside
          className={`w-full xl:w-80 bg-[#0b0f19] border-r border-slate-800 p-5 flex flex-col justify-between shrink-0 overflow-y-auto ${
            isPresentationMode ? 'hidden' : 'block'
          }`}
        >
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-extrabold tracking-wider text-emerald-400 uppercase">
                  {MODULE_01_DATA.number}
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-slate-400 font-medium">IPA Kelas 8</span>
              </div>
              <h1 className="text-2xl font-black text-white">{MODULE_01_DATA.title}</h1>
              <p className="text-xs text-slate-400 mt-1">{MODULE_01_DATA.category}</p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                <span>BAGIAN</span>
                <span className="text-emerald-400 lowercase font-normal">{MODULE_01_DATA.hotspotsCount} titik belajar</span>
              </div>

              <div className="space-y-1.5">
                {HOTSPOTS_DATA.map((hs) => {
                  const isSelected = selectedHotspotId === hs.id && !isDivingToAlveolus;

                  return (
                    <button
                      key={hs.id}
                      onClick={() => {
                        audioService.playClick();
                        setIsDivingToAlveolus(false);
                        setSelectedHotspotId(hs.id);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border ${
                        isSelected
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-md'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                            isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {hs.id}
                        </span>
                        <span>{hs.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                AKTIVITAS
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    audioService.playClick();
                    setIsDivingToAlveolus(false);
                    setIsBreathingActive(!isBreathingActive);
                  }}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border ${
                    isBreathingActive && !isDivingToAlveolus
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Wind className={`w-4 h-4 ${isBreathingActive ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-bold">Animasi Napas</div>
                      <div className="text-[11px] font-normal text-slate-400">Lihat diafragma bekerja</div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isBreathingActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isBreathingActive ? 'Aktif' : 'Mati'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    audioService.playClick();
                    setIsDivingToAlveolus(!isDivingToAlveolus);
                  }}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border ${
                    isDivingToAlveolus
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-white shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <div>
                      <div className="font-bold">Menyelam ke alveolus</div>
                      <div className="text-[11px] font-normal text-slate-400">Zoom ke kantong udara mikroskopis</div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isDivingToAlveolus ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isDivingToAlveolus ? 'Di dalam' : 'Buka'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Materi sesuai Kurikulum Merdeka SMP Kelas 8 Bab Struktur & Fungsi Tubuh.</span>
          </div>
        </aside>

        <main className="flex-1 relative flex flex-col justify-between overflow-hidden bg-[#070b14]">
          {isDivingToAlveolus ? (
            <AlveolusCanvas3D onBackToLungs={() => setIsDivingToAlveolus(false)} />
          ) : (
            <LungCanvas3D
              selectedHotspotId={selectedHotspotId}
              onSelectHotspot={(id) => setSelectedHotspotId(id)}
              isBreathingActive={isBreathingActive}
              onDiveToAlveolus={() => setIsDivingToAlveolus(true)}
            />
          )}

          {!isDivingToAlveolus && (
            <div className="absolute bottom-12 left-0 right-0 z-20 flex justify-center px-4 pointer-events-none">
              <div className="bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 shadow-2xl flex flex-wrap items-center justify-center gap-1.5 pointer-events-auto max-w-full overflow-x-auto">
                {HOTSPOTS_DATA.map((hs) => {
                  const isSelected = selectedHotspotId === hs.id;
                  return (
                    <button
                      key={hs.id}
                      onClick={() => {
                        audioService.playClick();
                        setSelectedHotspotId(hs.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                          : 'bg-slate-800/80 hover:bg-slate-750 text-slate-300'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center text-[10px]">
                        {hs.id}
                      </span>
                      <span>{hs.shortName}</span>
                    </button>
                  );
                })}

                <button
                  onClick={() => {
                    audioService.playClick();
                    setIsBreathingActive(!isBreathingActive);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isBreathingActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-800/80 text-slate-400'
                  }`}
                >
                  <Wind className="w-3.5 h-3.5" />
                  <span>Animasi Napas</span>
                </button>

                <button
                  onClick={() => {
                    audioService.playClick();
                    setIsDivingToAlveolus(true);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Menyelam ke alveolus</span>
                </button>
              </div>
            </div>
          )}

          <PresentationOverlay
            isActive={isPresentationMode}
            onExit={() => setIsPresentationMode(false)}
            activeHotspotName={activeHotspot?.name}
            activeHotspotDesc={activeHotspot?.description}
          />
        </main>

        <aside
          className={`w-full xl:w-96 bg-[#0b0f19] border-l border-slate-800 p-6 overflow-y-auto space-y-6 ${
            isPresentationMode ? 'hidden' : 'block'
          }`}
        >
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              ORGAN · SISTEM PERNAPASAN
            </div>
            <h2 className="text-2xl font-black text-white">Paru-paru</h2>
            <div className="text-sm font-semibold text-emerald-300">Pabrik oksigen tubuhmu</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Organ utama pernapasan. Tugasnya memasukkan oksigen ke darah dan membuang karbon dioksida.
            </p>

            {activeHotspot && (
              <div className="pt-3 border-t border-slate-800 space-y-1.5 animate-in fade-in duration-150">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  {activeHotspot.name}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{activeHotspot.description}</p>
                <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-emerald-200">
                  <strong>Fungsi:</strong> {activeHotspot.function}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              FAKTA KUNCI
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {FAKTA_KUNCI.map((fact, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
                  <div className="text-[11px] text-slate-400">{fact.label}</div>
                  <div className="text-xs font-bold text-white mt-1">{fact.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              JALUR UDARA
            </h3>
            <div className="space-y-1.5">
              {JALUR_UDARA.map((item) => (
                <div
                  key={item.step}
                  className={`px-3 py-2 rounded-xl text-xs flex items-center justify-between border ${
                    item.inModule
                      ? 'bg-slate-900/90 border-emerald-500/30 text-white'
                      : 'bg-slate-900/40 border-slate-800/60 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                      {item.step}
                    </span>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.inModule && (
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      ada di modul ini
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Lightbulb className="w-4 h-4" />
              <span>Tahukah kamu?</span>
            </div>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              Kalau seluruh dinding alveolus dibentangkan, luasnya sekitar <strong>70 m²</strong> — kira-kira seluas lantai ruang kelasmu!
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>Kuis Interaktif</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
              Segera hadir
            </span>
          </div>
        </aside>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url="https://3dfunlearn-two.vercel.app/modul/sistem-pernapasan"
      />
    </div>
  );
};
