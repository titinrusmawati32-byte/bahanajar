import React, { useState } from 'react';
import { Box, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { RoutePath } from '../types';
import { audioService } from '../utils/audio';

interface LoginPageProps {
  onNavigate: (route: RoutePath) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleGoogleLogin = () => {
    audioService.playClick();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSignedIn(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col justify-between p-4 sm:p-6 text-slate-100">
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
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

      <div className="max-w-md w-full mx-auto my-12 bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Masuk untuk membuka semua modul.
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed">
            Satu akun Google untuk satu guru. Modul Sistem Pernapasan tetap bisa dicoba tanpa login.
          </p>
        </div>

        <div>
          {isSignedIn ? (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                <ShieldCheck className="w-5 h-5" />
                <span>Berhasil masuk sebagai Guru</span>
              </div>
              <p className="text-xs text-slate-300">Semua modul pembelajaran siap digunakan.</p>
              <button
                onClick={() => onNavigate('/modul/sistem-pernapasan')}
                className="mt-2 w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Lanjut ke Modul
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm transition-all shadow-xl hover:shadow-white/10 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Masuk dengan Google</span>
                </>
              )}
            </button>
          )}

          <p className="text-[11px] text-slate-500 text-center mt-3 leading-relaxed">
            Dengan masuk, Anda menyetujui{' '}
            <button
              onClick={() => onNavigate('/syarat')}
              className="text-slate-400 hover:text-white underline"
            >
              Syarat Layanan
            </button>{' '}
            dan{' '}
            <button
              onClick={() => onNavigate('/privasi')}
              className="text-slate-400 hover:text-white underline"
            >
              Kebijakan Privasi
            </button>{' '}
            3dFunlearn.
          </p>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-3">
          <div className="flex items-start gap-3 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Buka semua modul — termasuk modul baru selama berlangganan.</span>
          </div>
          <div className="flex items-start gap-3 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Bagikan ke murid lewat QR — murid tidak perlu akun.</span>
          </div>
          <div className="flex items-start gap-3 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Tanpa password — cukup akun Google.</span>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => {
              audioService.playClick();
              onNavigate('/');
            }}
            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke beranda</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl w-full mx-auto text-center py-4 text-xs text-slate-400">
        Didukung TutorFlow
      </div>
    </div>
  );
};
