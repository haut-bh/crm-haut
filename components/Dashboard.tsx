import React, { useEffect, useState } from 'react';
import { supabaseService } from '../services/supabaseService';
import { Lead } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, CartesianGrid, Legend } from 'recharts';
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Briefcase,
  ShoppingBag,
  DollarSign,
  Filter,
  Download,
  Phone,
  Mail,
  PlusCircle,
  Calendar as CalendarIcon,
  Clock,
  Inbox
} from 'lucide-react';
import { MOCK_CHART_DATA } from '../constants'; // Keeping chart mock for now, can replace later or use Analytics chart

const Dashboard: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const hours = new Date().getHours();
  const greeting = hours < 12 ? 'Bom dia' : hours < 18 ? 'Boa tarde' : 'Boa noite';

  const [stats, setStats] = useState({
    totalLeads: 0,
    activeLeads: 0,
    totalInventory: 0,
    pipelineValue: 0,
    recentLeads: [] as Lead[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await supabaseService.getDashboardStats();
      setStats(data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  const metrics = [
    {
      label: 'Total de Leads',
      value: stats.totalLeads.toString(),
      change: '+12%', // Static for now, requires historical data
      trend: 'up',
      isPrimary: false
    },
    {
      label: 'Oportunidades Ativas',
      value: stats.activeLeads.toString(),
      change: '+5%',
      trend: 'up',
      isPrimary: false
    },
    {
      label: 'Relógios em Estoque',
      value: stats.totalInventory.toString(),
      change: 'Stable',
      trend: 'neutral',
      isPrimary: false
    },
    {
      label: 'Pipeline Estimado',
      value: `R$ ${stats.pipelineValue.toLocaleString('pt-BR')}`,
      change: '+8%',
      trend: 'up',
      isPrimary: true
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header & Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col space-y-2">
          <p className="text-xs font-bold text-chronos-600 uppercase tracking-wider flex items-center gap-2">
            <Clock size={14} /> {currentDate}
          </p>
          <h1 className="text-3xl font-serif font-bold text-gray-900">{greeting}, Alex.</h1>
          <p className="text-gray-500">Você tem <span className="font-bold text-gray-900">{stats.activeLeads} oportunidades</span> ativas.</p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-chronos-900 text-white rounded-xl text-sm font-medium hover:bg-chronos-800 transition-all shadow-lg shadow-chronos-900/20">
            <PlusCircle size={18} /> Novo Lead
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all">
            <CalendarIcon size={18} /> Agendar
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl border transition-all hover:-translate-y-1 duration-300 ${metric.isPrimary
                ? 'bg-gradient-to-br from-chronos-900 to-chronos-800 text-white border-chronos-900 shadow-xl shadow-chronos-900/20'
                : 'bg-white text-gray-900 border-gray-100 shadow-sm hover:shadow-md'
              }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${metric.isPrimary ? 'bg-white/10 backdrop-blur-sm' : 'bg-gray-50'}`}>
                {idx === 0 && <Users size={20} className={metric.isPrimary ? 'text-white' : 'text-chronos-600'} />}
                {idx === 1 && <Briefcase size={20} className={metric.isPrimary ? 'text-white' : 'text-chronos-600'} />}
                {idx === 2 && <ShoppingBag size={20} className={metric.isPrimary ? 'text-white' : 'text-chronos-600'} />}
                {idx === 3 && <DollarSign size={20} className={metric.isPrimary ? 'text-white' : 'text-chronos-600'} />}
              </div>
              {/* Trend indicator kept static/calculated based on placeholder logic for now */}
            </div>
            <h3 className={`text-sm font-medium ${metric.isPrimary ? 'text-gray-200' : 'text-gray-500'}`}>{metric.label}</h3>
            <p className="text-2xl font-bold mt-1 tracking-tight">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Main Chart Section - Expanded to full width */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Performance de Vendas</h2>
            <p className="text-sm text-gray-500">Receita vs. Quantidade de Leads (Últimos 7 dias)</p>
          </div>
          {/* ... controls ... */}
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_CHART_DATA}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34b371" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#34b371" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <Tooltip
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area yAxisId="left" type="monotone" dataKey="value" name="Receita" stroke="#34b371" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              <Area yAxisId="right" type="monotone" dataKey="leads" name="Leads" stroke="#60a5fa" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Leads Recentes</h2>
            <p className="text-sm text-gray-500">Últimos contatos adicionados.</p>
          </div>
          {/* ... actions ... */}
        </div>
        <div className="overflow-x-auto">
          {stats.recentLeads.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Nome do Cliente</th>
                  <th className="px-6 py-4">Interesse</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Ação Rápida</th>
                  <th className="px-6 py-4 text-right">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img src={lead.avatar} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm" />
                        <div>
                          <div className="text-sm font-bold text-gray-900">{lead.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${lead.status === 'Novo Lead' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                            {lead.addedAt}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">
                        {lead.interests.length > 0 ? lead.interests[0].model : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide border
                            ${lead.status === 'Em Negociação' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                          lead.status === 'Qualificado' ? 'bg-green-50 text-green-700 border-green-100' :
                            lead.status === 'Agendou Visita' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                              'bg-gray-50 text-gray-700 border-gray-100'}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Enviar Email">
                          <Mail size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Ligar">
                          <Phone size={18} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-chronos-600 hover:text-chronos-800 font-medium text-sm inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Ver <ArrowUpRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-10 text-center flex flex-col items-center text-gray-500">
              <Inbox size={40} className="text-gray-300 mb-3" />
              <p className="font-medium">Nenhum lead encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;