import React, { useState, useEffect } from 'react';
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Eye,
  Sliders,
  Layers,
  Info,
  BookOpen,
  CheckCircle2,
  FileCode,
  Download,
  Upload,
  AlertTriangle,
  Move
} from 'lucide-react';
import { Hotspot, ModuleInfo, AirwayStep, KeyFact, RoutePath } from '../types';
import {
  getStoredHotspots,
  saveStoredHotspots,
  getStoredModules,
  saveStoredModules,
  getStoredAirway,
  saveStoredAirway,
  getStoredFacts,
  saveStoredFacts,
  getStoredTrivia,
  saveStoredTrivia,
  resetAllCurriculumToDefault
} from '../data/curriculum';
import { audioService } from '../utils/audio';

interface AdminPageProps {
  onNavigate: (route: RoutePath) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'hotspots' | 'airway_facts' | 'modules' | 'backup'>('hotspots');
  
  // Data State
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [modules, setModules] = useState<ModuleInfo[]>([]);
  const [airway, setAirway] = useState<AirwayStep[]>([]);
  const [facts, setFacts] = useState<KeyFact[]>([]);
  const [trivia, setTrivia] = useState<string>('');
  
  // UI Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [jsonImportText, setJsonImportText] = useState<string>('');

  // Load from LocalStorage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setHotspots(getStoredHotspots());
    setModules(getStoredModules());
    setAirway(getStoredAirway());
    setFacts(getStoredFacts());
    setTrivia(getStoredTrivia());
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Save all changes
  const handleSaveAll = () => {
    audioService.playClick();
    saveStoredHotspots(hotspots);
    saveStoredModules(modules);
    saveStoredAirway(airway);
    saveStoredFacts(facts);
    saveStoredTrivia(trivia);
    showToast('✓ Semua perubahan materi berhasil disimpan!');
  };

  // Reset to default
  const handleResetDefault = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan semua data materi ke default kurikulum awal? Semua modifikasi akan terhapus.')) {
      audioService.playClick();
      resetAllCurriculumToDefault();
      loadData();
      showToast('Data materi berhasil direset ke pengaturan default.');
    }
  };

  // --- Hotspot Handlers ---
  const handleUpdateHotspot = (index: number, field: keyof Hotspot, value: any) => {
    const updated = [...hotspots];
    updated[index] = { ...updated[index], [field]: value };
    setHotspots(updated);
  };

  const handleUpdateHotspotCoord = (index: number, axisIdx: number, val: number) => {
    const updated = [...hotspots];
    const newPos = [...updated[index].position] as [number, number, number];
    newPos[axisIdx] = val;
    updated[index] = { ...updated[index], position: newPos };
    setHotspots(updated);
  };

  const handleAddHotspot = () => {
    audioService.playClick();
    const newId = hotspots.length > 0 ? Math.max(...hotspots.map(h => h.id)) + 1 : 1;
    const newHotspot: Hotspot = {
      id: newId,
      name: `Titik Belajar Baru ${newId}`,
      shortName: `Titik ${newId}`,
      category: 'Paru-paru Kanan',
      position: [0, 0, 0.5],
      description: 'Deskripsi anatomi atau struktur bagian ini...',
      function: 'Fungsi biologis dalam proses pernapasan...'
    };
    setHotspots([...hotspots, newHotspot]);
    showToast(`Titik belajar ${newId} berhasil ditambahkan.`);
  };

  const handleDeleteHotspot = (id: number) => {
    if (window.confirm(`Hapus titik belajar ID ${id}?`)) {
      audioService.playClick();
      setHotspots(hotspots.filter(h => h.id !== id));
      showToast(`Titik belajar ID ${id} dihapus.`);
    }
  };

  // --- Facts Handlers ---
  const handleUpdateFact = (index: number, field: keyof KeyFact, value: string) => {
    const updated = [...facts];
    updated[index] = { ...updated[index], [field]: value };
    setFacts(updated);
  };

  const handleAddFact = () => {
    audioService.playClick();
    setFacts([...facts, { label: 'Fakta Baru', value: 'Keterangan fakta...' }]);
  };

  const handleDeleteFact = (index: number) => {
    setFacts(facts.filter((_, i) => i !== index));
  };

  // --- Airway Handlers ---
  const handleUpdateAirwayStep = (index: number, field: keyof AirwayStep, value: any) => {
    const updated = [...airway];
    updated[index] = { ...updated[index], [field]: value };
    setAirway(updated);
  };

  // --- Modules Handlers ---
  const handleUpdateModule = (index: number, field: keyof ModuleInfo, value: any) => {
    const updated = [...modules];
    updated[index] = { ...updated[index], [field]: value };
    setModules(updated);
  };

  // --- Backup JSON export/import ---
  const exportAllJSON = () => {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      hotspots,
      modules,
      airway,
      facts,
      trivia
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `3dfunlearn-curriculum-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('File backup JSON kurikulum berhasil diunduh.');
  };

  const handleImportJSON = () => {
    try {
      const parsed = JSON.parse(jsonImportText);
      if (parsed.hotspots && Array.isArray(parsed.hotspots)) setHotspots(parsed.hotspots);
      if (parsed.modules && Array.isArray(parsed.modules)) setModules(parsed.modules);
      if (parsed.airway && Array.isArray(parsed.airway)) setAirway(parsed.airway);
      if (parsed.facts && Array.isArray(parsed.facts)) setFacts(parsed.facts);
      if (typeof parsed.trivia === 'string') setTrivia(parsed.trivia);
      showToast('Data kurikulum dari JSON berhasil diimpor!');
      setJsonImportText('');
    } catch (err) {
      alert('Format JSON tidak valid. Pastikan format teks JSON sesuai.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-emerald-500">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-400 font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-[#0b0f19]/95 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-0.5 shadow-lg">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <Sliders className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
                Panel Admin Materi 3D
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Editor Guru & Kurikulum
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Kelola titik anatomi 3D, koordinat pin, fakta kunci, jalur napas, dan katalog modul IPA.
              </p>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                audioService.playClick();
                onNavigate('/modul/sistem-pernapasan');
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Pratinjau Modul 3D</span>
            </button>

            <button
              onClick={handleResetDefault}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 flex items-center gap-1.5 transition-colors"
              title="Reset data ke bawaan Kurikulum"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Default</span>
            </button>

            <button
              onClick={handleSaveAll}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => {
              audioService.playClick();
              setActiveTab('hotspots');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'hotspots'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Move className="w-4 h-4" />
            <span>Titik Belajar 3D ({hotspots.length})</span>
          </button>

          <button
            onClick={() => {
              audioService.playClick();
              setActiveTab('airway_facts');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'airway_facts'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Fakta Kunci & Jalur Udara</span>
          </button>

          <button
            onClick={() => {
              audioService.playClick();
              setActiveTab('modules');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'modules'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Katalog 6 Modul IPA</span>
          </button>

          <button
            onClick={() => {
              audioService.playClick();
              setActiveTab('backup');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'backup'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Backup & Ekspor JSON</span>
          </button>
        </div>

        {/* TAB 1: Titik Belajar 3D (Hotspots) */}
        {activeTab === 'hotspots' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Move className="w-5 h-5 text-emerald-400" />
                  Daftar Titik Belajar Anatomi Paru-paru (3D Pins)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Setiap titik terhubung langsung ke pin interaktif pada model 3D. Koordinat X, Y, Z menentukan letak pin.
                </p>
              </div>

              <button
                onClick={handleAddHotspot}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Titik Pin Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {hotspots.map((hs, index) => (
                <div
                  key={hs.id}
                  className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs">
                        {hs.id}
                      </span>
                      <div>
                        <div className="text-sm font-bold text-white">{hs.name}</div>
                        <div className="text-xs text-slate-400 font-mono">ID: {hs.id} · Label tombol: "{hs.shortName}"</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteHotspot(hs.id)}
                      className="p-2 text-rose-400 hover:bg-rose-950/50 rounded-lg transition-colors"
                      title="Hapus titik ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Form fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Nama Lengkap (Anatomi)
                      </label>
                      <input
                        type="text"
                        value={hs.name}
                        onChange={(e) => handleUpdateHotspot(index, 'name', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Short Name */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Nama Singkat (Pill Tab)
                      </label>
                      <input
                        type="text"
                        value={hs.shortName}
                        onChange={(e) => handleUpdateHotspot(index, 'shortName', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Kategori Organ
                      </label>
                      <input
                        type="text"
                        value={hs.category}
                        onChange={(e) => handleUpdateHotspot(index, 'category', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* 3D Coordinates Position [X, Y, Z] */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Move className="w-3.5 h-3.5 text-cyan-400" />
                        Posisi Koordinat 3D [X, Y, Z]
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Rentang ideal: -3.0 s/d +3.0
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 mb-1 block">X (Kiri - Kanan)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={hs.position[0]}
                          onChange={(e) => handleUpdateHotspotCoord(index, 0, parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 mb-1 block">Y (Bawah - Atas)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={hs.position[1]}
                          onChange={(e) => handleUpdateHotspotCoord(index, 1, parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 mb-1 block">Z (Belakang - Depan)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={hs.position[2]}
                          onChange={(e) => handleUpdateHotspotCoord(index, 2, parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description & Biological Function */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Deskripsi Anatomi
                      </label>
                      <textarea
                        rows={3}
                        value={hs.description}
                        onChange={(e) => handleUpdateHotspot(index, 'description', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Fungsi Biologis
                      </label>
                      <textarea
                        rows={3}
                        value={hs.function}
                        onChange={(e) => handleUpdateHotspot(index, 'function', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Fakta Kunci, Jalur Udara & Trivia */}
        {activeTab === 'airway_facts' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Fakta Kunci & Trivia */}
            <div className="space-y-6">
              {/* Fakta Kunci Card */}
              <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Info className="w-4 h-4 text-emerald-400" />
                    Fakta Kunci Paru-paru (Statistik)
                  </h3>

                  <button
                    onClick={handleAddFact}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {facts.map((fact, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <div className="w-1/3">
                        <label className="text-[10px] text-slate-400 font-bold block mb-0.5">Label</label>
                        <input
                          type="text"
                          value={fact.label}
                          onChange={(e) => handleUpdateFact(idx, 'label', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="flex-1">
                        <label className="text-[10px] text-slate-400 font-bold block mb-0.5">Nilai / Penjelasan</label>
                        <input
                          type="text"
                          value={fact.value}
                          onChange={(e) => handleUpdateFact(idx, 'value', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <button
                        onClick={() => handleDeleteFact(idx)}
                        className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded-lg mt-3"
                        title="Hapus fakta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trivia "Tahukah Kamu?" */}
              <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Kutipan "Tahukah Kamu?" (Fun Trivia)
                </h3>
                <p className="text-xs text-slate-400">
                  Teks trivia motivasi sains yang tampil di pojok kanan bawah modul pembelajaran.
                </p>
                <textarea
                  rows={3}
                  value={trivia}
                  onChange={(e) => setTrivia(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-amber-200 focus:outline-none focus:border-amber-400 leading-relaxed"
                />
              </div>
            </div>

            {/* Right: Jalur Udara (7 Tahapan Pernapasan) */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Alur Jalur Udara Manusia
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Centang bagian yang termasuk dalam modul eksplorasi 3D ini.
                </p>
              </div>

              <div className="space-y-2.5">
                {airway.map((item, idx) => (
                  <div
                    key={item.step}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-xs">
                        {item.step}
                      </span>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleUpdateAirwayStep(idx, 'name', e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white font-medium focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={item.inModule}
                        onChange={(e) => handleUpdateAirwayStep(idx, 'inModule', e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-0 focus:ring-offset-0"
                      />
                      <span className="text-xs text-slate-300 font-medium">Ada di modul 3D</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Katalog 6 Modul IPA */}
        {activeTab === 'modules' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                Manajemen 6 Modul IPA Kelas 8 (Kurikulum Merdeka)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Atur ketersediaan status, nama spesimen, dan ringkasan materi untuk katalog modul siswa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((mod, index) => (
                <div
                  key={mod.id}
                  className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-400 tracking-wider">
                        {mod.number}
                      </span>
                      <select
                        value={mod.status}
                        onChange={(e) => handleUpdateModule(index, 'status', e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-[11px] font-bold text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Tersedia">Tersedia (Bisa Diakses)</option>
                        <option value="Pratinjau">Pratinjau</option>
                        <option value="Segera Hadir">Segera Hadir</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Judul Modul
                      </label>
                      <input
                        type="text"
                        value={mod.title}
                        onChange={(e) => handleUpdateModule(index, 'title', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Spesimen Biologis
                      </label>
                      <input
                        type="text"
                        value={mod.specimen}
                        onChange={(e) => handleUpdateModule(index, 'specimen', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Deskripsi Singkat
                      </label>
                      <textarea
                        rows={2}
                        value={mod.description}
                        onChange={(e) => handleUpdateModule(index, 'description', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>{mod.hotspotsCount} Titik Hotspot</span>
                    <span className="font-semibold text-emerald-400">
                      {mod.isFree ? 'Gratis' : 'Pro'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Backup & Ekspor JSON */}
        {activeTab === 'backup' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export Card */}
            <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Ekspor Data Kurikulum (.JSON)</h3>
                  <p className="text-xs text-slate-400">Unduh seluruh database materi 3D Anda untuk cadangan atau dibagikan ke kelas lain.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono space-y-1">
                <div>• {hotspots.length} Titik Hotspot 3D</div>
                <div>• {facts.length} Fakta Kunci Sains</div>
                <div>• {airway.length} Tahap Jalur Napas</div>
                <div>• {modules.length} Katalog Modul IPA</div>
              </div>

              <button
                onClick={exportAllJSON}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File Cadangan JSON</span>
              </button>
            </div>

            {/* Import Card */}
            <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Impor Materi dari Teks JSON</h3>
                  <p className="text-xs text-slate-400">Tempelkan teks JSON hasil ekspor untuk memuat kembali struktur kurikulum.</p>
                </div>
              </div>

              <textarea
                rows={4}
                placeholder="Tempel format JSON di sini..."
                value={jsonImportText}
                onChange={(e) => setJsonImportText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-cyan-200 font-mono focus:outline-none focus:border-cyan-400"
              />

              <button
                onClick={handleImportJSON}
                disabled={!jsonImportText.trim()}
                className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  jsonImportText.trim()
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Terapkan Data JSON</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
