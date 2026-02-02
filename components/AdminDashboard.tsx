import React, { useEffect, useState } from 'react';
import { Registration, RegistrationStatus } from '../types';
import * as api from '../services/api';
import { Check, Clock, FileText, Search, User, ShieldCheck, Loader2 } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'VALIDATED'>('PENDING');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const data = await api.getRegistrations();
    setRegistrations(data);
    setLoading(false);
  };

  const handleValidate = async (id: string) => {
    setActionLoading(id);
    await api.validateRegistration(id);
    await fetchData(); // Refresh list
    setActionLoading(null);
  };

  const handleViewReceipt = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      alert("Fichier non disponible");
    }
  };

  const filteredData = registrations.filter(r => {
    if (filter === 'ALL') return true;
    if (filter === 'PENDING') return r.status === 'PENDING';
    if (filter === 'VALIDATED') return r.status === 'VALIDATED' || r.status === 'FREE_ACCESS';
    return true;
  });

  const getStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3 h-3 mr-1" /> En attente
          </span>
        );
      case 'VALIDATED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <Check className="w-3 h-3 mr-1" /> Payé & Validé
          </span>
        );
      case 'FREE_ACCESS':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <ShieldCheck className="w-3 h-3 mr-1" /> Gratuit (QCM)
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Admin */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
            <div className="p-2 bg-slate-900 dark:bg-white rounded-lg mr-3">
                 <ShieldCheck className="w-6 h-6 text-white dark:text-slate-900" />
            </div>
            Administration
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Gérez les inscriptions et validez les reçus de paiement.</p>
        </div>
        
        <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <button 
            onClick={() => setFilter('PENDING')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${filter === 'PENDING' ? 'bg-primary-50 text-primary-700 dark:bg-slate-700 dark:text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
          >
            En attente <span className="ml-1 px-1.5 py-0.5 bg-primary-200 dark:bg-slate-600 rounded-full text-[10px]">{registrations.filter(r => r.status === 'PENDING').length}</span>
          </button>
          <button 
            onClick={() => setFilter('VALIDATED')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${filter === 'VALIDATED' ? 'bg-primary-50 text-primary-700 dark:bg-slate-700 dark:text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
          >
            Validés
          </button>
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${filter === 'ALL' ? 'bg-primary-50 text-primary-700 dark:bg-slate-700 dark:text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
          >
            Tout
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
        </div>
      ) : filteredData.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="inline-flex p-4 rounded-full bg-slate-50 dark:bg-slate-800 mb-4">
             <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">Aucune inscription trouvée</h3>
          <p className="text-slate-500 dark:text-slate-400">Il n'y a pas de demande correspondant à ce filtre.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredData.map((reg) => (
            <div 
              key={reg.id} 
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              {/* User Info */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <User className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 dark:text-white">{reg.user.nom} {reg.user.prenom}</h3>
                    {getStatusBadge(reg.status)}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                    <span className="font-mono text-xs opacity-75 mr-2">{reg.user.email}</span>
                    <span className="text-slate-300 mx-2">•</span>
                    <span className="text-xs">Inscrit le {new Date(reg.date).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>

              {/* Actions Panel */}
              <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0 pl-14 md:pl-0">
                {reg.status === 'PENDING' && (
                  <>
                     <button 
                        onClick={() => handleViewReceipt(reg.receiptUrl)}
                        className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                     >
                        <FileText className="w-4 h-4 mr-2" />
                        Voir le Reçu
                        <span className="ml-2 text-[10px] text-slate-400 border border-slate-200 dark:border-slate-600 px-1 rounded">
                            {reg.receiptUrl ? reg.receiptUrl.split('.').pop()?.toUpperCase() : 'PDF'}
                        </span>
                    </button>
                    <button 
                      onClick={() => handleValidate(reg.id)}
                      disabled={actionLoading === reg.id}
                      className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
                    >
                      {actionLoading === reg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                      Valider
                    </button>
                  </>
                )}
                
                {reg.status !== 'PENDING' && reg.status !== 'FREE_ACCESS' && (
                   <div className="flex gap-2">
                       {reg.receiptUrl && (
                            <button 
                                onClick={() => handleViewReceipt(reg.receiptUrl)}
                                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 p-2"
                                title="Voir le reçu"
                            >
                                <FileText className="w-4 h-4" />
                            </button>
                       )}
                        <button disabled className="text-emerald-600 dark:text-emerald-500 text-sm font-medium flex items-center px-4 py-2 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-900/20 cursor-default">
                            <Check className="w-4 h-4 mr-2" /> Paiement validé
                        </button>
                   </div>
                )}
                
                 {reg.status === 'FREE_ACCESS' && (
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-medium px-4 py-2 opacity-75">
                       Membre Premium
                    </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;