import { useState } from 'react';
import type { ServiceHistory, ProductHistory } from '../../../models/';

interface Props {
  history: {
    servicesHistory: ServiceHistory[];
    productsHistory: ProductHistory[];
  } | null;
  clientName: string;
  onClose: () => void;
  isLoading: boolean;
}

export const PurchaseHistoryModal = ({ history, clientName, onClose, isLoading }: Props) => {
  const [activeTab, setActiveTab] = useState<'services' | 'products'>('services');

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })
    };
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-jet-black/95 backdrop-blur-md"></div>
      
      <div className="bg-jet-black border border-white/10 p-6 rounded-xl w-full max-w-4xl relative z-10 shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-lavender uppercase tracking-tight">
              Historial: <span className="text-icy-blue">{clientName}</span>
            </h2>
            <span className="text-[10px] text-pale-slate/40 uppercase tracking-[0.2em]">Registro detallado de actividad</span>
          </div>
          <button onClick={onClose} className="px-4 py-2 text-[10px] font-black text-pale-slate hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all uppercase">
            Cerrar
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-8 mb-6 border-b border-white/5">
          <button onClick={() => setActiveTab('services')} className={`pb-3 text-[11px] font-black uppercase tracking-[0.2em] relative transition-all ${activeTab === 'services' ? 'text-icy-blue' : 'text-pale-slate/30 hover:text-white/60'}`}>
            Servicios ({history?.servicesHistory?.length || 0})
            {activeTab === 'services' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-icy-blue shadow-[0_0_10px_rgba(173,216,230,0.3)]" />}
          </button>
          <button onClick={() => setActiveTab('products')} className={`pb-3 text-[11px] font-black uppercase tracking-[0.2em] relative transition-all ${activeTab === 'products' ? 'text-icy-blue' : 'text-pale-slate/30 hover:text-white/60'}`}>
            Productos ({history?.productsHistory?.length || 0})
            {activeTab === 'products' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-icy-blue shadow-[0_0_10px_rgba(173,216,230,0.3)]" />}
          </button>
        </div>

        {/* CONTENT */}
        <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
          {isLoading ? (
            <div className="py-20 text-center text-pale-slate animate-pulse uppercase text-[10px] tracking-widest">Cargando datos...</div>
          ) : activeTab === 'services' ? (
            <div className="space-y-6">
              {history?.servicesHistory.map((sale) => {
                const { date, time } = formatDateTime(sale.created_at);
                return (
                  <div key={sale.sale_id} className="bg-white/[0.02] border border-white/5 p-5 rounded-xl">
                    <div className="mb-6"> 
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] bg-icy-blue/10 text-icy-blue px-2 py-0.5 rounded font-bold">{date}</span>
                        <span className="text-[10px] text-pale-slate/50 font-mono">{time} HS</span>
                      </div>
                      <p className="text-sm font-black text-lavender tracking-tight uppercase italic">{sale.vehicle_info}</p>
                    </div>
                    
                    <table className="w-full text-[11px] table-fixed">
                      <thead>
                        <tr className="text-left text-pale-slate/40 uppercase font-black text-[9px] tracking-widest border-b border-white/5">
                          <th className="pb-2 w-[75%]">Servicio</th>
                          <th className="pb-2 text-right w-[25%] text-icy-blue/60">Sub Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.03]">
                        {sale.services.map((s, i) => (
                          <tr key={i} className="text-pale-slate/80">
                            <td className="py-2.5 truncate pr-4" title={s.name}>
                              <span className="text-icy-blue/40 mr-2">•</span>{s.name}
                            </td>
                            <td className="py-2.5 text-right font-bold text-lavender/60">
                              ${parseFloat(s.price).toLocaleString('es-AR')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-end items-baseline gap-2">
                      <span className="text-[10px] text-pale-slate/40 font-bold uppercase tracking-widest">Total:</span>
                      <span className="text-md font-black text-white">${parseFloat(sale.sale_total).toLocaleString('es-AR')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6">
              {history?.productsHistory.map((sale) => {
                const { date, time } = formatDateTime(sale.created_at);
                return (
                  <div key={sale.sale_id} className="bg-white/[0.02] border border-white/5 p-5 rounded-xl">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="text-[10px] bg-icy-blue/10 text-icy-blue px-2 py-0.5 rounded font-bold">{date}</span>
                      <span className="text-[10px] text-pale-slate/50 font-mono">{time} HS</span>
                    </div>
                    
                    <table className="w-full text-[11px] table-fixed">
                      <thead>
                        <tr className="text-left text-pale-slate/40 uppercase font-black text-[9px] tracking-widest border-b border-white/5">
                          <th className="pb-2 w-1/2">Producto</th>
                          <th className="pb-2 text-center w-1/4">Cant.</th>
                          <th className="pb-2 text-right w-1/4 text-icy-blue/60">Sub Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.03]">
                        {sale.products.map((p, i) => (
                          <tr key={i} className="text-pale-slate/80">
                            <td className="py-2.5 truncate pr-2" title={p.name}>{p.name}</td>
                            <td className="py-2.5 text-center font-bold text-lavender/60">{p.quantity}</td>
                            <td className="py-2.5 text-right font-bold text-lavender/60">${parseFloat(p.subtotal).toLocaleString('es-AR')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-end items-baseline gap-2">
                      <span className="text-[10px] text-pale-slate/40 font-bold uppercase tracking-widest">Total:</span>
                      <span className="text-md font-black text-white">${parseFloat(sale.sale_total).toLocaleString('es-AR')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};