import React, { useEffect, useState, useCallback } from 'react';
import { Lead, LeadStatus } from '../types';
import { supabaseService } from '../services/supabaseService';
import { Search, Filter, ArrowUpDown, Calendar, Plus, MoreHorizontal, MessageSquare, Trash2, AlertTriangle, X, CheckSquare, Clock } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

// Helper para cores do status
const getStatusColor = (status: LeadStatus) => {
    switch (status) {
        case 'Novo Lead': return 'bg-blue-50 text-blue-700 border-blue-100';
        case 'Qualificado': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
        case 'Follow-up': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
        case 'Agendou Visita': return 'bg-purple-50 text-purple-700 border-purple-100';
        case 'Em Negociação': return 'bg-orange-50 text-orange-700 border-orange-100';
        case 'Ganho': return 'bg-green-50 text-green-700 border-green-100';
        case 'Perdido': return 'bg-red-50 text-red-700 border-red-100';
        default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
};

interface LeadCardProps {
    lead: Lead;
    index: number;
    onClick: (lead: Lead) => void;
    onDelete: (lead: Lead) => void;
    isSelected: boolean;
    onToggleSelect: (id: string) => void;
}

// Componente LeadCard extraído e memoizado para performance
const LeadCard = React.memo(({ lead, index, onClick, onDelete, isSelected, onToggleSelect }: LeadCardProps) => {
    // Get last note for preview
    const lastNote = lead.notes.length > 0 ? lead.notes[lead.notes.length - 1] : null;

    return (
        <Draggable draggableId={lead.id} index={index}>
            {(provided, snapshot) => {
                const style = {
                    ...provided.draggableProps.style,
                    ...(snapshot.isDragging && provided.draggableProps.style?.transform ? {
                        transform: `${provided.draggableProps.style.transform} rotate(3deg) scale(1.05)`,
                    } : {})
                };

                return (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={style}
                        onClick={() => onClick(lead)}
                        className={`relative bg-white p-5 rounded-2xl border cursor-grab hover:shadow-lg transition-all group ${isSelected ? 'ring-2 ring-chronos-500 border-chronos-500 bg-chronos-50/10' : ''
                            } ${snapshot.isDragging
                                ? 'shadow-2xl border-chronos-300 ring-2 ring-chronos-500/20 z-50'
                                : 'shadow-sm border-gray-100'
                            }`}
                    >
                        {/* Note Preview Tooltip */}
                        {lastNote && (
                            <div className="absolute inset-x-0 bottom-0 translate-y-[95%] opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none px-2">
                                <div className="bg-gray-900 text-white text-xs p-3 rounded-xl shadow-xl border border-gray-800 relative">
                                    <div className="absolute -top-1.5 left-8 w-3 h-3 bg-gray-900 rotate-45 border-t border-l border-gray-800"></div>
                                    <p className="line-clamp-3 font-medium text-gray-200 italic">"{lastNote.content}"</p>
                                    <div className="flex items-center gap-1 mt-2 text-gray-500">
                                        <Clock size={10} />
                                        <span className="text-[10px]">{lastNote.createdAt} • {lastNote.author}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Selection Checkbox (Visible on hover or selected) */}
                        <div
                            className={`absolute top-3 right-3 z-10 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleSelect(lead.id);
                            }}
                        >
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${isSelected ? 'bg-chronos-600 border-chronos-600' : 'bg-white border-gray-200 hover:border-chronos-500'}`}>
                                {isSelected && <CheckSquare size={12} className="text-white" />}
                            </div>
                        </div>

                        <div className="flex items-start gap-3 mb-3">
                            <div className="relative">
                                <img src={lead.avatar} alt={lead.name} className="w-12 h-12 rounded-full object-cover border border-gray-100 shadow-sm" />
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(lead.status).split(' ')[0].replace('bg-', 'bg-')}`}></div>
                            </div>
                            <div className="flex-1 min-w-0 pt-0.5">
                                <h4 className="font-serif font-bold text-gray-900 text-base leading-tight truncate">{lead.name}</h4>
                                <p className="text-xs text-gray-500 truncate">{lead.handle}</p>
                            </div>
                        </div>

                        <div className="mb-4 pl-1">
                            <p className="text-sm text-gray-900 font-semibold mb-1">
                                {lead.interests.length > 0 ? lead.interests[0].model : 'Procurando relógio'}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                <div className="flex items-center gap-1.5" title={`Adicionado em: ${lead.addedAt}`}>
                                    <Calendar size={12} />
                                    <span>Add: {lead.addedAt}</span>
                                </div>
                                {lead.notes.length > 0 && (
                                    <div className="flex items-center gap-1 text-gray-400">
                                        <MessageSquare size={12} />
                                        <span>{lead.notes.length}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-50">
                            <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider ${getStatusColor(lead.status)}`}>
                                {lead.status === 'Novo Lead' ? 'NOVO LEAD' : lead.status.toUpperCase()}
                            </span>

                            {lead.tags.slice(0, 2).map((tag, idx) => (
                                <span key={idx} className={`text-[10px] px-2.5 py-1 rounded-md font-medium border
                            ${tag === 'Alta Intenção' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                        tag === 'Indicação VIP' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                            tag === 'Oferta Pendente' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                                'bg-gray-50 text-gray-500 border-gray-100'
                                    }`}>
                                    {tag}
                                </span>
                            ))}

                            {/* Delete Action - Subtle */}
                            <button
                                className="ml-auto p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(lead);
                                }}
                                title="Excluir Lead"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                );
            }}
        </Draggable>
    );
});

interface PipelineProps {
    onLeadClick: (lead: Lead) => void;
}

const Pipeline: React.FC<PipelineProps> = ({ onLeadClick }) => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
    const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
    const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

    useEffect(() => {
        const fetchLeads = async () => {
            const data = await supabaseService.getLeads();
            setLeads(data);
            setLoading(false);
        };
        fetchLeads();

        const unsubscribe = supabaseService.subscribeToLeads((updatedLeads) => {
            setLeads(updatedLeads);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const updatedLeads = leads.map(lead => {
            if (lead.id === draggableId) {
                return {
                    ...lead,
                    status: destination.droppableId as LeadStatus,
                    lastStatusChange: new Date().toISOString()
                };
            }
            return lead;
        });

        setLeads(updatedLeads);
        await supabaseService.updateLeadStatus(draggableId, destination.droppableId as LeadStatus);
    };

    const handleDeleteRequest = useCallback((lead: Lead) => {
        setLeadToDelete(lead);
    }, []);

    const confirmDelete = async () => {
        if (leadToDelete) {
            await supabaseService.deleteLead(leadToDelete.id);
            setLeadToDelete(null);
            // If the deleted lead was selected, remove it from selection
            if (selectedLeadIds.has(leadToDelete.id)) {
                const newSelection = new Set(selectedLeadIds);
                newSelection.delete(leadToDelete.id);
                setSelectedLeadIds(newSelection);
            }
        }
    };

    const confirmBulkDelete = async () => {
        await supabaseService.deleteLeads(Array.from(selectedLeadIds));
        setSelectedLeadIds(new Set());
        setShowBulkDeleteConfirm(false);
    };

    const cancelDelete = () => {
        setLeadToDelete(null);
        setShowBulkDeleteConfirm(false);
    };

    const toggleSelect = useCallback((id: string) => {
        setSelectedLeadIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }, []);

    const stages: { id: LeadStatus, label: string, color: string }[] = [
        { id: 'Novo Lead', label: 'Novos Leads', color: 'bg-blue-500' },
        { id: 'Qualificado', label: 'Qualificados', color: 'bg-yellow-500' },
        { id: 'Follow-up', label: 'Follow-up', color: 'bg-indigo-500' },
        { id: 'Agendou Visita', label: 'Visita Agendada', color: 'bg-purple-500' },
        { id: 'Em Negociação', label: 'Em Negociação', color: 'bg-orange-500' },
        { id: 'Ganho', label: 'Fechados / Ganho', color: 'bg-green-500' }
    ];

    if (loading) return <div className="p-10 flex justify-center text-gray-500">Carregando pipeline...</div>;

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="h-[calc(100vh-100px)] flex flex-col">
                    {/* Header Controls */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-serif font-bold text-gray-900">Pipeline de Vendas</h1>

                            {/* Bulk Actions Bar */}
                            {selectedLeadIds.size > 0 && (
                                <div className="flex items-center bg-chronos-900 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in gap-4">
                                    <span className="text-sm font-medium">{selectedLeadIds.size} selecionados</span>
                                    <div className="h-4 w-px bg-white/20"></div>
                                    <button
                                        onClick={() => setShowBulkDeleteConfirm(true)}
                                        className="flex items-center gap-1 text-sm text-red-300 hover:text-white transition-colors"
                                    >
                                        <Trash2 size={16} /> Excluir
                                    </button>
                                    <button
                                        onClick={() => setSelectedLeadIds(new Set())}
                                        className="text-white/50 hover:text-white"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex space-x-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar leads..."
                                    className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-chronos-500 w-64"
                                />
                            </div>
                            <button className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                                <Filter size={16} /> <span>Filtrar</span>
                            </button>
                            <button className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                                <ArrowUpDown size={16} /> <span>Ordenar</span>
                            </button>
                            <button className="flex items-center space-x-2 px-4 py-2 bg-chronos-900 text-white rounded-lg text-sm hover:bg-chronos-800 transition-colors">
                                <Plus size={16} /> <span>Novo Lead</span>
                            </button>
                        </div>
                    </div>

                    {/* Kanban Board */}
                    <div className="flex-1 overflow-x-auto overflow-y-hidden">
                        <div className="flex h-full space-x-6 min-w-max pb-4">
                            {stages.map((stage) => {
                                const stageLeads = leads.filter(l => l.status === stage.id);

                                // Calculate leads moved here in last 24h
                                const oneDayAgo = new Date();
                                oneDayAgo.setDate(oneDayAgo.getDate() - 1);
                                const recentMoves = stageLeads.filter(l => new Date(l.lastStatusChange) > oneDayAgo).length;

                                return (
                                    <div key={stage.id} className="w-80 flex flex-col h-full bg-gray-50/50 rounded-xl border border-gray-200/50">
                                        <div className="p-4 flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-2 h-2 rounded-full ${stage.color}`}></div>
                                                <h3 className="font-semibold text-gray-700">{stage.label}</h3>
                                                <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">{stageLeads.length}</span>
                                                {recentMoves > 0 && (
                                                    <span className="text-xs text-green-600 font-bold animate-pulse" title={`${recentMoves} leads nas últimas 24h`}>
                                                        (+{recentMoves})
                                                    </span>
                                                )}
                                            </div>
                                            <Plus className="text-gray-400 hover:text-gray-600 cursor-pointer" size={18} />
                                        </div>

                                        <Droppable droppableId={stage.id}>
                                            {(provided, snapshot) => (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className={`flex-1 overflow-y-auto p-3 space-y-3 transition-colors ${snapshot.isDraggingOver ? 'bg-gray-100/50' : ''}`}
                                                >
                                                    {stageLeads.map((lead, index) => (
                                                        <LeadCard
                                                            key={lead.id}
                                                            lead={lead}
                                                            index={index}
                                                            onClick={onLeadClick}
                                                            onDelete={handleDeleteRequest}
                                                            isSelected={selectedLeadIds.has(lead.id)}
                                                            onToggleSelect={toggleSelect}
                                                        />
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </DragDropContext>

            {/* Delete Confirmation Modal (Single & Bulk) */}
            {(leadToDelete || showBulkDeleteConfirm) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm animate-fade-in px-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 transform transition-all scale-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-red-50 rounded-full text-red-500">
                                    <AlertTriangle size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {showBulkDeleteConfirm ? 'Excluir Leads Selecionados' : 'Excluir Lead'}
                                </h3>
                            </div>
                            <button onClick={cancelDelete} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <p className="text-gray-600 mb-6 leading-relaxed">
                            {showBulkDeleteConfirm
                                ? `Tem certeza que deseja excluir ${selectedLeadIds.size} leads permanentemente?`
                                : <>Tem certeza que deseja excluir o lead <span className="font-bold text-gray-900">{leadToDelete?.name}</span>?</>
                            }
                            <br />
                            Esta ação removerá todo o histórico de negociações e notas associadas. Esta ação não pode ser desfeita.
                        </p>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={cancelDelete}
                                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={showBulkDeleteConfirm ? confirmBulkDelete : confirmDelete}
                                className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all flex items-center gap-2"
                            >
                                <Trash2 size={18} /> {showBulkDeleteConfirm ? 'Excluir Todos' : 'Confirmar Exclusão'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Pipeline;