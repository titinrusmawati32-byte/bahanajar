import React, { useState, useEffect } from 'react';
import { RoutePath } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CatalogModal } from './components/CatalogModal';
import { HomePage } from './pages/HomePage';
import { ModulePage } from './pages/ModulePage';
import { LoginPage } from './pages/LoginPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<RoutePath>('/');
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname as RoutePath;
      if (['/', '/modul/sistem-pernapasan', '/masuk', '/privasi', '/syarat'].includes(path)) {
        setCurrentRoute(path);
      } else if (path === '/katalog') {
        setCurrentRoute('/');
        setIsCatalogOpen(true);
      } else {
        setCurrentRoute('/');
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (route: RoutePath) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (currentRoute) {
      case '/modul/sistem-pernapasan':
        return (
          <ModulePage
            onNavigate={navigateTo}
            onOpenCatalog={() => setIsCatalogOpen(true)}
          />
        );
      case '/masuk':
        return <LoginPage onNavigate={navigateTo} />;
      case '/privasi':
        return <PrivacyPage onNavigate={navigateTo} />;
      case '/syarat':
        return <TermsPage onNavigate={navigateTo} />;
      case '/':
      default:
        return (
          <div className="flex flex-col min-h-screen">
            <Navbar
              currentRoute={currentRoute}
              onNavigate={navigateTo}
              onOpenCatalog={() => setIsCatalogOpen(true)}
            />
            <main className="flex-1">
              <HomePage
                onNavigate={navigateTo}
                onOpenCatalog={() => setIsCatalogOpen(true)}
              />
            </main>
            <Footer onNavigate={navigateTo} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {renderContent()}

      <CatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onSelectModule={(id) => {
          if (id === 'sistem-pernapasan') {
            navigateTo('/modul/sistem-pernapasan');
          }
        }}
      />
    </div>
  );
};

export default App;
