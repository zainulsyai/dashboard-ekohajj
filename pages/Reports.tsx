
import React, { useState, useMemo, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { ChefHat, UtensilsCrossed, Truck, Store, Signal, Download, Printer, Filter, Search, MapPin, User, Calendar, Clock, Building, ShoppingCart, ChevronDown, Check, ArrowDownUp, Database, X, Building2, Package, DollarSign, FileText, Globe, ShoppingBag, TrendingUp, Scale, CheckCircle2, Edit, Save } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useUser } from '../contexts/UserContext';
import { Role } from '../types';
import { TableRowSkeleton } from '../components/Skeletons';
import { HeroSection } from '../components/HeroSection';

const TableHeader = ({ children }: React.PropsWithChildren<{}>) => (
  <th className="px-6 py-4 text-left group relative">
    <div className="flex items-center gap-1.5 w-fit">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap group-hover:text-[#064E3B] transition-colors">{children}</span>
    </div>
  </th>
);

const TableRow = ({ children, idx, style, onClick }: React.PropsWithChildren<{ idx: number; style?: React.CSSProperties; onClick?: () => void }>) => (
  <tr 
    style={style}
    onClick={onClick}
    className={`transition-all duration-300 hover:bg-[#064E3B]/5 ${idx % 2 === 0 ? 'bg-white/30' : 'bg-transparent'} animate-fade-in-up opacity-0 fill-mode-forwards cursor-pointer`}
  >
      {children}
  </tr>
);

export const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bumbu' | 'beras' | 'rte' | 'tenant' | 'ekspedisi' | 'telco'>('bumbu');
  const { bumbuMakkah, bumbuMadinah, rteData, tenantData, expeditionData, telecomData, riceData, isLoading } = useData();
  const currentDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'newest' | 'oldest' | 'highest_vol' | 'highest_price'>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // --- DATA PROCESSING LOGIC ---
  const processedData = useMemo(() => {
      let data: any[] = [];

      // 1. Combine/Select Data Source
      switch (activeTab) {
          case 'bumbu':
              data = [
                  ...bumbuMakkah.filter(i => i.isUsed).map(i => ({ ...i, loc: 'Makkah' })),
                  ...bumbuMadinah.filter(i => i.isUsed).map(i => ({ ...i, loc: 'Madinah' }))
              ];
              break;
          case 'beras': data = [...riceData]; break;
          case 'rte': data = [...rteData]; break;
          case 'tenant': data = [...tenantData]; break;
          case 'ekspedisi': data = [...expeditionData]; break;
          case 'telco': data = [...telecomData]; break;
      }

      // 2. Filter by Search Term (Specific to first 2 columns per tab)
      if (searchTerm) {
          const lowerTerm = searchTerm.toLowerCase();
          data = data.filter(item => {
              switch (activeTab) {
                  case 'bumbu':
                      // Col 1: name, companyName | Col 2: loc, kitchenName, address, pic
                      return (
                          (item.name && item.name.toLowerCase().includes(lowerTerm)) ||
                          (item.companyName && item.companyName.toLowerCase().includes(lowerTerm)) ||
                          (item.loc && item.loc.toLowerCase().includes(lowerTerm)) ||
                          (item.kitchenName && item.kitchenName.toLowerCase().includes(lowerTerm)) ||
                          (item.address && item.address.toLowerCase().includes(lowerTerm)) ||
                          (item.pic && item.pic.toLowerCase().includes(lowerTerm))
                      );
                  case 'beras':
                      // Col 1: companyName | Col 2: riceType, volume
                      return (
                          (item.companyName && item.companyName.toLowerCase().includes(lowerTerm)) ||
                          (item.riceType && item.riceType.toLowerCase().includes(lowerTerm)) ||
                          (item.volume && item.volume.toString().toLowerCase().includes(lowerTerm))
                      );
                  case 'rte':
                      // Col 1: companyName | Col 2: menu
                      return (
                          (item.companyName && item.companyName.toLowerCase().includes(lowerTerm)) ||
                          (item.menu && item.menu.toLowerCase().includes(lowerTerm))
                      );
                  case 'tenant':
                      // Col 1: shopName | Col 2: hotelName, location, pic
                      return (
                          (item.shopName && item.shopName.toLowerCase().includes(lowerTerm)) ||
                          (item.hotelName && item.hotelName.toLowerCase().includes(lowerTerm)) ||
                          (item.location && item.location.toLowerCase().includes(lowerTerm)) ||
                          (item.pic && item.pic.toLowerCase().includes(lowerTerm))
                      );
                  case 'ekspedisi':
                      // Col 1: companyName | Col 2: hotelName, location, pic
                      return (
                          (item.companyName && item.companyName.toLowerCase().includes(lowerTerm)) ||
                          (item.hotelName && item.hotelName.toLowerCase().includes(lowerTerm)) ||
                          (item.location && item.location.toLowerCase().includes(lowerTerm)) ||
                          (item.pic && item.pic.toLowerCase().includes(lowerTerm))
                      );
                  case 'telco':
                      // Col 1: providerName | Col 2: respondentName, kloter, embarkation, province
                      return (
                          (item.providerName && item.providerName.toLowerCase().includes(lowerTerm)) ||
                          (item.respondentName && item.respondentName.toLowerCase().includes(lowerTerm)) ||
                          (item.kloter && item.kloter.toLowerCase().includes(lowerTerm)) ||
                          (item.embarkation && item.embarkation.toLowerCase().includes(lowerTerm)) ||
                          (item.province && item.province.toLowerCase().includes(lowerTerm))
                      );
                  default:
                      return false;
              }
          });
      }

      // 3. Sort Data based on Filter Mode
      data.sort((a, b) => {
          switch (filterMode) {
              case 'newest':
                   // Mock sort by ID desc as proxy for date if date parsing is complex
                   return b.id - a.id;
              case 'oldest':
                   return a.id - b.id;
              case 'highest_vol':
                   const volA = parseFloat(a.volume || a.weight || '0');
                   const volB = parseFloat(b.volume || b.weight || '0');
                   return volB - volA;
              case 'highest_price':
                   const priceA = parseFloat(a.price || a.rentCost || a.pricePerKg || '0');
                   const priceB = parseFloat(b.price || b.rentCost || b.pricePerKg || '0');
                   return priceB - priceA;
              default:
                   return 0;
          }
      });

      return data;
  }, [activeTab, bumbuMakkah, bumbuMadinah, riceData, rteData, tenantData, expeditionData, telecomData, searchTerm, filterMode]);

  const getSearchPlaceholder = () => {
      switch(activeTab) {
          case 'bumbu': return 'Cari bumbu, dapur, PIC...';
          case 'beras': return 'Cari perusahaan, jenis beras...';
          case 'rte': return 'Cari perusahaan, menu...';
          case 'tenant': return 'Cari toko, hotel, PIC...';
          case 'ekspedisi': return 'Cari perusahaan, hotel, PIC...';
          case 'telco': return 'Cari provider, jemaah, kloter...';
          default: return 'Cari data...';
      }
  };

  const renderTableBody = () => {
      if (isLoading) {
          return (
              <tbody className="divide-y divide-gray-100">
                  {[...Array(6)].map((_, i) => <TableRowSkeleton key={i} />)}
              </tbody>
          );
      }

      if (processedData.length === 0) {
          return (
              <tbody>
                  <tr>
                      <td colSpan={5} className="p-12 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-400">
                              <Search size={32} className="mb-2 opacity-50" />
                              <p className="font-medium text-sm">Data tidak ditemukan.</p>
                              <p className="text-xs mt-1">Coba kata kunci pencarian lain.</p>
                          </div>
                      </td>
                  </tr>
              </tbody>
          );
      }

      const getDelay = (idx: number) => ({ animationDelay: `${idx * 50}ms` });

      switch(activeTab) {
          case 'bumbu':
              return (
                <tbody key={activeTab} className="divide-y divide-gray-100">
                    {processedData.map((row: any, idx) => (
                        <TableRow key={idx} idx={idx} style={getDelay(idx)} onClick={() => setSelectedItem(row)}>
                            <td className="px-6 py-4">
                                <div className="font-bold text-gray-700">{row.name}</div>
                                <div className="text-[10px] text-gray-400 font-medium">{row.companyName}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-[#064E3B]">
                                    <MapPin size={12} /> {row.loc}
                                </div>
                                <div className="text-[11px] font-bold text-gray-700 mt-1">{row.kitchenName || '-'}</div>
                                <div className="text-[10px] text-gray-400">{row.address}</div>
                                <div className="text-[10px] text-gray-500 mt-0.5">PIC: <span className="font-medium">{row.pic || '-'}</span></div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-gray-600 font-bold">{row.volume} Ton</div>
                                <div className="text-[10px] text-gray-400">Bahan Lain: {row.otherIngredients || '-'}</div>
                            </td>
                            <td className="px-6 py-4 text-[#D4AF37] font-bold">SAR {row.price}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                    <User size={12} /> {row.surveyor || '-'}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                        <Calendar size={10} /> {row.date || '-'}
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                        <Clock size={10} /> {row.time || '-'}
                                    </div>
                                </div>
                            </td>
                        </TableRow>
                    ))}
                </tbody>
              );
          case 'beras':
              return (
                <tbody key={activeTab} className="divide-y divide-gray-100">
                    {processedData.map((row: any, idx) => (
                        <TableRow key={row.id} idx={idx} style={getDelay(idx)} onClick={() => setSelectedItem(row)}>
                            <td className="px-6 py-4">
                                <div className="font-bold text-[#064E3B]">{row.companyName}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-xs font-bold text-gray-700">{row.riceType}</div>
                                <div className="text-[10px] text-gray-500 mt-0.5">Vol: {row.volume} Ton</div>
                            </td>
                            <td className="px-6 py-4 text-[#D4AF37] font-bold">SAR {row.price}</td>
                            <td className="px-6 py-4">
                                <div className="text-xs font-medium text-gray-700">{row.originProduct || '-'}</div>
                                <div className="text-[10px] text-gray-400">Harga Asal: {row.productPrice || '-'}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                    <User size={12} /> {row.surveyor || '-'}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                        <Calendar size={10} /> {row.date || '-'}
                                    </div>
                                </div>
                            </td>
                        </TableRow>
                    ))}
                </tbody>
              );
          case 'rte':
               return (
                <tbody key={activeTab} className="divide-y divide-gray-100">
                    {processedData.map((row: any, idx) => (
                        <TableRow key={row.id} idx={idx} style={getDelay(idx)} onClick={() => setSelectedItem(row)}>
                            <td className="px-6 py-4">
                                <div className="font-bold text-[#064E3B]">{row.companyName}</div>
                            </td>
                            <td className="px-6 py-4 text-gray-700 font-medium">{row.menu}</td>
                            <td className="px-6 py-4">
                                <div className="text-xs font-bold text-gray-700">{row.kitchenName || '-'}</div>
                                <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                                    <MapPin size={10} /> {row.address || '-'}
                                </div>
                                <div className="text-[10px] text-gray-500 mt-0.5">PIC: <span className="font-medium">{row.pic || '-'}</span></div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-medium text-gray-700">{row.volume} Porsi</div>
                                <div className="text-[10px] font-bold text-[#D4AF37]">SAR {row.price}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                    <User size={12} /> {row.surveyor || '-'}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                        <Calendar size={10} /> {row.date || '-'}
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                        <Clock size={10} /> {row.time || '-'}
                                    </div>
                                </div>
                            </td>
                        </TableRow>
                    ))}
                </tbody>
              );
          case 'tenant':
               return (
                <tbody key={activeTab} className="divide-y divide-gray-100">
                    {processedData.map((row: any, idx) => (
                        <TableRow key={row.id} idx={idx} style={getDelay(idx)} onClick={() => setSelectedItem(row)}>
                            <td className="px-6 py-4">
                                <div className="font-bold text-[#064E3B]">{row.shopName}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                                    <Building size={12} className="text-gray-400" /> {row.hotelName || '-'}
                                </div>
                                <div className="text-[10px] text-gray-500 ml-4">{row.location || '-'}</div>
                                <div className="text-[10px] text-gray-500 ml-4">PIC: {row.pic || '-'}</div>
                            </td>
                            <td className="px-6 py-4 text-gray-700">
                                <div className="font-medium text-xs">{row.productType}</div>
                                <div className="text-[10px] text-gray-400 mt-0.5">Best: {row.bestSeller}</div>
                            </td>
                            <td className="px-6 py-4 text-[#D4AF37] font-bold">SAR {row.rentCost}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                    <User size={12} /> {row.surveyor || '-'}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                        <Calendar size={10} /> {row.date || '-'}
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                        <Clock size={10} /> {row.time || '-'}
                                    </div>
                                </div>
                            </td>
                        </TableRow>
                    ))}
                </tbody>
              );
          case 'ekspedisi':
              return (
                <tbody key={activeTab} className="divide-y divide-gray-100">
                    {processedData.map((row: any, idx) => (
                        <TableRow key={row.id} idx={idx} style={getDelay(idx)} onClick={() => setSelectedItem(row)}>
                            <td className="px-6 py-4 font-bold text-[#064E3B]">{row.companyName}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                                    <Building size={12} className="text-gray-400" /> {row.hotelName || '-'}
                                </div>
                                <div className="text-[10px] text-gray-500 ml-4">{row.location || '-'}</div>
                                <div className="text-[10px] text-gray-500 ml-4">PIC: {row.pic || '-'}</div>
                            </td>
                            <td className="px-6 py-4 text-gray-700 font-medium">{row.weight} Kg</td>
                            <td className="px-6 py-4 text-[#D4AF37] font-bold">SAR {row.pricePerKg}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                    <User size={12} /> {row.surveyor || '-'}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                        <Calendar size={10} /> {row.date || '-'}
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                        <Clock size={10} /> {row.time || '-'}
                                    </div>
                                </div>
                            </td>
                        </TableRow>
                    ))}
                </tbody>
             );
          case 'telco':
              return (
                <tbody key={activeTab} className="divide-y divide-gray-100">
                    {processedData.map((row: any, idx) => (
                        <TableRow key={row.id} idx={idx} style={getDelay(idx)} onClick={() => setSelectedItem(row)}>
                            <td className="px-6 py-4 font-bold text-[#064E3B]">{row.providerName}</td>
                            <td className="px-6 py-4">
                                <div className="text-xs font-bold text-gray-700">{row.respondentName || '-'}</div>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">Kloter: {row.kloter || '-'}</span>
                                    <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{row.embarkation || '-'}</span>
                                </div>
                                <div className="text-[10px] text-gray-400 mt-0.5">{row.province}</div>
                            </td>
                            <td className="px-6 py-4 text-gray-700 text-xs">{row.roamingPackage || '-'}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${row.roamingPackage ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${row.roamingPackage ? 'bg-emerald-600' : 'bg-gray-400'}`}></span>
                                    {row.roamingPackage ? 'Terisi' : 'Kosong'}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                    <User size={12} /> {row.surveyor || '-'}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                        <Calendar size={10} /> {row.date || '-'}
                                    </div>
                                </div>
                            </td>
                        </TableRow>
                    ))}
                </tbody>
             );
          default:
              return <tbody><tr><td colSpan={5} className="p-12 text-center text-gray-400 font-medium">Data belum tersedia.</td></tr></tbody>;
      }
  }

  const renderMobileCards = () => {
      if (isLoading) {
          return <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">{[...Array(4)].map((_, i) => <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />)}</div>;
      }

      if (processedData.length === 0) {
          return (
              <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400 lg:hidden bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                  <Search size={40} className="mb-3 opacity-50" />
                  <p className="font-bold text-base text-gray-600">Data tidak ditemukan.</p>
                  <p className="text-xs text-gray-400 mt-1">Coba ubah filter atau kata kunci pencarian.</p>
              </div>
          );
      }

      return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:hidden animate-fade-in-up">
              {processedData.map((row: any, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedItem(row)}
                    className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm transition-all duration-200 active:scale-[0.99] active:bg-gray-50 relative overflow-hidden cursor-pointer"
                  >
                      {/* Decoration */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>

                      {/* Header: Main Title & Status/Price */}
                      <div className="flex justify-between items-start gap-3 relative z-10 mb-3">
                          <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5">
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                      {activeTab === 'bumbu' ? 'Bumbu' : 
                                       activeTab === 'beras' ? 'Beras' : 
                                       activeTab === 'rte' ? 'RTE' : 
                                       activeTab === 'tenant' ? 'Tenant' : 
                                       activeTab === 'ekspedisi' ? 'Ekspedisi' : 'Telco'}
                                  </span>
                                  {row.date && <span className="text-[9px] text-gray-400 flex items-center gap-1"><Clock size={8} /> {row.date}</span>}
                              </div>
                              <h4 className="font-bold text-gray-800 text-sm md:text-base leading-tight line-clamp-2">
                                  {row.name || row.companyName || row.shopName || row.providerName}
                              </h4>
                              <p className="text-[10px] md:text-xs text-gray-500 mt-1 font-medium line-clamp-1">
                                  {row.kitchenName || row.riceType || row.menu || row.hotelName || row.respondentName || row.companyName}
                              </p>
                          </div>
                          
                          {/* Price or Status Badge */}
                          <div className="flex flex-col items-end gap-1">
                              {(row.price || row.rentCost || row.pricePerKg) && (
                                  <span className="text-[10px] md:text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-1 rounded-lg whitespace-nowrap border border-[#D4AF37]/20">
                                      SAR {row.price || row.rentCost || row.pricePerKg}
                                  </span>
                              )}
                              {activeTab === 'telco' && (
                                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${row.roamingPackage ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                                      {row.roamingPackage ? 'Terisi' : 'Kosong'}
                                  </span>
                              )}
                          </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[10px] md:text-xs text-gray-600 border-t border-gray-50 pt-3 relative z-10">
                          
                          {/* Location / Origin */}
                          {(row.loc || row.location || row.address || row.province || row.originProduct) && (
                              <div className="col-span-2 flex items-start gap-2">
                                  <div className="p-1 bg-gray-50 rounded text-gray-400 mt-0.5"><MapPin size={10} /></div>
                                  <span className="line-clamp-2 leading-relaxed text-gray-600">
                                      {row.loc || row.location || row.address || row.province}
                                      {row.originProduct && <span className="text-gray-500"> (Asal: {row.originProduct})</span>}
                                  </span>
                              </div>
                          )}
                          
                          {/* Volume / Weight / Package / Product */}
                          <div className="flex items-center gap-2">
                              <div className="p-1 bg-gray-50 rounded text-gray-400"><Building size={10} /></div>
                              <span className="truncate font-medium">
                                  {row.volume ? `${row.volume} ${activeTab === 'rte' ? 'Porsi' : 'Ton'}` : 
                                   row.weight ? `${row.weight} Kg` : 
                                   row.roamingPackage ? row.roamingPackage :
                                   row.productType ? row.productType : '-'}
                              </span>
                          </div>

                          {/* PIC / Surveyor */}
                          <div className="flex items-center gap-2">
                              <div className="p-1 bg-gray-50 rounded text-gray-400"><User size={10} /></div>
                              <span className="truncate">{row.pic || row.surveyor || '-'}</span>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      );
  };

  const renderTable = () => {
    return (
        <>
            {/* Desktop Table - Hidden on Mobile & Tablet (lg and below) */}
            <div className="hidden lg:block overflow-hidden rounded-2xl border border-gray-200/50">
                <table className="w-full text-sm">
                    <thead className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                        <tr>
                            {activeTab === 'bumbu' && (
                                <>
                                    <TableHeader>Jenis Bumbu</TableHeader>
                                    <TableHeader>Detail Dapur & PIC</TableHeader>
                                    <TableHeader>Data Bumbu</TableHeader>
                                    <TableHeader>Harga (SAR)</TableHeader>
                                    <TableHeader>Surveyor & Waktu</TableHeader>
                                </>
                            )}
                            {activeTab === 'beras' && (
                                <>
                                    <TableHeader>Perusahaan</TableHeader>
                                    <TableHeader>Jenis & Volume</TableHeader>
                                    <TableHeader>Harga (SAR)</TableHeader>
                                    <TableHeader>Asal Produk</TableHeader>
                                    <TableHeader>Surveyor & Waktu</TableHeader>
                                </>
                            )}
                            {activeTab === 'rte' && (
                                <>
                                    <TableHeader>Perusahaan</TableHeader>
                                    <TableHeader>Menu / Jenis</TableHeader>
                                    <TableHeader>Lokasi & PIC</TableHeader>
                                    <TableHeader>Volume & Harga</TableHeader>
                                    <TableHeader>Surveyor & Waktu</TableHeader>
                                </>
                            )}
                            {activeTab === 'tenant' && (
                                <>
                                    <TableHeader>Nama Toko</TableHeader>
                                    <TableHeader>Lokasi Hotel & PIC</TableHeader>
                                    <TableHeader>Produk Utama</TableHeader>
                                    <TableHeader>Biaya Sewa</TableHeader>
                                    <TableHeader>Surveyor & Waktu</TableHeader>
                                </>
                            )}
                            {activeTab === 'ekspedisi' && (
                                <>
                                    <TableHeader>Perusahaan</TableHeader>
                                    <TableHeader>Lokasi Asal & PIC</TableHeader>
                                    <TableHeader>Berat (Kg)</TableHeader>
                                    <TableHeader>Harga / Kg</TableHeader>
                                    <TableHeader>Surveyor & Waktu</TableHeader>
                                </>
                            )}
                            {activeTab === 'telco' && (
                                <>
                                    <TableHeader>Provider</TableHeader>
                                    <TableHeader>Identitas Jemaah</TableHeader>
                                    <TableHeader>Paket Roaming</TableHeader>
                                    <TableHeader>Status</TableHeader>
                                    <TableHeader>Surveyor & Waktu</TableHeader>
                                </>
                            )}
                        </tr>
                    </thead>
                    {renderTableBody()}
                </table>
            </div>

            {/* Mobile Cards */}
            {renderMobileCards()}
        </>
    );
  };

  const filterOptions = [
      { id: 'newest', label: 'Terbaru Ditambahkan' },
      { id: 'oldest', label: 'Terlama Ditambahkan' },
      { id: 'highest_vol', label: 'Volume Tertinggi' },
      { id: 'highest_price', label: 'Harga Tertinggi' },
  ];

  // Detail Modal Component
  const DetailModal = () => {
    const { user } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<any>({});
    const [showToast, setShowToast] = useState(false);
    const { 
        setBumbuMakkah, setBumbuMadinah, setRteData, setTenantData, setExpeditionData, setTelecomData, setRiceData 
    } = useData();

    // Generate dummy extra details for visual richness
    const surveyId = selectedItem ? `SRV-2026-${selectedItem.id.toString().padStart(4, '0')}` : '';
    // Status logic: Even IDs are Verified (Sent), Odd IDs are Draft (Not Sent)
    const status = selectedItem ? (selectedItem.id % 2 === 0 ? 'Verified' : 'Draft') : '';
    const statusColor = status === 'Verified' ? 'bg-emerald-500' : 'bg-gray-400';
    const statusTextColor = status === 'Verified' ? 'text-emerald-100/80' : 'text-gray-300/80';
    const coordinates = selectedItem ? `${(21.3891 + Math.random() * 0.1).toFixed(6)}, ${(39.8579 + Math.random() * 0.1).toFixed(6)}` : '';
    const picContact = selectedItem ? `+966 5${Math.floor(Math.random() * 90000000 + 10000000)}` : '';
    
    const defaultNotes = status === 'Verified' 
        ? "Laporan telah dikirim dan diverifikasi. Kondisi penyimpanan baik, suhu ruangan terkontrol. Stok mencukupi."
        : "Laporan masih dalam bentuk draf. Menunggu kelengkapan data foto dan tanda tangan digital PIC sebelum dikirim.";

    useEffect(() => {
        if (selectedItem) {
            setEditForm({ 
                ...selectedItem, 
                notes: selectedItem.notes || defaultNotes 
            });
            setIsEditing(false);
            setShowToast(false);
        }
    }, [selectedItem]);

    if (!selectedItem) return null;

    // Permission Check: Only Surveyor or Admin can edit
    const canEdit = user.role === Role.ADMINISTRATOR || user.name === selectedItem.surveyor;

    const handleSave = () => {
        // Update local state (simulating API call)
        const updateData = (setter: any) => {
            setter((prev: any[]) => prev.map(item => item.id === editForm.id ? { ...item, ...editForm } : item));
        };

        switch (activeTab) {
            case 'bumbu':
                if (editForm.loc === 'Makkah') updateData(setBumbuMakkah);
                else updateData(setBumbuMadinah);
                break;
            case 'beras': updateData(setRiceData); break;
            case 'rte': updateData(setRteData); break;
            case 'tenant': updateData(setTenantData); break;
            case 'ekspedisi': updateData(setExpeditionData); break;
            case 'telco': updateData(setTelecomData); break;
        }

        setSelectedItem({ ...editForm });
        setIsEditing(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const DetailRow = ({ label, field, value, icon: Icon, delay, subValue }: any) => (
      <div 
        className={`group flex items-start gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300 animate-fade-in-up fill-mode-forwards opacity-0 ${isEditing ? 'ring-2 ring-[#D4AF37]/20 bg-gray-50/30' : ''}`}
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="p-2.5 bg-gradient-to-br from-[#064E3B]/5 to-[#064E3B]/10 rounded-lg text-[#064E3B] shrink-0 transition-all duration-300 shadow-inner">
          <Icon size={18} strokeWidth={1.5} />
        </div>
        <div className="min-w-0 flex-1 pt-0.5 w-full">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5 transition-colors">{label}</p>
          
          {isEditing && field ? (
              <input 
                type="text" 
                value={editForm[field] || ''} 
                onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                className="w-full text-sm font-bold text-gray-800 border-b-2 border-gray-200 focus:border-[#064E3B] outline-none bg-white/50 px-1 py-0.5 rounded transition-all placeholder-gray-300"
                placeholder={`Input ${label}...`}
              />
          ) : (
              <p className="text-sm font-bold text-gray-800 break-words leading-snug line-clamp-2">{value || '-'}</p>
          )}
          
          {subValue && !isEditing && <p className="text-[10px] text-gray-500 mt-0.5 font-medium">{subValue}</p>}
        </div>
      </div>
    );

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <div 
            className="absolute inset-0 bg-[#000000]/70 backdrop-blur-md transition-opacity duration-300 animate-fade-in" 
            onClick={() => !isEditing && setSelectedItem(null)}
        />
        <div className="relative w-full max-w-5xl bg-[#F8F9FA] rounded-2xl md:rounded-[2rem] shadow-2xl ring-1 ring-white/20 animate-zoom-in flex flex-col md:flex-row max-h-[90vh] border border-white/40 overflow-y-auto md:overflow-hidden">
            
            {/* Close Button - Global Position */}
            {!isEditing && (
                <button 
                    onClick={() => setSelectedItem(null)}
                    className="absolute top-5 right-5 md:top-6 md:right-6 z-50 p-2.5 rounded-full transition-all duration-300 border shadow-sm bg-black/20 backdrop-blur-md text-white border-white/20 hover:bg-black/30 md:bg-white md:text-gray-400 md:border-gray-200 md:hover:bg-gray-50 md:hover:text-red-500"
                >
                    <X size={20} />
                </button>
            )}

            {/* Toast Notification */}
            {showToast && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-[#064E3B] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-fade-in-down border border-[#D4AF37]/20">
                    <CheckCircle2 size={16} className="text-[#D4AF37]" />
                    <span className="text-xs font-bold">Perubahan berhasil disimpan</span>
                </div>
            )}

            {/* LEFT SIDE: Header & Surveyor Info */}
            <div className="w-full md:w-[40%] bg-gradient-to-br from-[#064E3B] via-[#053D2E] to-[#022C22] p-4 md:p-8 flex flex-col justify-between relative overflow-hidden group shrink-0">
                {/* Pattern & Decor */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] rounded-full mix-blend-overlay opacity-20 blur-[50px] -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500 rounded-full mix-blend-overlay opacity-10 blur-[40px] translate-y-1/3 -translate-x-1/3"></div>

                {/* Top Content */}
                <div className="relative z-10 space-y-4 md:space-y-6">
                    <div className="flex flex-wrap gap-2 items-center w-full pr-14 md:pr-0">
                        <span className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm flex items-center gap-1.5 w-fit">
                            {activeTab === 'bumbu' && <ChefHat size={12} className="text-[#D4AF37]" />}
                            {activeTab === 'beras' && <ShoppingCart size={12} className="text-[#D4AF37]" />}
                            {activeTab === 'rte' && <UtensilsCrossed size={12} className="text-[#D4AF37]" />}
                            {activeTab === 'tenant' && <Store size={12} className="text-[#D4AF37]" />}
                            {activeTab === 'ekspedisi' && <Truck size={12} className="text-[#D4AF37]" />}
                            {activeTab === 'telco' && <Signal size={12} className="text-[#D4AF37]" />}
                            
                            {activeTab === 'bumbu' ? 'Konsumsi Bumbu' : 
                            activeTab === 'beras' ? 'Monitoring Beras' : 
                            activeTab === 'rte' ? 'RTE (Siap Saji)' : 
                            activeTab === 'tenant' ? 'Tenant Hotel' : 
                            activeTab === 'ekspedisi' ? 'Ekspedisi' : 'Telekomunikasi'}
                        </span>
                        <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] font-mono text-emerald-200/80 tracking-widest">
                            {surveyId}
                        </span>
                    </div>

                    <div>
                        {isEditing ? (
                             <input 
                                type="text" 
                                value={editForm.name || editForm.companyName || editForm.shopName || editForm.providerName || ''}
                                onChange={(e) => {
                                    const field = activeTab === 'tenant' ? 'shopName' : activeTab === 'telco' ? 'providerName' : activeTab === 'bumbu' ? 'name' : 'companyName';
                                    setEditForm({ ...editForm, [field]: e.target.value });
                                }}
                                className="text-2xl md:text-4xl font-bold text-white bg-white/10 border-b border-white/20 focus:border-[#D4AF37] outline-none w-full mb-2 rounded px-2 py-1"
                             />
                        ) : (
                            <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight drop-shadow-md tracking-tight mb-2">
                                {selectedItem.name || selectedItem.companyName || selectedItem.shopName || selectedItem.providerName}
                            </h2>
                        )}
                        
                        <div className="flex items-center gap-2">
                             <span className={`h-2 w-2 rounded-full ${statusColor} shadow-[0_0_8px_rgba(255,255,255,0.5)] animate-pulse`}></span>
                             <span className={`text-xs font-medium ${statusTextColor} tracking-wide uppercase`}>{status}</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                         <span className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-[#064E3B] text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20 flex items-center gap-1.5 w-fit">
                            <Calendar size={12} />
                            {selectedItem.date}
                        </span>
                        <span className="px-3 py-1.5 rounded-lg bg-[#064E3B]/40 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 w-fit">
                            <Clock size={12} />
                            {selectedItem.time}
                        </span>
                    </div>
                </div>

                {/* Bottom Content: Surveyor */}
                <div className="relative z-10 mt-6 md:mt-0 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B4941F] flex items-center justify-center text-[#064E3B] shadow-lg ring-2 ring-white/20">
                            <User size={24} strokeWidth={2} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider mb-0.5">Disurvei Oleh</p>
                            <p className="text-base font-bold text-white">{selectedItem.surveyor || '-'}</p>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-100/80 mt-0.5">
                                <CheckCircle2 size={12} />
                                Certified Surveyor
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: Details Grid */}
            <div className="w-full md:w-[60%] bg-[#F8F9FA] p-4 md:p-8 relative flex flex-col md:overflow-y-auto">
                {/* Edit Actions */}
                {canEdit && (
                    <div className="relative md:absolute md:top-6 md:right-20 z-20 flex justify-end gap-4 mb-4 md:mb-0">
                        {isEditing ? (
                            <>
                                <button 
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all shadow-sm"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-[#064E3B] text-white rounded-xl text-xs font-bold hover:bg-[#053D2E] transition-all shadow-lg shadow-[#064E3B]/20 flex items-center gap-2"
                                >
                                    <Save size={14} />
                                    Simpan
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="p-2 bg-white hover:bg-[#064E3B] text-gray-400 hover:text-white rounded-full transition-all duration-300 border border-gray-200 hover:border-[#064E3B] shadow-sm group"
                                title="Edit Laporan"
                            >
                                <Edit size={18} className="group-hover:scale-90 transition-transform" />
                            </button>
                        )}
                    </div>
                )}

                <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
                        <div className="w-1 h-6 bg-[#D4AF37] rounded-full"></div>
                        Detail Data
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6">
                        {activeTab === 'bumbu' && (
                            <>
                                <DetailRow label="Perusahaan" field="companyName" value={selectedItem.companyName} icon={Building2} delay={100} />
                                <DetailRow label="Lokasi Dapur" field="kitchenName" value={selectedItem.kitchenName} icon={ChefHat} delay={150} subValue={`GPS: ${coordinates}`} />
                                <DetailRow label="Alamat" field="address" value={selectedItem.address} icon={MapPin} delay={200} />
                                <DetailRow label="PIC Dapur" field="pic" value={selectedItem.pic} icon={User} delay={250} subValue={picContact} />
                                <DetailRow label="Volume" field="volume" value={`${selectedItem.volume} Ton`} icon={Package} delay={300} />
                                <DetailRow label="Harga" field="price" value={`SAR ${selectedItem.price}`} icon={DollarSign} delay={350} />
                                <DetailRow label="Bahan Lain" field="otherIngredients" value={selectedItem.otherIngredients} icon={FileText} delay={400} />
                                <DetailRow label="Asal Produk" field="originProduct" value={selectedItem.originProduct} icon={Globe} delay={450} />
                            </>
                        )}
                        {activeTab === 'beras' && (
                            <>
                                <DetailRow label="Jenis Beras" field="riceType" value={selectedItem.riceType} icon={Package} delay={100} />
                                <DetailRow label="Volume" field="volume" value={`${selectedItem.volume} Ton`} icon={Database} delay={150} />
                                <DetailRow label="Harga" field="price" value={`SAR ${selectedItem.price}`} icon={DollarSign} delay={200} />
                                <DetailRow label="Asal Produk" field="originProduct" value={selectedItem.originProduct} icon={Globe} delay={250} />
                                <DetailRow label="Harga Asal" field="productPrice" value={`Rp ${selectedItem.productPrice}`} icon={DollarSign} delay={300} />
                                <DetailRow label="Lokasi Dapur" field="kitchenName" value={selectedItem.kitchenName} icon={ChefHat} delay={350} subValue={`GPS: ${coordinates}`} />
                                <DetailRow label="Alamat" field="address" value={selectedItem.address} icon={MapPin} delay={400} />
                                <DetailRow label="PIC" field="pic" value={selectedItem.pic} icon={User} delay={450} subValue={picContact} />
                            </>
                        )}
                        {activeTab === 'rte' && (
                            <>
                                <DetailRow label="Menu" field="menu" value={selectedItem.menu} icon={UtensilsCrossed} delay={100} />
                                <DetailRow label="Volume" field="volume" value={`${selectedItem.volume} Porsi`} icon={Package} delay={150} />
                                <DetailRow label="Harga" field="price" value={`SAR ${selectedItem.price}`} icon={DollarSign} delay={200} />
                                <DetailRow label="Lokasi Dapur" field="kitchenName" value={selectedItem.kitchenName} icon={ChefHat} delay={250} subValue={`GPS: ${coordinates}`} />
                                <DetailRow label="Alamat" field="address" value={selectedItem.address} icon={MapPin} delay={300} />
                                <DetailRow label="Hotel" field="hotelName" value={`${selectedItem.hotelName} (${selectedItem.hotelNumber || '-'})`} icon={Building} delay={350} />
                                <DetailRow label="Kloter" field="kloterName" value={selectedItem.kloterName} icon={User} delay={400} />
                                <DetailRow label="PIC" field="pic" value={selectedItem.pic} icon={User} delay={450} subValue={picContact} />
                            </>
                        )}
                        {activeTab === 'tenant' && (
                            <>
                                <DetailRow label="Produk Utama" field="productType" value={selectedItem.productType} icon={ShoppingBag} delay={100} />
                                <DetailRow label="Produk Terlaris" field="bestSeller" value={selectedItem.bestSeller} icon={TrendingUp} delay={150} />
                                <DetailRow label="Biaya Sewa" field="rentCost" value={`SAR ${selectedItem.rentCost}`} icon={DollarSign} delay={200} />
                                <DetailRow label="Hotel" field="hotelName" value={selectedItem.hotelName} icon={Building} delay={250} />
                                <DetailRow label="Lokasi" field="location" value={selectedItem.location} icon={MapPin} delay={300} subValue={`GPS: ${coordinates}`} />
                                <DetailRow label="Sektor" field="sector" value={selectedItem.sector} icon={MapPin} delay={350} />
                                <DetailRow label="Alamat" field="address" value={selectedItem.address} icon={MapPin} delay={400} />
                                <DetailRow label="PIC" field="pic" value={selectedItem.pic} icon={User} delay={450} subValue={picContact} />
                            </>
                        )}
                        {activeTab === 'ekspedisi' && (
                            <>
                                <DetailRow label="Berat Total" field="weight" value={`${selectedItem.weight} Kg`} icon={Scale} delay={100} />
                                <DetailRow label="Harga / Kg" field="pricePerKg" value={`SAR ${selectedItem.pricePerKg}`} icon={DollarSign} delay={150} />
                                <DetailRow label="Hotel" field="hotelName" value={selectedItem.hotelName} icon={Building} delay={200} />
                                <DetailRow label="Lokasi" field="location" value={selectedItem.location} icon={MapPin} delay={250} subValue={`GPS: ${coordinates}`} />
                                <DetailRow label="Sektor" field="sector" value={selectedItem.sector} icon={MapPin} delay={300} />
                                <DetailRow label="Alamat" field="address" value={selectedItem.address} icon={MapPin} delay={350} />
                                <DetailRow label="PIC" field="pic" value={selectedItem.pic} icon={User} delay={400} subValue={picContact} />
                            </>
                        )}
                        {activeTab === 'telco' && (
                            <>
                                <DetailRow label="Nama Jemaah" field="respondentName" value={selectedItem.respondentName} icon={User} delay={100} />
                                <DetailRow label="Kloter" field="kloter" value={selectedItem.kloter} icon={User} delay={150} />
                                <DetailRow label="Embarkasi" field="embarkation" value={selectedItem.embarkation} icon={MapPin} delay={200} />
                                <DetailRow label="Provinsi" field="province" value={selectedItem.province} icon={MapPin} delay={250} />
                                <DetailRow label="Paket Roaming" field="roamingPackage" value={selectedItem.roamingPackage} icon={Signal} delay={300} />
                                <DetailRow label="Status" field="roamingPackage" value={selectedItem.roamingPackage ? 'Terisi' : 'Kosong'} icon={CheckCircle2} delay={350} />
                            </>
                        )}
                    </div>

                    {/* Surveyor Notes Section */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 animate-fade-in-up" style={{ animationDelay: '500ms', animationFillMode: 'forwards', opacity: 0 }}>
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <FileText size={12} />
                            Catatan Surveyor
                        </h4>
                        {isEditing ? (
                            <textarea
                                value={editForm.notes || ''}
                                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                className="w-full text-xs text-gray-600 leading-relaxed italic bg-white border border-gray-200 rounded-lg p-2 focus:border-[#064E3B] outline-none min-h-[80px] shadow-sm"
                                placeholder="Tambahkan catatan..."
                            />
                        ) : (
                            <p className="text-xs text-gray-600 leading-relaxed italic">
                                "{editForm.notes || defaultNotes}"
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  };

  return (
    <>
    <div className="space-y-8 animate-fade-in-up pb-10">
        
        <HeroSection
            title={<span>Laporan <span className="text-[#D4AF37]">Ekosistem Haji</span></span>}
            subtitle="Arsip lengkap dan rekapitulasi data real-time untuk kebutuhan pelaporan, audit, dan evaluasi layanan."
            currentDate={currentDate}
        >
             <div className="flex flex-row items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
                 <div className="flex items-center gap-2 flex-shrink-0">
                     <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs md:text-sm font-bold transition-all text-white hover:text-[#D4AF37] whitespace-nowrap shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 group">
                         <span className="hidden sm:inline">Export CSV</span><span className="sm:hidden">CSV</span>
                         <Download size={16} className="group-hover:translate-y-0.5 transition-transform duration-300" />
                     </button>
                 </div>

                 {/* Status Badge */}
                 <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/10 h-full min-h-[44px] flex-shrink-0 ml-auto sm:ml-0">
                    <div className="text-right">
                        <p className="text-[10px] text-emerald-100 uppercase tracking-wide hidden sm:block">Status Data</p>
                        <p className="text-xs md:text-sm font-bold text-white leading-none">Live<span className="hidden sm:inline"> Monitoring</span></p>
                    </div>
                    <div className="relative w-2 h-2 flex items-center justify-center">
                        <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
                        <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>
                    </div>
                 </div>
             </div>
        </HeroSection>

        {/* Tab Navigation - Premium Pill Style */}
        <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 custom-scrollbar px-1 -mx-4 md:mx-0 px-4 md:px-0">
            {[
                { id: 'bumbu', label: 'Konsumsi Bumbu', icon: ChefHat },
                { id: 'beras', label: 'Monitoring Beras', icon: ShoppingCart },
                { id: 'rte', label: 'RTE (Siap Saji)', icon: UtensilsCrossed },
                { id: 'tenant', label: 'Tenant Hotel', icon: Store },
                { id: 'ekspedisi', label: 'Ekspedisi Barang', icon: Truck },
                { id: 'telco', label: 'Telekomunikasi', icon: Signal },
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as any); setSearchTerm(''); }}
                    className={`group flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3.5 rounded-2xl text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border flex-shrink-0
                        ${activeTab === tab.id 
                            ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-lg shadow-[#064E3B]/20' 
                            : 'bg-white/60 text-gray-500 hover:bg-white hover:text-[#064E3B] border-transparent hover:border-gray-200'}`}
                >
                    <tab.icon size={14} className={`md:w-4 md:h-4 ${activeTab === tab.id ? 'text-[#D4AF37]' : 'text-gray-400 group-hover:text-[#064E3B]'}`} />
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Data Table Card */}
        <GlassCard className="min-h-[500px] !bg-white/70">
            {/* Filters Row */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 px-1 gap-4">
                
                {/* LEFT: Search & Filter Group */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                    
                    {/* Search Bar */}
                    <div className="relative group w-full sm:w-60">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#FBBF24] rounded-xl blur opacity-10 group-focus-within:opacity-20 transition-opacity"></div>
                        <div className="relative flex items-center">
                            <Search size={16} className="absolute left-4 text-gray-400 group-focus-within:text-[#064E3B] transition-colors" />
                            <input 
                                type="text" 
                                placeholder={getSearchPlaceholder()} 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs md:text-sm font-medium focus:outline-none focus:border-[#064E3B] focus:ring-4 focus:ring-[#064E3B]/5 transition-all placeholder-gray-400 text-gray-700"
                            />
                        </div>
                    </div>

                    {/* Filter Dropdown - Compact */}
                    <div className="relative w-full sm:w-auto min-w-[140px]">
                        <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-[11px] font-bold uppercase tracking-wide w-full justify-between h-full
                            ${isFilterOpen || filterMode !== 'newest' ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-lg' : 'bg-white text-gray-500 border-gray-200 hover:border-[#064E3B]'}`}
                        >
                            <div className="flex items-center gap-2">
                                    <ArrowDownUp size={14} />
                                    <span className="truncate">{filterOptions.find(f => f.id === filterMode)?.label.split(' ')[0] || 'Filter'}</span>
                            </div>
                            <ChevronDown size={14} className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <div className={`absolute top-full left-0 mt-2 w-full sm:w-48 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden transition-all duration-200 ease-out origin-top-left transform ${isFilterOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'}`}>
                            <div className="p-1.5">
                                {filterOptions.map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => {
                                            setFilterMode(opt.id as any);
                                            setIsFilterOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between group
                                            ${filterMode === opt.id 
                                                ? 'bg-[#064E3B]/5 text-[#064E3B]' 
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-[#064E3B]'}`}
                                    >
                                        {opt.label}
                                        {filterMode === opt.id && <Check size={14} className="text-[#064E3B]" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Total Record - Compact */}
                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm w-full lg:w-auto justify-center lg:justify-start">
                    <div className="p-1 bg-[#064E3B]/10 rounded-md text-[#064E3B]">
                            <Database size={12} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-0.5">Total Record</span>
                        <span className="text-[10px] font-bold text-gray-800 leading-none">{processedData.length} <span className="text-[8px] font-medium text-gray-400">Items</span></span>
                    </div>
                </div>

            </div>

            <div className="overflow-x-auto pb-4 -mx-5 md:-mx-8 px-5 md:px-8">
                {renderTable()}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200/60">
                <p className="text-xs font-medium text-gray-400">
                    Menampilkan <span className="text-gray-800 font-bold">{processedData.length} Data</span> dari total tersedia
                </p>
                <div className="flex gap-2">
                    <button disabled className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Prev</button>
                    <button disabled className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
                </div>
            </div>
        </GlassCard>
    </div>
    
    {/* Render Detail Modal */}
    <DetailModal />
    </>
  );
};
