import React, { useState } from 'react';
import { X, Copy, Check, QrCode, Smartphone } from 'lucide-react';
import { audioService } from '../utils/audio';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, url }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    audioService.playClick();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100">
        <button
          onClick={() => {
            audioService.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Bagikan ke Murid</h3>
            <p className="text-xs text-slate-400">Murid ikut langsung dari HP tanpa akun & tanpa instal</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center my-4 shadow-inner">
          <svg className="w-52 h-52 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
            <rect x="10" y="10" width="22" height="22" rx="4" fill="#0f172a" />
            <rect x="14" y="14" width="14" height="14" rx="2" fill="#ffffff" />
            <rect x="17" y="17" width="8" height="8" rx="1" fill="#10b981" />

            <rect x="68" y="10" width="22" height="22" rx="4" fill="#0f172a" />
            <rect x="72" y="14" width="14" height="14" rx="2" fill="#ffffff" />
            <rect x="75" y="17" width="8" height="8" rx="1" fill="#10b981" />

            <rect x="10" y="68" width="22" height="22" rx="4" fill="#0f172a" />
            <rect x="14" y="72" width="14" height="14" rx="2" fill="#ffffff" />
            <rect x="17" y="75" width="8" height="8" rx="1" fill="#10b981" />

            <rect x="36" y="12" width="5" height="5" rx="1" />
            <rect x="44" y="12" width="5" height="5" rx="1" />
            <rect x="52" y="12" width="5" height="5" rx="1" />

            <rect x="36" y="20" width="5" height="5" rx="1" />
            <rect x="48" y="20" width="5" height="5" rx="1" fill="#06b6d4" />
            <rect x="56" y="20" width="5" height="5" rx="1" />

            <rect x="12" y="36" width="5" height="5" rx="1" />
            <rect x="20" y="36" width="5" height="5" rx="1" />
            <rect x="28" y="36" width="5" height="5" rx="1" />
            <rect x="36" y="36" width="5" height="5" rx="1" fill="#10b981" />
            <rect x="44" y="36" width="5" height="5" rx="1" />
            <rect x="52" y="36" width="5" height="5" rx="1" />
            <rect x="64" y="36" width="5" height="5" rx="1" />
            <rect x="76" y="36" width="5" height="5" rx="1" />
            <rect x="84" y="36" width="5" height="5" rx="1" />

            <rect x="12" y="44" width="5" height="5" rx="1" />
            <rect x="24" y="44" width="5" height="5" rx="1" />
            <rect x="40" y="44" width="5" height="5" rx="1" />
            <rect x="48" y="44" width="5" height="5" rx="1" fill="#06b6d4" />
            <rect x="68" y="44" width="5" height="5" rx="1" />
            <rect x="80" y="44" width="5" height="5" rx="1" />

            <rect x="16" y="52" width="5" height="5" rx="1" />
            <rect x="28" y="52" width="5" height="5" rx="1" />
            <rect x="36" y="52" width="5" height="5" rx="1" fill="#10b981" />
            <rect x="56" y="52" width="5" height="5" rx="1" />
            <rect x="64" y="52" width="5" height="5" rx="1" />
            <rect x="72" y="52" width="5" height="5" rx="1" />
            <rect x="84" y="52" width="5" height="5" rx="1" />

            <rect x="36" y="64" width="5" height="5" rx="1" />
            <rect x="44" y="64" width="5" height="5" rx="1" />
            <rect x="52" y="64" width="5" height="5" rx="1" />
            <rect x="60" y="64" width="5" height="5" rx="1" />
            <rect x="76" y="64" width="5" height="5" rx="1" />

            <rect x="40" y="72" width="5" height="5" rx="1" fill="#06b6d4" />
            <rect x="48" y="72" width="5" height="5" rx="1" />
            <rect x="68" y="72" width="5" height="5" rx="1" fill="#10b981" />
            <rect x="80" y="72" width="5" height="5" rx="1" />

            <rect x="36" y="80" width="5" height="5" rx="1" />
            <rect x="56" y="80" width="5" height="5" rx="1" />
            <rect x="64" y="80" width="5" height="5" rx="1" />
            <rect x="72" y="80" width="5" height="5" rx="1" />
            <rect x="84" y="80" width="5" height="5" rx="1" />
          </svg>
          <span className="text-[11px] font-semibold text-slate-500 mt-2 tracking-wider uppercase">
            Scan dengan kamera HP
          </span>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 pl-3 rounded-xl border border-slate-700 mb-4">
          <input
            type="text"
            readOnly
            value={url}
            className="bg-transparent text-xs text-slate-300 w-full focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin</span>
              </>
            )}
          </button>
        </div>

        <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-start gap-3 text-xs text-slate-300">
          <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            Tayangkan QR ini di proyektor kelas. Siswa cukup membuka kamera HP mereka untuk langsung bergabung mengeksplorasi model 3D.
          </span>
        </div>
      </div>
    </div>
  );
};
