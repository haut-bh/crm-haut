// Supabase Edge Function: meta-conversions
// Dispara eventos de conversão para a API de Conversões da Meta (Graph API)
// Chamado pelo frontend via supabase.functions.invoke('meta-conversions', ...)

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// --- Configuração via Secrets do Supabase ---
const META_PIXEL_ID = Deno.env.get('META_PIXEL_ID') || '';
const META_ACCESS_TOKEN = Deno.env.get('META_ACCESS_TOKEN') || '';
const META_IG_ACCOUNT_ID = Deno.env.get('META_IG_ACCOUNT_ID') || '17841416335320741';
const META_TEST_EVENT_CODE = Deno.env.get('META_TEST_EVENT_CODE') || '';
const META_API_VERSION = 'v21.0';

// --- Hashing SHA-256 conforme exigido pela Meta ---
async function sha256(value: string): Promise<string> {
  const normalized = value.toLowerCase().trim();
  if (!normalized) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// --- Normalizar telefone brasileiro para E.164 ---
function normalizePhone(phone: string): string {
  // Remove tudo que não é dígito
  const digits = phone.replace(/\D/g, '');
  // Se começa com 55 e tem 12-13 dígitos, já está formatado
  if (digits.startsWith('55') && digits.length >= 12) return digits;
  // Se tem 10-11 dígitos (DDD + número), adiciona 55
  if (digits.length >= 10 && digits.length <= 11) return `55${digits}`;
  return digits;
}

// --- Tipos ---
interface EventPayload {
  event_name: 'LeadSubmitted' | 'QualifiedLead' | 'Purchase';
  lead: {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  custom_data?: {
    value?: number;
    currency?: string;
  };
}

// --- Handler principal ---
serve(async (req: Request) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Validar configuração
  if (!META_PIXEL_ID || !META_ACCESS_TOKEN) {
    console.error('[Meta CAPI] META_PIXEL_ID ou META_ACCESS_TOKEN não configurados.');
    return new Response(
      JSON.stringify({ error: 'Meta Conversions API not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const payload: EventPayload = await req.json();
    const { event_name, lead, custom_data } = payload;

    if (!event_name || !lead?.id) {
      return new Response(
        JSON.stringify({ error: 'event_name and lead.id are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Gerar event_id único para deduplicação
    const eventTime = Math.floor(Date.now() / 1000);
    const eventId = `${event_name}_${lead.id}_${eventTime}`;

    // Preparar user_data com hashing SHA-256
    const userData: Record<string, any> = {
      ig_account_id: META_IG_ACCOUNT_ID,
    };

    // External ID (hash do ID do lead)
    const hashedExternalId = await sha256(lead.id);
    if (hashedExternalId) {
      userData.external_id = [hashedExternalId];
    }

    // Email (hash)
    if (lead.email) {
      const hashedEmail = await sha256(lead.email);
      if (hashedEmail) userData.em = [hashedEmail];
    }

    // Telefone (normalizar + hash)
    if (lead.phone) {
      const normalizedPhone = normalizePhone(lead.phone);
      const hashedPhone = await sha256(normalizedPhone);
      if (hashedPhone) userData.ph = [hashedPhone];
    }

    // Primeiro nome (hash)
    if (lead.name) {
      const firstName = lead.name.split(' ')[0];
      const hashedFirstName = await sha256(firstName);
      if (hashedFirstName) userData.fn = [hashedFirstName];
    }

    // Montar evento
    const eventData: Record<string, any> = {
      event_name,
      event_time: eventTime,
      event_id: eventId,
      action_source: 'business_messaging',
      messaging_channel: 'instagram',
      user_data: userData,
    };

    // Adicionar custom_data para Purchase
    if (custom_data && event_name === 'Purchase') {
      eventData.custom_data = {
        value: custom_data.value || 0,
        currency: custom_data.currency || 'BRL',
      };
    }

    // Montar body da requisição
    const requestBody: Record<string, any> = {
      data: [eventData],
    };

    // Adicionar test_event_code se configurado (para debug no Events Manager)
    if (META_TEST_EVENT_CODE) {
      requestBody.test_event_code = META_TEST_EVENT_CODE;
    }

    // Enviar para a API da Meta
    const graphUrl = `https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events`;

    console.log(`[Meta CAPI] Enviando evento "${event_name}" para lead ${lead.id}...`);

    const metaResponse = await fetch(graphUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...requestBody,
        access_token: META_ACCESS_TOKEN,
      }),
    });

    const metaResult = await metaResponse.json();

    if (!metaResponse.ok) {
      console.error('[Meta CAPI] Erro na resposta da Meta:', JSON.stringify(metaResult));
      return new Response(
        JSON.stringify({
          success: false,
          error: metaResult.error?.message || 'Unknown Meta API error',
          details: metaResult,
        }),
        { status: metaResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Meta CAPI] ✅ Evento "${event_name}" enviado com sucesso! events_received: ${metaResult.events_received}`);

    return new Response(
      JSON.stringify({
        success: true,
        event_name,
        event_id: eventId,
        events_received: metaResult.events_received,
        ...(META_TEST_EVENT_CODE ? { test_mode: true, test_event_code: META_TEST_EVENT_CODE } : {}),
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Meta CAPI] Erro interno:', error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
