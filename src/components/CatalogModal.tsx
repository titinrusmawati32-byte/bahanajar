import React from 'react';
import { X, BookOpen, CheckCircle, Clock } from 'lucide-react';
import { ALL_MODULES } from '../data/curriculum';
import { audioService } from '../utils/audio';

interface CatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (id: string) => void;
}

export const CatalogModal: React.FC<CatalogModalProps> = ({ isOpen, onClose, onSelectModule }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              Kurikulum Merdeka · IPA Kelas 8
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              Katalog Modul 3D
            </h2>
          </div>

          <button
            onClick={() => {
              audioService.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {ALL_MODULES.map((mod) => {
            const isAvailable = mod.status === 'Tersedia';

            return (
              <div
                key={mod.id}
                onClick={() => {
                  if (isAvailable) {
                    audioService.playClick();
                    onSelectModule(mod.id);
                    onClose();
                  }
                }}
                className={`p-5 rounded-xl border text-left transition-all ${
                  isAvailable
                    ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 hover:border-emerald-500/50 cursor-pointer shadow-lg hover:shadow-emerald-500/10'
                    : 'bg-slate-900/60 border-slate-800/80 opacity-75 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold tracking-wider text-slate-400">
                    {mod.number}
                  </span>
                  {isAvailable ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      GRATIS
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Segera Hadir
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white mb-1">{mod.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">{mod.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 text-[11px] text-slate-400">
                  <span>Spesimen: {mod.specimen}</span>
                  <span>{mod.hotspotsCount} Titik Belajar</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Menyusul: Fisika, Matematika, Kebumian & Teknik.</span>
          <span className="text-emerald-400 font-medium">Didukung TutorFlow</span>
        </div>
      </div>
    </div>
  );
};
