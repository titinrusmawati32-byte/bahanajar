import React from 'react';
import { X, Tv } from 'lucide-react';
import { audioService } from '../utils/audio';

interface PresentationOverlayProps {
  isActive: boolean;
  onExit: () => void;
  activeHotspotName?: string;
  activeHotspotDesc?: string;
}

export const PresentationOverlay: React.FC<PresentationOverlayProps> = ({
  isActive,
  onExit,
  activeHotspotName,
  activeHotspotDesc,
}) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-40 pointer-events-none flex flex-col justify-between p-6">
      <div className="flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-emerald-500/30 shadow-2xl">
          <Tv className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold text-white tracking-wide">
            Mode Presentasi Layar Kelas
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
            Proyektor Aktif
          </span>
        </div>

        <button
          onClick={() => {
            audioService.playClick();
            onExit();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 shadow-xl transition-all pointer-events-auto text-xs font-semibold"
        >
          <X className="w-4 h-4" />
          <span>Keluar Mode Presentasi</span>
        </button>
      </div>

      {activeHotspotName && (
        <div className="flex justify-center pointer-events-none mb-10">
          <div className="bg-slate-950/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-700/80 max-w-2xl text-center shadow-2xl pointer-events-auto">
            <h4 className="text-lg font-bold text-emerald-400 mb-1">{activeHotspotName}</h4>
            <p className="text-sm text-slate-200 leading-relaxed">{activeHotspotDesc}</p>
          </div>
        </div>
      )}
    </div>
  );
};
