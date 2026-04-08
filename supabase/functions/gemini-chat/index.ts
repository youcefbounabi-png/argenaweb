import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY') ?? '';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const ok = (body: object) => new Response(JSON.stringify(body), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

  try {
    const { systemPrompt, userMessage, history } = await req.json();

    if (!GROQ_API_KEY) {
      return ok({ status: 'error', code: 'CONFIG_ERROR', message: 'API key not configured on server.' });
    }

    // Build messages array (OpenAI-compatible format that Groq uses)
    const messages: any[] = [];

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }

    // Add history (last 10 messages)
    const recentHistory = (history || []).slice(-10);
    recentHistory.forEach((msg: any) => {
      messages.push({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.text
      });
    });

    messages.push({ role: 'user', content: userMessage || 'Hello' });

    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (groqRes.status === 429) {
      return ok({ status: 'error', code: 'RATE_LIMITED', message: 'ARGENA is processing high demand. Please wait a moment and try again.' });
    }

    const resBody = await groqRes.text();

    if (!groqRes.ok) {
      console.error(`[gemini-chat] Groq error ${groqRes.status}:`, resBody);
      return ok({ status: 'error', code: `UPSTREAM_${groqRes.status}`, message: 'The archive encountered an issue. Please try again.' });
    }

    const data = JSON.parse(resBody);
    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      return ok({ status: 'error', code: 'NO_RESPONSE', message: 'No response generated. Please try again.' });
    }

    return ok({ status: 'ok', text });

  } catch (err: any) {
    console.error('[gemini-chat] Crash:', err);
    return ok({ status: 'error', code: 'SERVER_CRASH', message: err.message || 'An unexpected error occurred.' });
  }
});
