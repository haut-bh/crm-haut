import React, { useState } from 'react';
import { User, Bell, Shield, Cloud, CreditCard, Save, Smartphone, Globe, Moon, Database } from 'lucide-react';

const System: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'integrations'>('profile');

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">Configurações do Sistema</h1>
        <p className="text-gray-500 mt-1">Gerencie suas preferências, notificações e integrações.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <button 
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-chronos-50 text-chronos-800 border-l-4 border-chronos-600' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}`}
                >
                    <User size={18} /> Meu Perfil
                </button>
                <button 
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'bg-chronos-50 text-chronos-800 border-l-4 border-chronos-600' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}`}
                >
                    <Bell size={18} /> Notificações
                </button>
                <button 
                    onClick={() => setActiveTab('integrations')}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'integrations' ? 'bg-chronos-50 text-chronos-800 border-l-4 border-chronos-600' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}`}
                >
                    <Cloud size={18} /> Integrações
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 border-l-4 border-transparent transition-colors">
                    <Shield size={18} /> Segurança
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 border-l-4 border-transparent transition-colors">
                    <CreditCard size={18} /> Faturamento
                </button>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
            {activeTab === 'profile' && (
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm animate-fade-in">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-gray-100 shadow-sm flex items-center justify-center text-gray-400">
                            <User size={40} />
                        </div>
                        <div>
                            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-all">Alterar Foto</button>
                            <p className="text-xs text-gray-400 mt-2">JPG, GIF ou PNG. Max 1MB.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Nome Completo</label>
                            <input type="text" defaultValue="" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-chronos-500/20 focus:border-chronos-500 transition-all" placeholder="Nome da Loja" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Cargo</label>
                            <input type="text" defaultValue="" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-chronos-500/20 focus:border-chronos-500 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Email</label>
                            <input type="email" defaultValue="" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-chronos-500/20 focus:border-chronos-500 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Telefone</label>
                            <input type="tel" defaultValue="" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-chronos-500/20 focus:border-chronos-500 transition-all" />
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-chronos-900 text-white rounded-xl font-medium shadow-lg shadow-chronos-900/20 hover:bg-chronos-800 transition-all">
                            <Save size={18} /> Salvar Alterações
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'notifications' && (
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm animate-fade-in space-y-8">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Canais de Notificação</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg text-gray-600"><Smartphone size={20} /></div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">Notificações Push</p>
                                        <p className="text-xs text-gray-500">Receber alertas no seu dispositivo móvel.</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-chronos-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-chronos-600"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg text-gray-600"><Globe size={20} /></div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">Notificações no Navegador</p>
                                        <p className="text-xs text-gray-500">Pop-ups quando o CRM estiver aberto.</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-chronos-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-chronos-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Eventos</h3>
                         <div className="space-y-3">
                            {['Novo lead atribuído', 'Lead mudou de fase', 'Nova mensagem de cliente', 'Lembrete de tarefa'].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 text-chronos-600 rounded border-gray-300 focus:ring-chronos-500" />
                                    <span className="text-sm text-gray-700">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'integrations' && (
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm animate-fade-in">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="border border-green-200 bg-green-50/50 p-4 rounded-xl flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white">
                                    <Database size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Supabase</h4>
                                    <p className="text-xs text-gray-600">Banco de dados e autenticação sincronizados.</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200 flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Conectado
                            </span>
                        </div>

                         <div className="border border-gray-200 p-4 rounded-xl flex justify-between items-center opacity-70">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                    <Globe size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Google Calendar</h4>
                                    <p className="text-xs text-gray-600">Sincronize agendamentos automaticamente.</p>
                                </div>
                            </div>
                            <button className="px-4 py-1.5 border border-gray-300 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50">
                                Conectar
                            </button>
                        </div>

                         <div className="border border-gray-200 p-4 rounded-xl flex justify-between items-center opacity-70">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                                    <Moon size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Slack</h4>
                                    <p className="text-xs text-gray-600">Receba notificações de vendas no canal.</p>
                                </div>
                            </div>
                            <button className="px-4 py-1.5 border border-gray-300 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50">
                                Conectar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default System;