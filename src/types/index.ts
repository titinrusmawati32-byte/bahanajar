export type RoutePath = 
  | '/' 
  | '/modul/sistem-pernapasan' 
  | '/katalog' 
  | '/masuk' 
  | '/privasi' 
  | '/syarat';

export interface Hotspot {
  id: number;
  name: string;
  shortName: string;
  category: 'Paru-paru Kanan' | 'Paru-paru Kiri' | 'Saluran Napas' | 'Diafragma';
  position: [number, number, number];
  description: string;
  function: string;
}

export interface ModuleInfo {
  id: string;
  number: string;
  title: string;
  subject: string;
  category: string;
  status: 'Tersedia' | 'Pratinjau' | 'Segera Hadir';
  isFree: boolean;
  description: string;
  specimen: string;
  hotspotsCount: number;
}
