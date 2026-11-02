import React, { useState, useEffect } from 'react';
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
  Sliders,
  Sun,
  Moon,
  Check,
} from 'lucide-react';
import { RoutePath, Hotspot, AirwayStep, KeyFact } from '../types';
import {
  MODULE_01_DATA,
  getStoredHotspots,
  getStoredAirway,
  getStoredFacts,
  getStoredTrivia,
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
  const [isStudioTheme, setIsStudioTheme] = useState<boolean>(true); // Medical Studio Mode matching Image 2

  // Dynamic content loaded from localStorage / defaults
  const [hotspots, setHotspots] = useState<Hotspot[]>(getStoredHotspots());
  const [airway, setAirway] = useState<AirwayStep[]>(getStoredAirway());
  const [facts, setFacts] = useState<KeyFact[]>(getStoredFacts());
  const [trivia, setTrivia] = useState<string>(getStoredTrivia());

  // Reload data on mount or when returning from Admin
  useEffect(() => {
    setHotspots(getStoredHotspots());
    setAirway(getStoredAirway());
    setFacts(getStoredFacts());
    setTrivia(getStoredTrivia());
  }, []);

  const activeHotspot = hotspots.find((h) => h.id === selectedHotspotId) || hotspots[0];

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors duration-300 selection:bg-emerald-500 selection:text-white ${
        isStudioTheme ? 'bg-[#f8fafc] text-slate-800' : 'bg-[#070b14] text-slate-100'
      }`}
    >
      {/* Module Top Navigation Bar */}
      <header
        className={`border-b px-4 py-2.5 sticky top-0 z-30 backdrop-blur-md transition-colors ${
          isStudioTheme ? 'bg-white/95 border-slate-200/90 shadow-sm' : 'bg-[#0b0f19] border-slate-800/80'
        }`}
      >
        <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Back to catalog & Module title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                audioService.playClick();
                onOpenCatalog();
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                isStudioTheme
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Katalog</span>
            </button>

            <div
              onClick={() => {
                audioService.playClick();
                onNavigate('/');
              }}
              className="font-extrabold text-sm tracking-tight cursor-pointer hover:text-emerald-500 transition-colors"
            >
              <span className={isStudioTheme ? 'text-slate-900' : 'text-white'}>3d</span>
              <span className="text-emerald-500">Funlearn</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-300 dark:border-slate-700">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/30">
                Pratinjau · materi terverifikasi
              </span>
              <span className="text-xs text-slate-500">
                Belajar sains lewat 3D · didukung <span className="font-semibold text-slate-700 dark:text-slate-200">TutorFlow</span>
              </span>
            </div>
          </div>

          {/* Center Breadcrumbs matching Image 2 */}
          <div
            className={`hidden lg:flex items-center gap-2 text-xs px-3.5 py-1 rounded-full border transition-colors ${
              isStudioTheme ? 'bg-slate-100/80 border-slate-200 text-slate-600' : 'bg-slate-900/60 border-slate-800 text-slate-400'
            }`}
          >
            <span>Biologi</span>
            <span>›</span>
            <span>Sistem Pernapasan</span>
            <span>›</span>
            <span className="text-emerald-600 font-bold">Paru-paru</span>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle (Studio / Dark Lab) */}
            <button
              onClick={() => {
                audioService.playClick();
                setIsStudioTheme(!isStudioTheme);
              }}
              className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                isStudioTheme
                  ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
              title="Ganti Mode Tampilan (Studio Terang / Lab Gelap)"
            >
              {isStudioTheme ? <Moon className="w-4 h-4 text-slate-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Quick Admin Access Button */}
            <button
              onClick={() => {
                audioService.playClick();
                onNavigate('/admin');
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 transition-colors"
              title="Edit materi pembelajaran di Panel Admin"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden md:inline">Edit Materi</span>
            </button>

            {/* Bagikan */}
            <button
              onClick={() => {
                audioService.playClick();
                setIsShareModalOpen(true);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                isStudioTheme
                  ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title="Bagikan ke murid lewat QR"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Bagikan ke murid</span>
              <span className="inline sm:hidden">Bagikan</span>
            </button>

            {/* Masukan via WhatsApp */}
            <a
              href={WA_FEEDBACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                isStudioTheme
                  ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title="Kirim masukan lewat WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden md:inline">Kirim masukan</span>
            </a>

            {/* Presentation Mode Toggle */}
            <button
              onClick={() => {
                audioService.playClick();
                setIsPresentationMode(!isPresentationMode);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                isPresentationMode
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                  : isStudioTheme
                  ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title="Beralih ke mode proyektor kelas"
            >
              <Tv className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Mode Presentasi</span>
            </button>

            {/* Masuk */}
            <button
              onClick={() => {
                audioService.playClick();
                onNavigate('/masuk');
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </button>

            <span
              className={`px-2 py-1 rounded text-[11px] font-bold border ${
                isStudioTheme ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              ID
            </span>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout (Sidebar + 3D Viewport + Details Drawer) */}
      <div className="flex-1 max-w-[1800px] w-full mx-auto flex flex-col xl:flex-row overflow-hidden relative">
        {/* Left Column: Module Index & Learning Points */}
        <aside
          className={`w-full xl:w-80 border-r p-5 flex flex-col justify-between shrink-0 overflow-y-auto transition-colors ${
            isStudioTheme ? 'bg-white border-slate-200' : 'bg-[#0b0f19] border-slate-800'
          } ${isPresentationMode ? 'hidden' : 'block'}`}
        >
          <div className="space-y-6">
            {/* Module Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-extrabold tracking-wider text-emerald-600 uppercase">
                  {MODULE_01_DATA.number}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-xs text-slate-500 font-medium">IPA Kelas 8</span>
              </div>
              <h1 className={`text-2xl font-black ${isStudioTheme ? 'text-slate-900' : 'text-white'}`}>
                {MODULE_01_DATA.title}
              </h1>
              <p className="text-xs text-slate-500 mt-1">{MODULE_01_DATA.category}</p>
            </div>

            {/* Bagian Organ */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                <span>BAGIAN</span>
                <span className="text-emerald-600 lowercase font-medium">{hotspots.length} titik belajar</span>
              </div>

              <div className="space-y-1.5">
                {hotspots.map((hs) => {
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
                          ? isStudioTheme
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-sm'
                            : 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-md'
                          : isStudioTheme
                          ? 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                            isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
                          }`}
                        >
                          {hs.id}
                        </span>
                        <span>{hs.name}</span>
                      </div>
                      <span className="text-slate-400 text-xs">›</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Aktivitas Belajar */}
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                AKTIVITAS
              </div>

              <div className="space-y-2">
                {/* Animasi Napas */}
                <button
                  onClick={() => {
                    audioService.playClick();
                    setIsDivingToAlveolus(false);
                    setIsBreathingActive(!isBreathingActive);
                  }}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border ${
                    isBreathingActive && !isDivingToAlveolus
                      ? isStudioTheme
                        ? 'bg-cyan-50 border-cyan-400 text-cyan-950 shadow-sm'
                        : 'bg-cyan-500/15 border-cyan-500/50 text-white shadow-md'
                      : isStudioTheme
                      ? 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Wind className={`w-4 h-4 ${isBreathingActive ? 'text-cyan-500 animate-pulse' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-bold">Animasi Napas</div>
                      <div className="text-[11px] font-normal text-slate-500">Lihat diafragma bekerja</div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isBreathingActive
                        ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isBreathingActive ? 'Aktif' : 'Mati'}
                  </span>
                </button>

                {/* Menyelam ke Alveolus */}
                <button
                  onClick={() => {
                    audioService.playClick();
                    setIsDivingToAlveolus(!isDivingToAlveolus);
                  }}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border ${
                    isDivingToAlveolus
                      ? isStudioTheme
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-950 shadow-sm'
                        : 'bg-indigo-500/20 border-indigo-500/50 text-white shadow-lg'
                      : isStudioTheme
                      ? 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <div>
                      <div className="font-bold">Menyelam ke alveolus</div>
                      <div className="text-[11px] font-normal text-slate-500">Zoom ke kantong udara mikroskopis</div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isDivingToAlveolus ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isDivingToAlveolus ? 'Di dalam' : 'Buka'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Verified tag at bottom of sidebar */}
          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Materi sesuai Kurikulum Merdeka SMP Kelas 8 Bab Struktur & Fungsi Tubuh.</span>
          </div>
        </aside>

        {/* Central 3D Canvas Area */}
        <main className="flex-1 relative flex flex-col justify-between overflow-hidden">
          {isDivingToAlveolus ? (
            <AlveolusCanvas3D onBackToLungs={() => setIsDivingToAlveolus(false)} />
          ) : (
            <LungCanvas3D
              selectedHotspotId={selectedHotspotId}
              onSelectHotspot={(id) => setSelectedHotspotId(id)}
              isBreathingActive={isBreathingActive}
              onDiveToAlveolus={() => setIsDivingToAlveolus(true)}
              hotspots={hotspots}
            />
          )}

          {/* Quick Jump Hotspot Pills at bottom of 3D Canvas */}
          {!isDivingToAlveolus && (
            <div className="absolute bottom-12 left-0 right-0 z-20 flex justify-center px-4 pointer-events-none">
              <div
                className={`backdrop-blur-md p-1.5 rounded-2xl border shadow-xl flex flex-wrap items-center justify-center gap-1.5 pointer-events-auto max-w-full overflow-x-auto ${
                  isStudioTheme ? 'bg-white/90 border-slate-200 text-slate-700' : 'bg-slate-900/90 border-slate-700 text-slate-300'
                }`}
              >
                {hotspots.map((hs) => {
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
                          ? 'bg-emerald-500 text-white font-bold shadow'
                          : isStudioTheme
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-slate-800/80 hover:bg-slate-750 text-slate-300'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
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
                      ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-200 text-slate-600'
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
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-700 dark:text-indigo-300 border border-indigo-500/40 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Menyelam ke alveolus</span>
                </button>
              </div>
            </div>
          )}

          {/* Presentation Mode Fullscreen Subtitle Overlay */}
          <PresentationOverlay
            isActive={isPresentationMode}
            onExit={() => setIsPresentationMode(false)}
            activeHotspotName={activeHotspot?.name}
            activeHotspotDesc={activeHotspot?.description}
          />
        </main>

        {/* Right Column: Organ Facts, Airway, and Educational Context */}
        <aside
          className={`w-full xl:w-96 border-l p-6 overflow-y-auto space-y-6 transition-colors ${
            isStudioTheme ? 'bg-white border-slate-200' : 'bg-[#0b0f19] border-slate-800'
          } ${isPresentationMode ? 'hidden' : 'block'}`}
        >
          {/* Active Organ / Hotspot Information Card */}
          <div
            className={`rounded-2xl p-5 border shadow-sm space-y-3 transition-colors ${
              isStudioTheme ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
              ORGAN · SISTEM PERNAPASAN
            </div>
            <h2 className={`text-2xl font-black ${isStudioTheme ? 'text-slate-900 font-serif' : 'text-white'}`}>
              Paru-paru
            </h2>
            <div className="text-sm font-semibold text-emerald-600">Pabrik oksigen tubuhmu</div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Organ utama pernapasan. Tugasnya memasukkan oksigen ke darah dan membuang karbon dioksida.
            </p>

            {/* If a hotspot is clicked, show its specific anatomical breakdown */}
            {activeHotspot && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1.5 animate-in fade-in duration-150">
                <div className="text-xs font-bold flex items-center gap-1.5 text-slate-800 dark:text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {activeHotspot.name}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{activeHotspot.description}</p>
                <div
                  className={`p-2.5 rounded-lg border text-[11px] ${
                    isStudioTheme
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-emerald-950/30 border-emerald-500/20 text-emerald-200'
                  }`}
                >
                  <strong>Fungsi:</strong> {activeHotspot.function}
                </div>
              </div>
            )}
          </div>

          {/* Key Facts (Fakta Kunci) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-500" />
              FAKTA KUNCI
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {facts.map((fact, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border ${
                    isStudioTheme ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800/80'
                  }`}
                >
                  <div className="text-[11px] text-slate-500">{fact.label}</div>
                  <div className={`text-xs font-bold mt-1 ${isStudioTheme ? 'text-slate-900' : 'text-white'}`}>
                    {fact.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Jalur Udara (Airway Steps with visual flow matching Image 2) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-500" />
              JALUR UDARA
            </h3>
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {airway.map((item, idx) => (
                <div key={item.step} className="flex items-center gap-1.5">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border flex items-center gap-1 ${
                      item.inModule
                        ? isStudioTheme
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : isStudioTheme
                        ? 'bg-slate-100 text-slate-600 border-slate-200'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {item.inModule && <Check className="w-3 h-3 text-emerald-500" />}
                    <span>{item.name}</span>
                  </span>
                  {idx < airway.length - 1 && <span className="text-slate-400 text-xs">›</span>}
                </div>
              ))}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>ada di modul ini</span>
            </div>
          </div>

          {/* Did You Know? (Tahukah kamu? Matching Image 2) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/70 border border-amber-200 text-amber-950 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Tahukah kamu?</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed font-serif">
              {trivia}
            </p>
          </div>

          {/* Curriculum & Interactive status matching Image 2 */}
          <div
            className={`p-4 rounded-2xl border space-y-3 ${
              isStudioTheme ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}
          >
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              KURIKULUM · IPA KELAS 8 · STRUKTUR & FUNGSI TUBUH
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  audioService.playClick();
                  setIsBreathingActive(!isBreathingActive);
                }}
                className={`p-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-colors ${
                  isStudioTheme
                    ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800 shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                }`}
              >
                <Wind className="w-3.5 h-3.5 text-cyan-500" />
                <span>Animasi Napas</span>
              </button>

              <div
                className={`p-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 ${
                  isStudioTheme ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-slate-900/60 border-slate-800 text-slate-500'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Kuis (Segera)</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url="https://3dfunlearn-two.vercel.app/modul/sistem-pernapasan"
      />
    </div>
  );
};
