
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BumbuRecord, RTERecord, TenantRecord, ExpeditionRecord, TelecomRecord, RiceRecord } from '../types';

interface DataContextType {
  bumbuMakkah: BumbuRecord[];
  setBumbuMakkah: React.Dispatch<React.SetStateAction<BumbuRecord[]>>;
  bumbuMadinah: BumbuRecord[];
  setBumbuMadinah: React.Dispatch<React.SetStateAction<BumbuRecord[]>>;
  rteData: RTERecord[];
  setRteData: React.Dispatch<React.SetStateAction<RTERecord[]>>;
  tenantData: TenantRecord[];
  setTenantData: React.Dispatch<React.SetStateAction<TenantRecord[]>>;
  expeditionData: ExpeditionRecord[];
  setExpeditionData: React.Dispatch<React.SetStateAction<ExpeditionRecord[]>>;
  telecomData: TelecomRecord[];
  setTelecomData: React.Dispatch<React.SetStateAction<TelecomRecord[]>>;
  riceData: RiceRecord[];
  setRiceData: React.Dispatch<React.SetStateAction<RiceRecord[]>>;
  telecomActive: Record<number, boolean>;
  setTelecomActive: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// --- PDF Page 1-3 Data Source ---
const bumbuSource = [
  { company: 'PT. Halalan Thayyiban Indonesia (HTI)', name: 'Bumbu Nasi Kuning' },
  { company: 'PT. Foodindo Dwivestama', name: 'Bumbu Gulai' },
  { company: 'PT. Pangansari Utama Food', name: 'Bumbu Tongseng' },
  { company: 'PT. Laukita Bersama Indonesia', name: 'Bumbu Nasi Goreng' },
  { company: 'PT. Alnusakon Era Laju', name: 'Bumbu Opor' },
  { company: 'PT. Sekar Laut', name: 'Bumbu Bistik/Teriyaki' },
  { company: 'PT. Foodex Inti Ingredients', name: 'Bumbu Nasi Goreng Kampung' },
  { company: 'PT. Ikafood Putramas', name: 'Bumbu Kecap' },
  { company: 'PT. Niaga Citra Mandiri', name: 'Bumbu Gepuk' },
  { company: 'PT. Berkah Abadi Pangan', name: 'Bumbu Krengsengan' },
  { company: '', name: 'Bumbu Nasi Uduk' },
  { company: '', name: 'Bumbu Woku' },
  { company: '', name: 'Bumbu Balado' },
  { company: '', name: 'Bumbu Rica' },
  { company: '', name: 'Bumbu Semur' },
  { company: '', name: 'Bumbu Rajang' },
  { company: '', name: 'Bumbu Bali' },
  { company: '', name: 'Bumbu Saus Tiram' },
  { company: '', name: 'Bumbu Tumis' },
  { company: '', name: 'Bumbu Lada Hitam' },
  { company: '', name: 'Bumbu Saus Mentega' },
  { company: '', name: 'Bumbu Asam Manis' },
  { company: '', name: 'Bumbu Rujak' },
  { company: '', name: 'Bumbu Rendang' },
  { company: '', name: 'Bumbu Kuning' },
  { company: '', name: 'Bumbu Dabu-Dabu' },
  { company: '', name: 'Bumbu Pesmol' },
  { company: '', name: 'Bumbu Habang' }
];

// --- PDF Page 7-9 Data Source ---
const rteSource = [
  { company: 'PT. Halalan Thayyiban Indonesia (HTI)', menu: 'Nasi, Rendang Daging, Kacang Merah' },
  { company: 'PT. Family Food Indonesia', menu: 'Nasi, Bumbu Daging Balado, Wortel dan kentang' },
  { company: 'PT. Berkat Pangan Abadi', menu: 'Nasi, Sayur, Semur Ayam, Kacang Merah' },
  { company: 'PT. Laukita Bersama Indonesia (Umara)', menu: 'Nasi, Kari Ayam, Kentang' },
  { company: 'PT. Foodex inti Ingredients', menu: 'Nasi, Gulai Ayam, Wortel, Kentang' },
  { company: 'PT. Indo Niara Agro (Inagro)', menu: 'Nasi, Daging Bumbu lada hitam, Kacang Merah' },
  { company: 'PT. Adipura Mandiri Indotama', menu: 'Nasi, Ikan Fillet Asam Manis' },
  { company: 'PT. Jakarana Tama', menu: 'Mie Goreng Ayam Spesial' },
  { company: 'PT. Pangansari Utama Food Distribution', menu: 'Nasi, Sapi Lada Hitam' },
  { company: 'PT Kokikit Indonesia Teknologi', menu: 'Nasi, Ayam Woku' },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  const [bumbuMakkah, setBumbuMakkah] = useState<BumbuRecord[]>([]);
  const [bumbuMadinah, setBumbuMadinah] = useState<BumbuRecord[]>([]);
  const [rteData, setRteData] = useState<RTERecord[]>([]);
  const [tenantData, setTenantData] = useState<TenantRecord[]>([]);
  const [expeditionData, setExpeditionData] = useState<ExpeditionRecord[]>([]);
  const [telecomData, setTelecomData] = useState<TelecomRecord[]>([]);
  const [riceData, setRiceData] = useState<RiceRecord[]>([]);
  const [telecomActive, setTelecomActive] = useState<Record<number, boolean>>({});

    useEffect(() => {
    const timer = setTimeout(() => {
        const surveyors = ['Zainul Syaifudin', 'Ahmad Ulin Nuha'];
        const getRandomSurveyor = () => surveyors[Math.floor(Math.random() * surveyors.length)];

        // 1. Initialize Bumbu (Active records for first 5 items)
        const mapBumbu = (list: typeof bumbuSource, location: string) => list.map((item, idx) => ({
            id: idx + 1,
            name: item.name,
            companyName: item.company || (idx % 2 === 0 ? 'CV. Sumber Rasa Nusantara' : 'PT. Bumbu Dapur Ibu'), 
            isUsed: idx < 8, // First 8 are used
            volume: idx < 8 ? (Math.random() * 10 + 5).toFixed(2) : '',
            price: idx < 8 ? (Math.random() * 5000 + 15000).toFixed(0) : '',
            otherIngredients: idx === 0 ? 'Daun Salam, Serai, Lengkuas' : (idx === 3 ? 'Kecap Manis, Bawang Goreng' : ''),
            originProduct: idx < 8 ? 'Indonesia' : '',
            productPrice: idx < 8 ? (Math.random() * 4000 + 12000).toFixed(0) : '',
            kitchenName: `Dapur ${location} Sektor ${idx % 5 + 1}`,
            address: location === 'Makkah' ? `Jalan Al Hujun No. ${idx + 10}, Makkah` : `Jalan King Fahd No. ${idx + 20}, Madinah`,
            pic: idx % 2 === 0 ? 'Abdullah Al-Indunisi' : 'Siti Aminah',
            surveyor: getRandomSurveyor(),
            date: '20/06/2026',
            time: '08:30'
        }));
        setBumbuMakkah(mapBumbu(bumbuSource, 'Makkah'));
        setBumbuMadinah(mapBumbu(bumbuSource, 'Madinah'));

        // 2. Initialize RTE (Active records for first 4 items)
        const rteInit: RTERecord[] = rteSource.map((item, idx) => ({
             id: idx + 1, 
             companyName: item.company, 
             menu: item.menu, 
             isUsed: idx < 6, 
             volume: idx < 6 ? (Math.floor(Math.random() * 2000) + 1000).toString() : '', 
             price: idx < 6 ? (Math.floor(Math.random() * 5) + 12).toString() : '',
             kitchenName: `Dapur Katering Al-Barokah ${idx + 1}`,
             address: 'Makkah Al Mukarramah, Sektor Syisah',
             hotelName: `Hotel Al Kiswah Tower ${idx + 1}`,
             hotelNumber: `90${idx}`,
             kloterName: `JKG-${idx + 10}`,
             pic: 'Muhammad Ali',
             surveyor: getRandomSurveyor(),
             date: '21/06/2026',
             time: '11:00'
        }));
        setRteData(rteInit);

        // 3. Initialize Tenant
        setTenantData([
            { 
                id: 1, 
                shopName: 'Toko Indonesia Barokah', 
                productType: 'Makanan & Minuman Indonesia', 
                bestSeller: 'Indomie, Saus Sambal, Kecap Bango', 
                rentCost: '15000',
                hotelName: 'Al Kiswah Towers',
                address: 'Jarwal, Makkah',
                sector: '1',
                location: 'Lantai Dasar',
                pic: 'H. Slamet',
                surveyor: 'Zainul Syaifudin',
                date: '22/06/2026',
                time: '09:00'
            },
            { 
                id: 2, 
                shopName: 'Bin Dawood Souvenir', 
                productType: 'Oleh-oleh Haji', 
                bestSeller: 'Sajadah, Kurma Ajwa, Air Zamzam', 
                rentCost: '25000',
                hotelName: 'Makkah Clock Tower',
                address: 'Ajyad, Makkah',
                sector: '3',
                location: 'Lantai 1',
                pic: 'Ahmed Al-Ghamdi',
                surveyor: 'Ahmad Ulin Nuha',
                date: '22/06/2026',
                time: '10:30'
            },
            { 
                id: 3, 
                shopName: 'Bakso Mang Oedin', 
                productType: 'Makanan Siap Saji', 
                bestSeller: 'Bakso Urat, Es Teh Manis', 
                rentCost: '18000',
                hotelName: 'Sofwah Tower',
                address: 'Ajyad, Makkah',
                sector: '3',
                location: 'Food Court',
                pic: 'Udin Saefudin',
                surveyor: 'Zainul Syaifudin',
                date: '22/06/2026',
                time: '12:00'
            },
            { 
                id: 4, 
                shopName: 'Al-Madinah Dates', 
                productType: 'Kurma & Kacang Arab', 
                bestSeller: 'Kurma Sukari, Kacang Pistachio', 
                rentCost: '20000',
                hotelName: 'Rawda Al Aseel',
                address: 'Syisah, Makkah',
                sector: '4',
                location: 'Lobby Area',
                pic: 'Faisal',
                surveyor: 'Ahmad Ulin Nuha',
                date: '22/06/2026',
                time: '14:00'
            }
        ]);

        // 4. Initialize Expedition
        setExpeditionData([
            { 
                id: 1, 
                companyName: 'Nusantara Cargo', 
                pricePerKg: '12', 
                weight: '2500',
                hotelName: 'Kiswah Tower 1',
                address: 'Jarwal, Makkah',
                sector: '1',
                location: 'Lobby Utama',
                pic: 'Rudi Hartono',
                surveyor: 'Zainul Syaifudin',
                date: '23/06/2026',
                time: '14:00'
            },
            { 
                id: 2, 
                companyName: 'Pos Indonesia', 
                pricePerKg: '15', 
                weight: '1200',
                hotelName: 'Arkan Bakkah',
                address: 'Mahbas Jin, Makkah',
                sector: '2',
                location: 'Area Parkir',
                pic: 'Siti Nurhaliza',
                surveyor: 'Ahmad Ulin Nuha',
                date: '23/06/2026',
                time: '15:30'
            },
            {
                id: 3,
                companyName: 'TIKI Arab Saudi',
                pricePerKg: '13',
                weight: '800',
                hotelName: 'Rawda Al Aseel',
                address: 'Syisah, Makkah',
                sector: '4',
                location: 'Lantai M',
                pic: 'Bambang Pamungkas',
                surveyor: 'Zainul Syaifudin',
                date: '23/06/2026',
                time: '16:45'
            },
            {
                id: 4,
                companyName: 'JNE Express Haji',
                pricePerKg: '14',
                weight: '1500',
                hotelName: 'Grand Zamzam',
                address: 'Ajyad, Makkah',
                sector: '3',
                location: 'Pintu Masuk Belakang',
                pic: 'Agus Salim',
                surveyor: 'Ahmad Ulin Nuha',
                date: '23/06/2026',
                time: '17:30'
            }
        ]);

        // 5. Initialize Rice
        setRiceData([
            { 
                id: 1, 
                companyName: 'Perum BULOG', 
                riceType: 'Beras Premium', 
                isUsed: true, 
                volume: '200', 
                price: '3500', 
                otherRice: '-', 
                originProduct: 'Indonesia', 
                productPrice: '12000',
                kitchenName: 'Dapur Sektor 1 - Jarwal',
                address: 'Jarwal, Makkah',
                pic: 'H. Maman',
                surveyor: 'Zainul Syaifudin',
                date: '19/06/2026',
                time: '07:00'
            },
            { 
                id: 2, 
                companyName: 'Al-Watania Poultry (Rice Div)', 
                riceType: 'Beras Basmati', 
                isUsed: true, 
                volume: '150', 
                price: '4200', 
                otherRice: '-', 
                originProduct: 'Arab Saudi', 
                productPrice: '4000',
                kitchenName: 'Dapur Sektor 2 - Mahbas Jin',
                address: 'Mahbas Jin, Makkah',
                pic: 'Syekh Ali Jaber',
                surveyor: 'Ahmad Ulin Nuha',
                date: '19/06/2026',
                time: '08:00'
            },
            {
                id: 3,
                companyName: 'PT. Padi Unggul Nusantara',
                riceType: 'Beras Pandan Wangi',
                isUsed: true,
                volume: '100',
                price: '3800',
                otherRice: '-',
                originProduct: 'Indonesia',
                productPrice: '13500',
                kitchenName: 'Dapur Sektor 3 - Misfalah',
                address: 'Misfalah, Makkah',
                pic: 'Ibu Yati',
                surveyor: 'Zainul Syaifudin',
                date: '19/06/2026',
                time: '09:30'
            },
            {
                id: 4,
                companyName: 'Thai Rice Export',
                riceType: 'Beras Melati (Jasmine)',
                isUsed: false,
                volume: '',
                price: '',
                otherRice: '',
                originProduct: 'Thailand',
                productPrice: '',
                kitchenName: '',
                address: '',
                pic: '',
                surveyor: '',
                date: '',
                time: ''
            }
        ]);

        // 6. Initialize Telecom
        setTelecomData([
            {
                id: 1, 
                providerName: 'Telkomsel', 
                roamingPackage: 'RoaMax Haji 40GB',
                respondentName: 'H. Amirudin',
                kloter: 'SUB-45',
                embarkation: 'Surabaya',
                province: 'Jawa Timur',
                surveyor: 'Zainul Syaifudin',
                date: '24/06/2026'
            },
            {
                id: 2, 
                providerName: 'Indosat Ooredoo', 
                roamingPackage: 'Freedom Internet Haji',
                respondentName: 'Hj. Siti Aminah',
                kloter: 'JKG-12',
                embarkation: 'Jakarta',
                province: 'DKI Jakarta',
                surveyor: 'Ahmad Ulin Nuha',
                date: '24/06/2026'
            },
            {
                id: 3, 
                providerName: 'STC (Saudi Telecom)', 
                roamingPackage: 'Sawa Ziyara',
                respondentName: 'H. Budi Santoso',
                kloter: 'SOC-20',
                embarkation: 'Solo',
                province: 'Jawa Tengah',
                surveyor: 'Zainul Syaifudin',
                date: '24/06/2026'
            },
            {
                id: 4, 
                providerName: 'Mobily', 
                roamingPackage: 'Hajj & Umrah Package',
                respondentName: 'Hj. Dewi Sartika',
                kloter: 'MES-05',
                embarkation: 'Medan',
                province: 'Sumatera Utara',
                surveyor: 'Ahmad Ulin Nuha',
                date: '24/06/2026'
            },
            {
                id: 5, 
                providerName: 'XL Axiata', 
                roamingPackage: 'XL Pass Haji',
                respondentName: 'H. Ridwan Kamil',
                kloter: 'JKS-01',
                embarkation: 'Bekasi',
                province: 'Jawa Barat',
                surveyor: 'Zainul Syaifudin',
                date: '24/06/2026'
            },
            {
                id: 6, 
                providerName: 'Zain KSA', 
                roamingPackage: 'Zain Hajj Data',
                respondentName: 'Hj. Ratna Sari',
                kloter: 'UPG-10',
                embarkation: 'Makassar',
                province: 'Sulawesi Selatan',
                surveyor: 'Ahmad Ulin Nuha',
                date: '24/06/2026'
            }
        ]);
        
        setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <DataContext.Provider value={{
      bumbuMakkah, setBumbuMakkah,
      bumbuMadinah, setBumbuMadinah,
      rteData, setRteData,
      tenantData, setTenantData,
      expeditionData, setExpeditionData,
      telecomData, setTelecomData,
      riceData, setRiceData,
      telecomActive, setTelecomActive,
      isLoading
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useData must be used within a DataProvider');
  return context;
};
