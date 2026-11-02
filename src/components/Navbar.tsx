import React from 'react';
import { Box, Sparkles, Globe, Sliders } from 'lucide-react';
import { RoutePath } from '../types';
import { audioService } from '../utils/audio';

interface NavbarProps {
  currentRoute: RoutePath;
  onNavigate: (route: RoutePath) => void;
  onOpenCatalog: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate, onOpenCatalog }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b0f19]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div
          onClick={() => {
            audioService.playClick();
            onNavigate('/');
          }}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
              <Box className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-xl font-extrabold tracking-tight text-white">
              3d<span className="text-emerald-400">Funlearn</span>
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => {
              audioService.playClick();
              if (currentRoute !== '/') {
                onNavigate('/');
                setTimeout(() => {
                  document.getElementById('cara-kerja')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              } else {
                document.getElementById('cara-kerja')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block"
          >
            Cara kerja
          </button>

          <button
            onClick={() => {
              audioService.playClick();
              onOpenCatalog();
            }}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Modul
          </button>

          <button
            onClick={() => {
              audioService.playClick();
              onNavigate('/admin');
            }}
            className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
              currentRoute === '/admin' ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>Admin</span>
          </button>

          <button
            onClick={() => {
              audioService.playClick();
              onNavigate('/masuk');
            }}
            className={`text-sm font-medium transition-colors ${
              currentRoute === '/masuk' ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Masuk
          </button>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-300 select-none">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>ID</span>
          </div>

          <button
            onClick={() => {
              audioService.playClick();
              onNavigate('/modul/sistem-pernapasan');
            }}
            className="hidden xs:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Coba gratis</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
