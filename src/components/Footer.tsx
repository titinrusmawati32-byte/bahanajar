import React, { useState } from 'react';
import { Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { RoutePath } from '../types';
import { audioService } from '../utils/audio';

interface FooterProps {
  onNavigate: (route: RoutePath) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [isAudioActive, setIsAudioActive] = useState(false);

  const handleToggleAudio = () => {
    const active = audioService.toggle();
    setIsAudioActive(active);
  };

  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#070b14] py-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Didukung</span>
          <a
            href="https://tutorflow.io"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-slate-200 hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            TutorFlow
          </a>
        </div>

        <div>
          <button
            onClick={handleToggleAudio}
            className={`px-3 py-1.5 rounded-full border flex items-center gap-2 transition-all ${
              isAudioActive
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-850 bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isAudioActive ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            <span>Suara: {isAudioActive ? 'Hidup' : 'Mati'}</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              audioService.playClick();
              onNavigate('/privasi');
            }}
            className="hover:text-slate-200 transition-colors"
          >
            Kebijakan Privasi
          </button>
          <span>·</span>
          <button
            onClick={() => {
              audioService.playClick();
              onNavigate('/syarat');
            }}
            className="hover:text-slate-200 transition-colors"
          >
            Syarat Layanan
          </button>
        </div>
      </div>
    </footer>
  );
};
