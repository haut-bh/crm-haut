import React, { useEffect, useState } from 'react';
import { supabaseService } from '../services/supabaseService';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ComposedChart,
    Line,
    Legend
} from 'recharts';
import { TrendingUp, MousePointerClick, Users, BadgeDollarSign } from 'lucide-react';

const Analytics: React.FC = () => {
    const [data, setData] = useState({
        conversionRate: '0.0',
        totalRevenue: 0,
        totalLeads: 0,
        wonLeadsCount: 0,
        chartData: [] as any[]
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const stats = await supabaseService.getAnalyticsData();
            setData(stats);
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Análises de Performance</h1>
                    <p className="text-gray-500 mt-1">Visão geral do funil de vendas e tráfego.</p>
                </div>
                {/* Filter buttons - static for now since logic is fixed to last 7 days */}
                <div className="flex bg-white border border-gray-200 rounded-xl p-1">
                    <button className="px-4 py-1.5 bg-gray-100 text-gray-900 rounded-lg text-sm font-medium shadow-sm">7 Dias</button>
                </div>
            </div>

            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                        <Users size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Leads Gerados</p>
                        <p className="text-xl font-bold text-gray-900">{data.totalLeads}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                        <BadgeDollarSign size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Vendas Totais</p>
                        <p className="text-xl font-bold text-gray-900">{data.wonLeadsCount}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                        <DollarSign size={20} />  {/* Using DollarSign icon instead of duplicate BadgeDollarSign */}
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Receita (Est.)</p>
                        <p className="text-xl font-bold text-gray-900">R$ {data.totalRevenue.toLocaleString('pt-BR', { notation: 'compact' })}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Taxa Conv.</p>
                        <p className="text-xl font-bold text-gray-900">{data.conversionRate}%</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart 1: Vendas vs Leads */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-[450px] flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <BadgeDollarSign size={18} className="text-chronos-600" /> Vendas / Leads (Semanal)
                        </h3>
                        <p className="text-sm text-gray-500">Correlação entre novos leads e vendas fechadas.</p>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={data.chartData}>
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
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar yAxisId="left" dataKey="leads" name="Novos Leads" fill="#60a5fa" radius={[4, 4, 0, 0]} barSize={30} />
                                <Line yAxisId="right" type="monotone" dataKey="sales" name="Vendas Fechadas" stroke="#16a34a" strokeWidth={3} dot={{ r: 4, fill: '#16a34a', strokeWidth: 2, stroke: '#fff' }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 2: Receita Simplificada */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-[450px] flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <TrendingUp size={18} className="text-blue-600" /> Receita Estimada (Semanal)
                        </h3>
                        <p className="text-sm text-gray-500">Baseado no valor final da venda registrado.</p>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="value" name="Receita (R$)" fill="#34b371" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

function DollarSign(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="12" x2="12" y1="2" y2="22" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    );
}

export default Analytics;