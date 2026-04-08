// Mocks removed
// Delay removed

import { supabase } from './supabaseClient';
import { Lead, LeadStatus, WatchInterest, Note } from '../types';

const BRAND_PREFIXES: Record<string, string> = {
  'rolex': 'RO',
  'cartier': 'CAR',
  'omega': 'OMG',
  'ômega': 'OMG',
  'audemars piguet': 'AUP',
  'patek philippe': 'PTK',
  'iwc': 'IWC',
  'jaeger-lecoultre': 'JLC',
  'tag heuer': 'TAG',
  'breitling': 'BRE',
  'hublot': 'HUB',
  'panerai': 'PAN',
  'tudor': 'TUD',
  'longines': 'LON',
  'vacheron constantin': 'VC',
  'a. lange & söhne': 'ALS',
  'girard-perregaux': 'GP',
  'zenith': 'ZEN',
  'chopard': 'CHO',
  'franck muller': 'FM',
  'richard mille': 'RM',
  'ulysse nardin': 'UN',
};

function getBrandPrefix(brand: string): string {
  const key = brand.toLowerCase().trim();
  return BRAND_PREFIXES[key] ?? brand.substring(0, 3).toUpperCase();
}

export class SupabaseService {
  private leadSubscribers: ((leads: Lead[]) => void)[] = [];
  private inventorySubscribers: ((items: any[]) => void)[] = [];

  // --- LEADS ---

  private mapLeadFromDB(data: any): Lead {
    const mapStatus = (status: string): LeadStatus => {
      if (!status) return 'Novo Lead';
      const s = status.toLowerCase().trim();
      if (s === 'novo lead' || s === 'novo') return 'Novo Lead';
      if (s === 'qualificado') return 'Qualificado';
      if (s === 'follow-up' || s === 'followup') return 'Follow-up';
      if (s === 'visita' || s === 'agendou visita' || s === 'agendou') return 'Agendou Visita';
      if (s === 'em negociação' || s === 'em negociacao' || s === 'negociacao' || s === 'negociação' || s === 'proposta') return 'Em Negociação';
      if (s === 'ganho' || s === 'ganhou' || s === 'fechado') return 'Ganho';
      if (s === 'perdido') return 'Perdido';
      return 'Novo Lead';
    };

    return {
      id: data.id.toString(),
      name: data.nome || 'Sem Nome',
      handle: data.contact_handle || '',
      avatar: 'https://placehold.co/100x100', // Placeholder
      email: data.email || '',
      phone: data.telefone || '',
      location: 'Brasil',
      status: mapStatus(data.etapa_kanban),
      lastStatusChange: data.ultima_interecao || new Date().toISOString(),
      lastActive: data.ultima_interecao || new Date().toISOString(),
      source: 'Supabase',
      budget: data.orcamento_disp || '',
      interests: data.relogio_interesse ? [{
        id: '1',
        brand: 'Unknown',
        model: data.relogio_interesse,
        reference: '',
        price: 0,
        image: 'https://placehold.co/200x200'
      }] : [],
      notes: [],
      tags: data.qualificado ? ['Qualificado'] : [],
      addedAt: new Date(data.created_at).toLocaleDateString(),
      valorFinalVenda: data.valor_final_venda != null ? parseFloat(data.valor_final_venda) : undefined,
      estoqueId: data.estoque_id != null ? data.estoque_id.toString() : undefined,
    };
  }

  async getLeads(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      return [];
    }

    return data.map(this.mapLeadFromDB);
  }

  subscribeToLeads(onUpdate: (leads: Lead[]) => void): () => void {
    this.leadSubscribers.push(onUpdate);

    const subscription = supabase
      .channel('leads_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, async () => {
        const leads = await this.getLeads();
        this.leadSubscribers.forEach(cb => cb(leads));
      })
      .subscribe();

    return () => {
      this.leadSubscribers = this.leadSubscribers.filter(sub => sub !== onUpdate);
      if (this.leadSubscribers.length === 0) {
        supabase.removeChannel(subscription);
      }
    };
  }

  async updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .update({
        etapa_kanban: status,
        ultima_interecao: new Date().toISOString()
      })
      .eq('id', id);

    if (error) console.error('Error updating status:', error);
  }

  async markLeadAsGanho(leadId: string, valorFinalVenda: number, estoqueId?: string): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .update({
        etapa_kanban: 'Ganho',
        valor_final_venda: valorFinalVenda,
        ultima_interecao: new Date().toISOString()
      })
      .eq('id', leadId);

    if (error) throw new Error(`Erro ao marcar como ganho: ${error.message}`);

    if (estoqueId) {
      await this.deleteInventoryItem(estoqueId);
    }
  }

  async linkWatchToLead(leadId: string, estoqueId: string): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .update({ estoque_id: parseInt(estoqueId) })
      .eq('id', leadId);

    if (error) throw new Error(`Erro ao vincular relógio: ${error.message}`);
  }

  async deleteLead(id: string): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) console.error('Error deleting lead:', error);
  }

  async deleteLeads(ids: string[]): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .delete()
      .in('id', ids);

    if (error) console.error('Error deleting leads:', error);
  }

  async updateLead(id: string, data: Partial<Lead>): Promise<void> {
    const updates: any = {
      ultima_interecao: new Date().toISOString()
    };
    if (data.name) updates.nome = data.name;
    if (data.phone) updates.telefone = data.phone;
    if (data.email) updates.email = data.email;
    if (data.budget) updates.orcamento_disp = data.budget;
    if (data.status) updates.etapa_kanban = data.status;

    const { error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id);

    if (error) console.error('Error updating lead:', error);
  }

  async getNotes(leadId: string): Promise<Note[]> {
    const { data, error } = await supabase
      .from('lead_notes')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching notes:', error);
      return [];
    }

    return data.map((n: any) => ({
      id: n.id.toString(),
      content: n.content,
      author: n.author || 'Sales Rep',
      createdAt: new Date(n.created_at).toLocaleString('pt-BR'),
      isMe: true
    }));
  }

  async addLead(data: { name: string; email: string; phone: string; budget: string; watchInterest: string; objetivo?: string; qualificado?: boolean }): Promise<void> {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('leads')
      .insert({
        nome: data.name,
        email: data.email || null,
        telefone: data.phone || null,
        orcamento_disp: data.budget || null,
        relogio_interesse: data.watchInterest || null,
        objetivo: data.objetivo || null,
        qualificado: data.qualificado ?? false,
        etapa_kanban: 'Novo Lead',
        created_at: now,
        ultima_interecao: now,
      });

    if (error) throw new Error(`Erro ao criar lead: ${error.message}`);
  }

  async addNote(leadId: string, content: string): Promise<void> {
    const { error } = await supabase
      .from('lead_notes')
      .insert({
        lead_id: leadId,
        content: content,
        author: 'Você'
      });

    if (error) console.error('Error adding note:', error);
  }

  // --- INVENTORY (ESTOQUE) ---

  async uploadWatchImage(file: File): Promise<string> {
    const ext = file.name.split('.').pop();
    const fileName = `watch_${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('watch-images')
      .upload(fileName, file, { upsert: true });

    if (error) throw new Error(`Erro ao enviar foto: ${error.message}`);

    const { data } = supabase.storage
      .from('watch-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async getInventory(): Promise<WatchInterest[]> {
    const { data, error } = await supabase
      .from('estoque')
      .select('*');

    if (error) {
      console.error('Error fetching inventory:', error);
      return [];
    }

    return data.map((item: any) => ({
      id: item.id.toString(),
      brand: item.marca || 'N/A',
      model: item.modelo || 'N/A',
      reference: item.ref || `ID-${item.id}`,
      size: item.tamanho || '',
      year: item.ano || '',
      price: parseFloat(item.preco_venda?.replace('R$', '').trim().replace(/\./g, '').replace(',', '.') || '0'),
      precoCusto: item.preco_custo
        ? parseFloat(item.preco_custo.replace('R$', '').trim().replace(/\./g, '').replace(',', '.') || '0')
        : undefined,
      image: item.foto_url || 'https://placehold.co/300x300',
    }));
  }

  async addInventoryItem(item: Omit<WatchInterest, 'id' | 'reference'> & { image?: string }): Promise<void> {
    const formattedPrice = `R$ ${item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const { count } = await supabase
      .from('estoque')
      .select('*', { count: 'exact', head: true })
      .ilike('marca', item.brand);

    const nextNum = (count ?? 0) + 1;
    const prefix = getBrandPrefix(item.brand);
    const ref = `${prefix}${String(nextNum).padStart(3, '0')}`;

    const { error } = await supabase
      .from('estoque')
      .insert({
        marca: item.brand,
        modelo: item.model,
        tamanho: item.size,
        ano: item.year,
        preco_venda: formattedPrice,
        preco_custo: item.precoCusto != null && item.precoCusto > 0
          ? `R$ ${item.precoCusto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          : null,
        ref: ref,
        foto_url: item.image || null,
      });

    if (error) throw new Error(`Erro ao adicionar relógio: ${error.message}`);
  }

  async updateInventoryItem(id: string, item: Partial<WatchInterest> & { image?: string }): Promise<void> {
    const updates: any = {};
    if (item.brand) updates.marca = item.brand;
    if (item.model) updates.modelo = item.model;
    if (item.size !== undefined) updates.tamanho = item.size;
    if (item.year !== undefined) updates.ano = item.year;
    if (item.price !== undefined) {
      updates.preco_venda = `R$ ${item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (item.precoCusto !== undefined) {
      updates.preco_custo = item.precoCusto > 0
        ? `R$ ${item.precoCusto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : null;
    }
    if (item.image !== undefined) updates.foto_url = item.image || null;

    const { error } = await supabase
      .from('estoque')
      .update(updates)
      .eq('id', id);

    if (error) throw new Error(`Erro ao atualizar relógio: ${error.message}`);
  }

  async deleteInventoryItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('estoque')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Erro ao excluir relógio: ${error.message}`);
  }

  subscribeToInventory(onUpdate: (items: WatchInterest[]) => void): () => void {
    this.inventorySubscribers.push(onUpdate);

    const subscription = supabase
      .channel('estoque_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'estoque' }, async () => {
        const items = await this.getInventory();
        this.inventorySubscribers.forEach(cb => cb(items));
      })
      .subscribe();

    return () => {
      this.inventorySubscribers = this.inventorySubscribers.filter(sub => sub !== onUpdate);
      if (this.inventorySubscribers.length === 0) {
        supabase.removeChannel(subscription);
      }
    };
  }


  // --- DASHBOARD & ANALYTICS ---

  async getDashboardStats() {
    const leads = await this.getLeads();
    const inventory = await this.getInventory();

    const totalLeads = leads.length;
    const activeLeads = leads.filter(l => l.status !== 'Perdido' && l.status !== 'Ganho').length;
    const totalInventory = inventory.length;

    const pipelineValue = leads
      .filter(l => l.status !== 'Perdido' && l.status !== 'Ganho')
      .reduce((sum, lead) => {
        const val = parseFloat(lead.budget.replace(/[^\d]/g, '') || '0');
        return sum + val;
      }, 0);

    const recentLeads = leads.slice(0, 5);

    return {
      totalLeads,
      activeLeads,
      totalInventory,
      pipelineValue,
      recentLeads
    };
  }

  async getAnalyticsData() {
    const leads = await this.getLeads();

    const wonLeads = leads.filter(l => l.status === 'Ganho');
    const totalLeads = leads.length;
    const conversionRate = totalLeads > 0 ? ((wonLeads.length / totalLeads) * 100).toFixed(1) : '0';

    // Total Revenue: soma do valor_final_venda dos leads ganhos
    const totalRevenue = wonLeads.reduce((sum, lead) => {
      return sum + (lead.valorFinalVenda ?? 0);
    }, 0);

    const chartData = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toLocaleDateString('pt-BR');

      const count = leads.filter(l => l.addedAt === dateStr).length;

      const dayRevenue = leads
        .filter(l => l.addedAt === dateStr && l.status === 'Ganho')
        .reduce((sum, l) => sum + (l.valorFinalVenda ?? 0), 0);

      chartData.push({
        name: dateStr.slice(0, 5),
        leads: count,
        value: dayRevenue,
        sales: leads.filter(l => l.addedAt === dateStr && l.status === 'Ganho').length
      });
    }

    return {
      conversionRate,
      totalRevenue,
      totalLeads,
      wonLeadsCount: wonLeads.length,
      chartData
    };
  }
}

export const supabaseService = new SupabaseService();
