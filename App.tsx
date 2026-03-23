import React, { useState } from 'react';
import {
  LayoutDashboard,
  KanbanSquare,
  Users,
  Package,
  BarChart3,
  Settings,
  HelpCircle,
  Bell,
  Search,
  Plus,
  Diamond,
  Menu,
  X,
  LogOut,
  UserPlus
} from 'lucide-react';
import { supabaseService } from './services/supabaseService';

import Dashboard from './components/Dashboard';
import Pipeline from './components/Pipeline';
import Analytics from './components/Analytics';
import LeadDetail from './components/LeadDetail';
import Clients from './components/Clients';
import Inventory from './components/Inventory';
import System from './components/System';
import { Lead } from './types';

// Types for navigation
type View = 'dashboard' | 'pipeline' | 'inventory' | 'clients' | 'analytics' | 'settings' | 'lead-detail' | 'system';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global "Novo Lead" modal
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', budget: '', watchInterest: '' });
  const [leadSaving, setLeadSaving] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  const openNewLeadModal = () => {
    setLeadForm({ name: '', email: '', phone: '', budget: '', watchInterest: '' });
    setLeadError(null);
    setIsNewLeadOpen(true);
  };

  const handleNewLead = async () => {
    if (!leadForm.name.trim()) { setLeadError('O nome do lead é obrigatório.'); return; }
    setLeadSaving(true);
    setLeadError(null);
    try {
      await supabaseService.addLead(leadForm);
      setIsNewLeadOpen(false);
    } catch (err: any) {
      setLeadError(err?.message || 'Erro ao salvar. Tente novamente.');
    } finally {
      setLeadSaving(false);
    }
  };

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setCurrentView('lead-detail');
  };

  const handleBackToPipeline = () => {
    setSelectedLead(null);
    setCurrentView('pipeline');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'pipeline':
        return <Pipeline onLeadClick={handleLeadClick} />;
      case 'inventory':
        return <Inventory />;
      case 'clients':
        return <Clients />;
      case 'analytics':
        return <Analytics />;
      case 'system':
      case 'settings': // Alias for system in this context
        return <System />;
      case 'lead-detail':
        return selectedLead ? <LeadDetail lead={selectedLead} onBack={handleBackToPipeline} /> : <Pipeline onLeadClick={handleLeadClick} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
            <Package size={64} className="mb-4 text-gray-200" />
            <p className="text-xl font-medium">Em Breve</p>
            <p className="text-sm">Este módulo está em desenvolvimento.</p>
          </div>
        );
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: React.ElementType; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setMobileMenuOpen(false);
      }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        currentView === view 
          ? 'bg-chronos-50 text-chronos-700 font-semibold' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon size={20} className={currentView === view ? 'text-chronos-600' : 'text-gray-400 group-hover:text-gray-600'} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-gray-900 overflow-hidden">
      
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col hidden md:flex">
        {/* Logo */}
        <div className="p-8 flex items-center space-x-3">
          <div className="w-8 h-8 bg-chronos-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-serif font-bold text-lg">C</span>
          </div>
          <span className="text-xl font-serif font-bold text-gray-900 tracking-tight">Chronos</span>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-bold text-gray-400 px-4 py-2 uppercase tracking-wider">Menu Principal</div>
          <NavItem view="dashboard" icon={LayoutDashboard} label="Painel" />
          <NavItem view="pipeline" icon={KanbanSquare} label="Pipeline" />
          <NavItem view="inventory" icon={Package} label="Estoque" />
          <NavItem view="clients" icon={Users} label="Clientes" />
          <NavItem view="analytics" icon={BarChart3} label="Análises" />
        </div>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="mb-4">
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                    <LogOut size={20} />
                    <span className="font-medium text-sm">Sair</span>
                </button>
            </div>
            
            <div className="flex items-center space-x-3 cursor-pointer hover:bg-white p-2 rounded-xl transition-all border border-transparent hover:border-gray-200 hover:shadow-sm">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold overflow-hidden">
                    <img src="https://picsum.photos/id/64/100/100" alt="User" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">Alex Silva</p>
                    <p className="text-xs text-gray-500 truncate">alex@chronos.com</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 md:px-8 flex-shrink-0">
            {/* Mobile Menu Button */}
             <div className="md:hidden flex items-center space-x-3">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600">
                    <Menu size={24} />
                </button>
                <span className="font-serif font-bold text-xl">Chronos</span>
             </div>

            {/* Search Bar */}
            <div className="hidden md:flex relative w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar clientes, relógios..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white focus:border-chronos-500 rounded-xl text-sm transition-all focus:outline-none"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
                <button className="relative p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <button
                  onClick={openNewLeadModal}
                  className="flex items-center space-x-2 bg-chronos-900 hover:bg-chronos-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-chronos-900/20 transition-all"
                >
                    <UserPlus size={18} />
                    <span>Novo Lead</span>
                </button>
            </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
            <div className="absolute inset-0 z-50 bg-gray-900/50 md:hidden flex" onClick={() => setMobileMenuOpen(false)}>
                <div className="w-64 bg-white h-full shadow-2xl p-4 flex flex-col" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-8">
                         <span className="text-xl font-serif font-bold text-gray-900">Chronos</span>
                         <button onClick={() => setMobileMenuOpen(false)}><X size={24} /></button>
                    </div>
                    <div className="space-y-2">
                        <NavItem view="dashboard" icon={LayoutDashboard} label="Painel" />
                        <NavItem view="pipeline" icon={KanbanSquare} label="Pipeline" />
                        <NavItem view="inventory" icon={Package} label="Estoque" />
                        <NavItem view="clients" icon={Users} label="Clientes" />
                        <NavItem view="analytics" icon={BarChart3} label="Análises" />
                        
                        <div className="border-t border-gray-100 my-4 pt-4">
                             <button className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 rounded-xl transition-colors">
                                <LogOut size={20} />
                                <span>Sair</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
            {renderContent()}
        </div>
      </main>
      {/* Global Novo Lead Modal */}
      {isNewLeadOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-gray-900">Novo Lead</h2>
              <button onClick={() => setIsNewLeadOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome <span className="text-red-400">*</span></label>
                <input type="text" value={leadForm.name} onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-chronos-500 focus:outline-none" placeholder="Ex: João Silva" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input type="text" value={leadForm.phone} onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-chronos-500 focus:outline-none" placeholder="(11) 99999-9999" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <input type="email" value={leadForm.email} onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-chronos-500 focus:outline-none" placeholder="email@exemplo.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Orçamento Disponível</label>
                <input type="text" value={leadForm.budget} onChange={e => setLeadForm({ ...leadForm, budget: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-chronos-500 focus:outline-none" placeholder="Ex: 50.000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Relógio de Interesse</label>
                <input type="text" value={leadForm.watchInterest} onChange={e => setLeadForm({ ...leadForm, watchInterest: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-chronos-500 focus:outline-none" placeholder="Ex: Rolex Submariner" />
              </div>
            </div>
            {leadError && (
              <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <X size={16} className="mt-0.5 shrink-0" />{leadError}
              </div>
            )}
            <div className="flex justify-end space-x-3 mt-8">
              <button onClick={() => setIsNewLeadOpen(false)} disabled={leadSaving}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">Cancelar</button>
              <button onClick={handleNewLead} disabled={leadSaving}
                className="px-6 py-2 bg-chronos-900 text-white rounded-lg hover:bg-chronos-800 transition-colors font-medium shadow-md disabled:opacity-60 flex items-center gap-2">
                {leadSaving && <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>}
                Salvar Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;