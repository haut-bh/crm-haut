/**
 * Meta Conversions API Service
 * 
 * Serviço client-side que invoca a Supabase Edge Function "meta-conversions"
 * para disparar eventos de conversão para a Meta de forma segura.
 * 
 * Eventos suportados:
 * - LeadSubmitted: quando um lead é criado (etapa "Novo Lead")
 * - QualifiedLead: quando o lead é movido para "Encaminhado para WhatsApp"
 * - Purchase: quando o lead é movido para "Ganho"
 * 
 * Todas as chamadas são fire-and-forget: erros são logados
 * mas nunca quebram o fluxo principal do CRM.
 */

import { supabase } from './supabaseClient';

interface LeadData {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
}

type MetaEventName = 'LeadSubmitted' | 'QualifiedLead' | 'Purchase';

interface MetaConversionPayload {
  event_name: MetaEventName;
  lead: LeadData;
  custom_data?: {
    value?: number;
    currency?: string;
  };
}

class MetaConversionsService {

  /**
   * Dispara o evento LeadSubmitted para a Meta.
   * Chamado quando um novo lead é criado no CRM.
   */
  async sendLeadSubmitted(lead: LeadData): Promise<void> {
    await this.sendEvent({
      event_name: 'LeadSubmitted',
      lead,
    });
  }

  /**
   * Dispara o evento QualifiedLead para a Meta.
   * Chamado quando o lead é movido para a etapa "Encaminhado para WhatsApp".
   */
  async sendQualifiedLead(lead: LeadData): Promise<void> {
    await this.sendEvent({
      event_name: 'QualifiedLead',
      lead,
    });
  }

  /**
   * Dispara o evento Purchase para a Meta.
   * Chamado quando o lead é movido para a etapa "Ganho".
   * 
   * @param lead Dados do lead
   * @param value Valor final da venda em BRL
   */
  async sendPurchase(lead: LeadData, value: number): Promise<void> {
    await this.sendEvent({
      event_name: 'Purchase',
      lead,
      custom_data: {
        value,
        currency: 'BRL',
      },
    });
  }

  /**
   * Método privado que invoca a Edge Function.
   * Fire-and-forget: erros são logados mas nunca propagados.
   */
  private async sendEvent(payload: MetaConversionPayload): Promise<void> {
    try {
      console.log(`[Meta CAPI] Disparando evento "${payload.event_name}" para lead ${payload.lead.id}...`);

      const { data, error } = await supabase.functions.invoke('meta-conversions', {
        body: payload,
      });

      if (error) {
        console.error(`[Meta CAPI] ❌ Erro ao chamar Edge Function:`, error);
        return;
      }

      if (data?.success) {
        console.log(`[Meta CAPI] ✅ Evento "${payload.event_name}" enviado com sucesso!`, {
          event_id: data.event_id,
          events_received: data.events_received,
          ...(data.test_mode ? { test_mode: true } : {}),
        });
      } else {
        console.warn(`[Meta CAPI] ⚠️ Resposta inesperada da Edge Function:`, data);
      }
    } catch (err) {
      // Fire-and-forget: nunca propagar erro para não afetar o CRM
      console.error(`[Meta CAPI] ❌ Erro inesperado ao enviar evento "${payload.event_name}":`, err);
    }
  }
}

export const metaConversionsService = new MetaConversionsService();
