import { Hotspot, ModuleInfo, AirwayStep, KeyFact } from '../types';

export const MODULE_01_DATA: ModuleInfo = {
  id: 'sistem-pernapasan',
  number: 'MODUL 01',
  title: 'Sistem Pernapasan',
  subject: 'IPA Kelas 8',
  category: 'Struktur & Fungsi Tubuh',
  status: 'Pratinjau',
  isFree: true,
  description: 'Organ utama pernapasan. Tugasnya memasukkan oksigen ke darah dan membuang karbon dioksida.',
  specimen: 'Pulmones — paru-paru manusia',
  hotspotsCount: 12
};

export const HOTSPOTS_DATA: Hotspot[] = [
  {
    id: 1,
    name: 'Paru-paru Kanan (Pulmo Dexter)',
    shortName: 'Paru Kanan',
    category: 'Paru-paru Kanan',
    position: [-1.4, 0.2, 0.4],
    description: 'Paru-paru kanan memiliki ukuran sedikit lebih besar dibanding yang kiri karena terbagi menjadi 3 lobus.',
    function: 'Menyerap oksigen dari udara pernapasan dan mengedarkannya ke pembuluh kapiler.'
  },
  {
    id: 2,
    name: 'Paru-paru Kiri (Pulmo Sinister)',
    shortName: 'Paru Kiri',
    category: 'Paru-paru Kiri',
    position: [1.4, 0.1, 0.4],
    description: 'Paru-paru kiri terdiri dari 2 lobus dan memiliki takik jantung (cardiac notch) untuk memberi ruang bagi letak jantung.',
    function: 'Menampung udara dan memfasilitasi difusi gas antara alveolus dan aliran darah sistemik.'
  },
  {
    id: 3,
    name: 'Saluran Napas (Trakea & Bronkus)',
    shortName: 'Saluran Napas',
    category: 'Saluran Napas',
    position: [0, 1.8, 0.2],
    description: 'Trakea diperkuat oleh cincin tulang rawan berbentuk huruf C, bercabang menjadi dua bronkus utama menuju paru kanan dan kiri.',
    function: 'Menyalurkan udara hangat, lembap, dan bersih dari laring langsung menuju ke paru-paru.'
  },
  {
    id: 4,
    name: 'Diafragma (Otot Pernapasan)',
    shortName: 'Diafragma',
    category: 'Diafragma',
    position: [0, -2.1, 0.3],
    description: 'Otot berbentuk kubah yang membatasi rongga dada dan rongga perut, penggerak utama pernapasan perut.',
    function: 'Berkontraksi merata ke bawah saat inspirasi untuk memperbesar volume rongga dada.'
  }
];

export const ALL_MODULES: ModuleInfo[] = [
  {
    id: 'sistem-pernapasan',
    number: 'MODUL 01',
    title: 'Sistem Pernapasan',
    subject: 'IPA Kelas 8',
    category: 'Biologi',
    status: 'Tersedia',
    isFree: true,
    description: 'Mekanisme pertukaran gas, anatomi pulmo, bronkus, dan alveolus.',
    specimen: 'Pulmones',
    hotspotsCount: 12
  },
  {
    id: 'sistem-peredaran-darah',
    number: 'MODUL 02',
    title: 'Sistem Peredaran Darah',
    subject: 'IPA Kelas 8',
    category: 'Biologi',
    status: 'Segera Hadir',
    isFree: false,
    description: 'Struktur jantung 4 ruang, katup bikuspid/trikuspid, dan sirkulasi darah besar/kecil.',
    specimen: 'Cor Humanum',
    hotspotsCount: 16
  },
  {
    id: 'sistem-pencernaan',
    number: 'MODUL 03',
    title: 'Sistem Pencernaan',
    subject: 'IPA Kelas 8',
    category: 'Biologi',
    status: 'Segera Hadir',
    isFree: false,
    description: 'Saluran pencernaan mekanik dan kimiawi dari lambung hingga usus halus.',
    specimen: 'Tractus Digestivus',
    hotspotsCount: 14
  },
  {
    id: 'sistem-ekskresi',
    number: 'MODUL 04',
    title: 'Sistem Ekskresi',
    subject: 'IPA Kelas 8',
    category: 'Biologi',
    status: 'Segera Hadir',
    isFree: false,
    description: 'Struktur ginjal, nefron, filtrasi darah, dan pembentukan urine.',
    specimen: 'Ren & Nefron',
    hotspotsCount: 10
  },
  {
    id: 'sistem-gerak',
    number: 'MODUL 05',
    title: 'Sistem Gerak Manusia',
    subject: 'IPA Kelas 8',
    category: 'Biologi',
    status: 'Segera Hadir',
    isFree: false,
    description: 'Rangka aksial, apendikular, sendi sinovial, dan mekanisme kerja otot lurik.',
    specimen: 'Skeleton Humanum',
    hotspotsCount: 20
  },
  {
    id: 'struktur-sel',
    number: 'MODUL 06',
    title: 'Sel Tumbuhan & Hewan',
    subject: 'IPA Kelas 8',
    category: 'Biologi',
    status: 'Segera Hadir',
    isFree: false,
    description: 'Organel sel: nukleus, mitokondria, kloroplas, vakuola, dan dinding sel.',
    specimen: 'Cellula',
    hotspotsCount: 15
  }
];

export const JALUR_UDARA: AirwayStep[] = [
  { step: 1, name: 'Hidung', inModule: false },
  { step: 2, name: 'Faring', inModule: false },
  { step: 3, name: 'Laring', inModule: false },
  { step: 4, name: 'Trakea', inModule: true },
  { step: 5, name: 'Bronkus', inModule: true },
  { step: 6, name: 'Bronkiolus', inModule: true },
  { step: 7, name: 'Alveolus', inModule: true },
];

export const FAKTA_KUNCI: KeyFact[] = [
  { label: 'Lokasi', value: 'Rongga dada, dilindungi tulang rusuk' },
  { label: 'Jumlah lobus', value: 'Kanan 3, kiri 2' },
  { label: 'Napas per hari', value: '± 20.000 kali' },
  { label: 'Oksigen udara', value: '± 21% dihirup, ± 16% dihembuskan' },
];

export const DEFAULT_TRIVIA = 'Kalau seluruh dinding alveolus dibentangkan, luasnya sekitar 70 m² — kira-kira seluas lantai ruang kelasmu!';

export const WA_FEEDBACK_URL = "https://wa.me/6287713633066?text=Halo%2C%20saya%20mencoba%20modul%20Sistem%20Pernapasan%20di%203dFunlearn.%20Masukan%20saya%3A%20";
export const WA_ADMIN_URL = "https://wa.me/6287713633066?text=Halo%20admin%203dFunlearn%2C";

// --- LocalStorage persistence helper methods for Admin Panel ---
const STORAGE_KEYS = {
  HOTSPOTS: '3dfunlearn_hotspots',
  MODULES: '3dfunlearn_modules',
  AIRWAY: '3dfunlearn_airway',
  FACTS: '3dfunlearn_facts',
  TRIVIA: '3dfunlearn_trivia',
};

export const getStoredHotspots = (): Hotspot[] => {
  if (typeof window === 'undefined') return HOTSPOTS_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HOTSPOTS);
    return raw ? JSON.parse(raw) : HOTSPOTS_DATA;
  } catch (e) {
    console.error('Failed to read hotspots from storage:', e);
    return HOTSPOTS_DATA;
  }
};

export const saveStoredHotspots = (hotspots: Hotspot[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.HOTSPOTS, JSON.stringify(hotspots));
  } catch (e) {
    console.error('Failed to save hotspots to storage:', e);
  }
};

export const getStoredModules = (): ModuleInfo[] => {
  if (typeof window === 'undefined') return ALL_MODULES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MODULES);
    return raw ? JSON.parse(raw) : ALL_MODULES;
  } catch (e) {
    console.error('Failed to read modules from storage:', e);
    return ALL_MODULES;
  }
};

export const saveStoredModules = (modules: ModuleInfo[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(modules));
  } catch (e) {
    console.error('Failed to save modules to storage:', e);
  }
};

export const getStoredAirway = (): AirwayStep[] => {
  if (typeof window === 'undefined') return JALUR_UDARA;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AIRWAY);
    return raw ? JSON.parse(raw) : JALUR_UDARA;
  } catch (e) {
    console.error('Failed to read airway from storage:', e);
    return JALUR_UDARA;
  }
};

export const saveStoredAirway = (airway: AirwayStep[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.AIRWAY, JSON.stringify(airway));
  } catch (e) {
    console.error('Failed to save airway to storage:', e);
  }
};

export const getStoredFacts = (): KeyFact[] => {
  if (typeof window === 'undefined') return FAKTA_KUNCI;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FACTS);
    return raw ? JSON.parse(raw) : FAKTA_KUNCI;
  } catch (e) {
    console.error('Failed to read facts from storage:', e);
    return FAKTA_KUNCI;
  }
};

export const saveStoredFacts = (facts: KeyFact[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.FACTS, JSON.stringify(facts));
  } catch (e) {
    console.error('Failed to save facts to storage:', e);
  }
};

export const getStoredTrivia = (): string => {
  if (typeof window === 'undefined') return DEFAULT_TRIVIA;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRIVIA);
    return raw !== null ? raw : DEFAULT_TRIVIA;
  } catch (e) {
    console.error('Failed to read trivia from storage:', e);
    return DEFAULT_TRIVIA;
  }
};

export const saveStoredTrivia = (trivia: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.TRIVIA, trivia);
  } catch (e) {
    console.error('Failed to save trivia to storage:', e);
  }
};

export const resetAllCurriculumToDefault = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.HOTSPOTS);
    localStorage.removeItem(STORAGE_KEYS.MODULES);
    localStorage.removeItem(STORAGE_KEYS.AIRWAY);
    localStorage.removeItem(STORAGE_KEYS.FACTS);
    localStorage.removeItem(STORAGE_KEYS.TRIVIA);
  } catch (e) {
    console.error('Failed to reset curriculum storage:', e);
  }
};
