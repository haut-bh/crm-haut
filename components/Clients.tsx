import React, { useState, useEffect } from 'react';
import { MOCK_LEADS } from '../constants';
import { supabaseService } from '../services/supabaseService';
import { Mail, Phone, MoreHorizontal, Filter, Download, Trash2, AlertTriangle, X, Plus, UserPlus } from 'lucide-react';
import { Lead } from '../types';

const Clients: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', budget: '', watchInterest: '', objetivo: '', qualificado: false });
  const [leadSaving, setLeadSaving] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  useEffect(() => {
    // Initial fetch
    const loadLeads = async () => {
        const data = await supabaseService.getLeads();
        setLeads(data);
    };
    loadLeads();
    
    // Subscribe to changes (so if we delete in pipeline, it reflects here)
    const unsubscribe = supabaseService.subscribeToLeads((updatedLeads) => {
        setLeads(updatedLeads);
    });
    return () => unsubscribe();
  }, []);

  const toggleSelectAll = () => {
      if (selectedIds.size === leads.length) {
          setSelectedIds(new Set());
      } else {
          setSelectedIds(new Set(leads.map(l => l.id)));
      }
  };

  const toggleSelect = (id: string) => {
      setSelectedIds(prev => {
          const newSet = new Set(prev);
          if (newSet.has(id)) newSet.delete(id);
          else newSet.add(id);
          return newSet;
      });
  };

  const handleNewLead = async () => {
    if (!leadForm.name.trim()) {
      setLeadError('O nome do lead é obrigatório.');
      return;
    }

    setLeadSaving(true);
    setLeadError(null);
    try {
      await supabaseService.addLead(leadForm);
      const data = await supabaseService.getLeads();
      setLeads(data);
      setIsNewLeadOpen(false);
      setLeadForm({ name: '', email: '', phone: '', budget: '', watchInterest: '', objetivo: '', qualificado: false });
    } catch (err: any) {
      setLeadError(err?.message || 'Erro ao salvar. Tente novamente.');
    } finally {
      setLeadSaving(false);
    }
  };

  const confirmBulkDelete = async () => {
      await supabaseService.deleteLeads(Array.from(selectedIds));
      setSelectedIds(new Set());
      setShowDeleteConfirm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Base de Clientes</h1>
        <div className="flex space-x-2">
             {selectedIds.size > 0 && (
                <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center space-x-1 px-4 py-2 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 hover:bg-red-100 transition-colors"
                >
                    <Trash2 size={16} /> <span>Excluir ({selectedIds.size})</span>
                </button>
            )}
            <button
                onClick={() => { setLeadError(null); setLeadForm({ name: '', email: '', phone: '', budget: '', watchInterest: '' }); setIsNewLeadOpen(true); }}
                className="flex items-center space-x-1 px-4 py-2 bg-chronos-900 text-white rounded-lg text-sm hover:bg-chronos-800 transition-colors"
            >
                <UserPlus size={16} /> <span>Novo Lead</span>
            </button>
            <button className="flex items-center space-x-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <Filter size={16} /> <span>Segmentar</span>
            </button>
            <button className="flex items-center space-x-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <Download size={16} /> <span>Exportar CSV</span>
            </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4 w-12">
                        <input 
                            type="checkbox" 
                            className="rounded border-gray-300 text-chronos-600 focus:ring-chronos-500"
                            checked={leads.length > 0 && selectedIds.size === leads.length}
                            onChange={toggleSelectAll}
                        />
                    </th>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Contato</th>
                    <th className="px-6 py-4">Localização</th>
                    <th className="px-6 py-4">Valor Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {leads.map((client) => {
                    const isSelected = selectedIds.has(client.id);
                    return (
                        <tr key={client.id} className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50/30' : ''}`}>
                            <td className="px-6 py-4">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-gray-300 text-chronos-600 focus:ring-chronos-500"
                                    checked={isSelected}
                                    onChange={() => toggleSelect(client.id)}
                                />
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                    <img src={client.avatar} className="w-10 h-10 rounded-full object-cover" alt={client.name} />
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">{client.name}</div>
                                        <div className="text-xs text-gray-500">{client.handle}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col space-y-1">
                                    <div className="flex items-center text-xs text-gray-600"><Mail size={12} className="mr-1"/> {client.email}</div>
                                    <div className="flex items-center text-xs text-gray-600"><Phone size={12} className="mr-1"/> {client.phone}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                {client.location}
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                {client.budget}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                    ${client.status === 'Perdido' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                    {client.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="relative group">
                                    <button className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <MoreHorizontal size={18} />
                                    </button>
                                    {/* Action Menu (Simple version) */}
                                    <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1">
                                        <button 
                                            onClick={() => {
                                                setSelectedIds(new Set([client.id]));
                                                setShowDeleteConfirm(true);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                        >
                                            <Trash2 size={14} className="mr-2"/> Excluir
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
      </div>

      {/* Novo Lead Modal */}
      {isNewLeadOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-gray-900">Novo Lead</h2>
              <button onClick={() => setIsNewLeadOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={leadForm.name}
                  onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-chronos-500 focus:outline-none"
                  placeholder="Ex: João Silva"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    type="text"
                    value={leadForm.phone}
                    onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-chronos-500 focus:outline-none"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={leadForm.email}
                    onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-chronos-500 focus:outline-none"
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Orçamento Disponível</label>
                <input
                  type="text"
                  value={leadForm.budget}
                  onChange={e => setLeadForm({ ...leadForm, budget: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-chronos-500 focus:outline-none"
                  placeholder="Ex: 50.000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Relógio de Interesse</label>
                <input
                  type="text"
                  value={leadForm.watchInterest}
                  onChange={e => setLeadForm({ ...leadForm, watchInterest: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-chronos-500 focus:outline-none"
                  placeholder="Ex: Rolex Submariner"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo</label>
                <div className="flex gap-3">
                  {['Compra', 'Venda', 'Troca'].map(op => (
                    <button key={op} type="button"
                      onClick={() => setLeadForm({ ...leadForm, objetivo: leadForm.objetivo === op ? '' : op })}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        leadForm.objetivo === op
                          ? 'bg-chronos-900 text-white border-chronos-900'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-chronos-400'
                      }`}>
                      {op}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-700">Lead Qualificado</p>
                  <p className="text-xs text-gray-400">Marque se este lead já foi qualificado</p>
                </div>
                <button type="button" onClick={() => setLeadForm({ ...leadForm, qualificado: !leadForm.qualificado })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${leadForm.qualificado ? 'bg-chronos-700' : 'bg-gray-300'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${leadForm.qualificado ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

            {leadError && (
              <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <X size={16} className="mt-0.5 shrink-0" />{leadError}
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => setIsNewLeadOpen(false)}
                disabled={leadSaving}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleNewLead}
                disabled={leadSaving}
                className="px-6 py-2 bg-chronos-900 text-white rounded-lg hover:bg-chronos-800 transition-colors font-medium shadow-md disabled:opacity-60 flex items-center gap-2"
              >
                {leadSaving && <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>}
                Salvar Lead
              </button>
            </div>
          </div>
        </div>
      )}

       {/* Delete Confirmation Modal */}
       {showDeleteConfirm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm animate-fade-in px-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-red-50 rounded-full text-red-500">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Excluir Clientes</h3>
                        </div>
                        <button onClick={() => setShowDeleteConfirm(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Tem certeza que deseja excluir <strong>{selectedIds.size}</strong> clientes selecionados?
                        <br/>
                        Esta ação removerá todo o histórico e não pode ser desfeita.
                    </p>

                    <div className="flex gap-3 justify-end">
                        <button 
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={confirmBulkDelete}
                            className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all flex items-center gap-2"
                        >
                            <Trash2 size={18} /> Excluir Tudo
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default Clients;