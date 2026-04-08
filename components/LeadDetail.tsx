import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus, Note, WatchInterest } from '../types';
import { Edit2, Phone, Mail, MapPin, Clock, Globe, Heart, Send, Check, ArrowLeft, ChevronRight, X, Save, DollarSign, Link } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';

interface LeadDetailProps {
    lead: Lead;
    onBack: () => void;
}

const LeadDetail: React.FC<LeadDetailProps> = ({ lead: initialLead, onBack }) => {
    const [lead, setLead] = useState(initialLead);
    const [notes, setNotes] = useState<Note[]>([]);
    const [noteInput, setNoteInput] = useState('');

    // Modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: initialLead.name,
        email: initialLead.email,
        phone: initialLead.phone,
        budget: initialLead.budget
    });

    // Ganho modal states
    const [isGanhoModalOpen, setIsGanhoModalOpen] = useState(false);
    const [ganhoValor, setGanhoValor] = useState('');
    const [ganhoSaving, setGanhoSaving] = useState(false);

    // Inventory for linking
    const [inventory, setInventory] = useState<WatchInterest[]>([]);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [selectedEstoqueId, setSelectedEstoqueId] = useState('');
    const [linkSaving, setLinkSaving] = useState(false);

    useEffect(() => {
        loadNotes();
        loadInventory();
    }, [lead.id]);

    const loadNotes = async () => {
        const fetchedNotes = await supabaseService.getNotes(lead.id);
        setNotes(fetchedNotes);
    };

    const loadInventory = async () => {
        const items = await supabaseService.getInventory();
        setInventory(items);
    };

    const handleSendNote = async () => {
        if (!noteInput.trim()) return;
        await supabaseService.addNote(lead.id, noteInput);
        await loadNotes();
        setNoteInput('');
    };

    const handleUpdateProfile = async () => {
        await supabaseService.updateLead(lead.id, formData);
        setLead(prev => ({ ...prev, ...formData }));
        setIsEditModalOpen(false);
    };

    const handleStatusChange = async (newStatus: LeadStatus) => {
        if (newStatus === 'Ganho') {
            setIsStatusModalOpen(false);
            setGanhoValor('');
            setIsGanhoModalOpen(true);
            return;
        }
        await supabaseService.updateLeadStatus(lead.id, newStatus);
        setLead(prev => ({ ...prev, status: newStatus }));
        setIsStatusModalOpen(false);
    };

    const confirmGanho = async () => {
        const valorNum = parseFloat(ganhoValor.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
        setGanhoSaving(true);
        try {
            await supabaseService.markLeadAsGanho(lead.id, valorNum, lead.estoqueId);
            setLead(prev => ({ ...prev, status: 'Ganho', valorFinalVenda: valorNum }));
            setIsGanhoModalOpen(false);
        } catch (err) {
            console.error(err);
        } finally {
            setGanhoSaving(false);
        }
    };

    const handleLinkWatch = async () => {
        if (!selectedEstoqueId) return;
        setLinkSaving(true);
        try {
            await supabaseService.linkWatchToLead(lead.id, selectedEstoqueId);
            setLead(prev => ({ ...prev, estoqueId: selectedEstoqueId }));
            setIsLinkModalOpen(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLinkSaving(false);
        }
    };

    const linkedWatch = lead.estoqueId ? inventory.find(w => w.id === lead.estoqueId) : null;

    const statusOptions: LeadStatus[] = ['Novo Lead', 'Qualificado', 'Follow-up', 'Agendou Visita', 'Em Negociação', 'Ganho', 'Perdido'];

    return (
        <div className="animate-fade-in max-w-6xl mx-auto pb-10 relative">
            {/* Navigation Header */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-3 text-gray-500 hover:text-chronos-900 transition-colors group"
                >
                    <div className="p-2 bg-white border border-gray-200 rounded-lg group-hover:border-chronos-300 group-hover:shadow-sm transition-all shadow-sm">
                        <ArrowLeft size={20} />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-xs font-medium text-gray-400 group-hover:text-chronos-600 uppercase tracking-wide">Retornar</span>
                        <span className="font-bold text-gray-800 group-hover:text-chronos-900">Voltar para Pipeline</span>
                    </div>
                </button>

                <div className="hidden md:flex items-center text-sm text-gray-400">
                    <span>Pipeline</span>
                    <ChevronRight size={14} className="mx-2" />
                    <span>Leads Ativos</span>
                    <ChevronRight size={14} className="mx-2" />
                    <span className="text-gray-900 font-medium">{lead.name}</span>
                </div>
            </div>

            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <img src={lead.avatar} alt={lead.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
                            <span className={`absolute bottom-1 right-1 w-5 h-5 border-2 border-white rounded-full ${lead.status === 'Novo Lead' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-gray-900">{lead.name}</h1>
                            <div className="flex items-center gap-3 mt-1 text-gray-500 text-sm">
                                <span className="font-medium text-gray-700">{lead.handle}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-800">
                                    {lead.status}
                                </span>
                                {lead.status === 'Ganho' && lead.valorFinalVenda != null && lead.valorFinalVenda > 0 && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-800">
                                        <DollarSign size={10} /> R$ {lead.valorFinalVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                <div className="flex items-center gap-1"><MapPin size={14} /> {lead.location}</div>
                                <div className="flex items-center gap-1"><Clock size={14} /> Ativo {lead.lastActive}</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Edit2 size={16} /> Editar Perfil
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Col: Contact Info & Status */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="font-bold text-lg text-gray-900 mb-4">Informações de Contato</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-green-50 rounded-lg text-green-600"><Mail size={20} /></div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</p>
                                    <p className="text-gray-900 font-medium">{lead.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-green-50 rounded-lg text-green-600"><Phone size={20} /></div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Telefone</p>
                                    <p className="text-gray-900 font-medium">{lead.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-green-50 rounded-lg text-green-600"><Globe size={20} /></div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Orçamento</p>
                                    <p className="text-gray-900 font-medium">{lead.budget || 'Não informado'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsStatusModalOpen(true)}
                        className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-200 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
                    >
                        <Check size={20} /> Mover Etapa Pipeline
                    </button>
                </div>

                {/* Center/Right Col: Interests & Notes */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Watch Interests */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-gray-900">Interesses em Relógios</h3>
                            <button
                                onClick={() => { setSelectedEstoqueId(lead.estoqueId || ''); setIsLinkModalOpen(true); }}
                                className="flex items-center gap-1.5 text-sm font-medium text-chronos-700 hover:text-chronos-900 border border-chronos-200 hover:border-chronos-400 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Link size={14} /> Vincular ao Estoque
                            </button>
                        </div>

                        {/* Linked watch badge */}
                        {linkedWatch && (
                            <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                                <Check size={14} className="text-green-600" />
                                <span>Relógio vinculado: <span className="font-bold">{linkedWatch.brand} {linkedWatch.model}</span> — será removido do estoque ao fechar a venda.</span>
                            </div>
                        )}

                        {lead.interests.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {lead.interests.map(watch => (
                                    <div key={watch.id} className="border border-gray-100 rounded-xl p-3 hover:shadow-md transition-shadow">
                                        <div className="relative mb-3 bg-gray-50 rounded-lg p-2 flex justify-center">
                                            <button className="absolute top-2 right-2 text-gray-300 hover:text-red-500">
                                                <Heart size={16} />
                                            </button>
                                            <img src={watch.image} alt={watch.model} className="h-32 object-contain mix-blend-multiply" />
                                        </div>
                                        <p className="text-xs text-gray-500">{watch.brand}</p>
                                        <p className="text-sm font-bold text-gray-900 truncate">{watch.model}</p>
                                        <p className="text-green-600 font-semibold text-sm mt-1">R$ {watch.price.toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500">Nenhum relógio selecionado.</p>
                                <button
                                    onClick={() => { setSelectedEstoqueId(''); setIsLinkModalOpen(true); }}
                                    className="mt-2 text-green-600 font-medium text-sm"
                                >
                                    Vincular ao Estoque
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Internal Notes */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[400px]">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="font-bold text-lg text-gray-900">Notas Internas</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
                            {notes.length === 0 && <p className="text-center text-gray-400 text-sm mt-10">Nenhuma nota ainda. Comece a discussão.</p>}
                            {notes.map(note => (
                                <div key={note.id} className={`flex gap-3 ${note.isMe ? 'justify-end' : 'justify-start'}`}>
                                    {!note.isMe && <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">JD</div>}
                                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${note.isMe ? 'bg-white border border-gray-200 rounded-tr-none shadow-sm' : 'bg-gray-100 rounded-tl-none text-gray-800'}`}>
                                        <p className="text-gray-700 leading-relaxed">{note.content}</p>
                                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                                            {note.isMe && <div className="w-4 h-4 rounded-full bg-chronos-100 flex items-center justify-center text-[10px] text-chronos-600 font-bold">V</div>}
                                            <span>{note.author} • {note.createdAt}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-white rounded-b-2xl">
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm"
                                    placeholder="Adicionar nota..."
                                    value={noteInput}
                                    onChange={(e) => setNoteInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendNote()}
                                />
                                <button
                                    onClick={handleSendNote}
                                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${noteInput.trim() ? 'text-green-600 hover:bg-green-50' : 'text-gray-300'}`}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg text-gray-900">Editar Perfil</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome Completo</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Telefone</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Orçamento Disponível</label>
                                <input
                                    type="text"
                                    value={formData.budget}
                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                            <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">Cancelar</button>
                            <button onClick={handleUpdateProfile} className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                                <Save size={18} /> Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Move Stage Modal */}
            {isStatusModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg text-gray-900">Mover Lead</h3>
                            <button onClick={() => setIsStatusModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-500 mb-4">Selecione a nova etapa para este lead:</p>
                            <div className="space-y-2">
                                {statusOptions.map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusChange(status)}
                                        className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between group ${lead.status === status
                                                ? 'border-green-500 bg-green-50 text-green-700'
                                                : 'border-gray-100 hover:border-green-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="font-medium">{status}</span>
                                        {lead.status === status && <Check size={16} className="text-green-600" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Ganho Modal — Valor Final da Venda */}
            {isGanhoModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm animate-fade-in px-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-50 rounded-full text-green-600">
                                    <DollarSign size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Negócio Fechado!</h3>
                            </div>
                            <button onClick={() => setIsGanhoModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-gray-500 text-sm mb-6 pl-1">Informe o valor final da venda para registrar a receita corretamente.</p>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Valor Final da Venda (R$)</label>
                            <input
                                type="number"
                                value={ganhoValor}
                                onChange={e => setGanhoValor(e.target.value)}
                                autoFocus
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none text-lg font-semibold"
                                placeholder="Ex: 85000"
                            />
                            <p className="text-xs text-gray-400 mt-1">Deixe em 0 se não quiser registrar valor agora.</p>
                        </div>
                        <div className="flex gap-3 justify-end mt-6">
                            <button
                                onClick={() => setIsGanhoModalOpen(false)}
                                disabled={ganhoSaving}
                                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmGanho}
                                disabled={ganhoSaving}
                                className="px-5 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all flex items-center gap-2 disabled:opacity-60"
                            >
                                {ganhoSaving && <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>}
                                <Check size={18} /> Confirmar Venda
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Link Watch Modal */}
            {isLinkModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm animate-fade-in px-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Vincular Relógio do Estoque</h3>
                            <button onClick={() => setIsLinkModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Selecione o relógio do estoque que será vendido para este lead. Ele será removido automaticamente ao fechar a venda.</p>
                        <select
                            value={selectedEstoqueId}
                            onChange={e => setSelectedEstoqueId(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-chronos-500 focus:outline-none text-sm mb-6"
                        >
                            <option value="">— Selecione um relógio —</option>
                            {inventory.map(w => (
                                <option key={w.id} value={w.id}>
                                    {w.brand} {w.model} ({w.reference}) — R$ {w.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </option>
                            ))}
                        </select>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setIsLinkModalOpen(false)}
                                disabled={linkSaving}
                                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleLinkWatch}
                                disabled={linkSaving || !selectedEstoqueId}
                                className="px-5 py-2.5 rounded-xl bg-chronos-900 text-white font-medium hover:bg-chronos-800 shadow-lg transition-all flex items-center gap-2 disabled:opacity-60"
                            >
                                {linkSaving && <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>}
                                <Link size={16} /> Vincular Relógio
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeadDetail;
