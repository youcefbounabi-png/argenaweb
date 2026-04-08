import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') ?? '';
// Using 'gemini-2.0-flash-lite' which has better free-tier quotas
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { systemPrompt, userMessage, history } = await req.json();

    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: 'CONFIG_ERROR', details: 'API Key missing' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const contents: any[] = [];
    
    // Inject system instruction at the beginning of content history for compatibility
    if (systemPrompt) {
      contents.push({ role: 'user', parts: [{ text: `INSTRUCTION: ${systemPrompt}` }] });
      contents.push({ role: 'model', parts: [{ text: "Understood. I am ARGENA." }] });
    }

    // Limit history to last 6 messages to stay within quota and tokens
    const recentHistory = (history || []).slice(-6);
    recentHistory.forEach(msg => {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      });
    });

    contents.push({ role: 'user', parts: [{ text: userMessage || 'Hello' }] });

    const geminiRes = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    });

    if (geminiRes.status === 429) {
      return new Response(JSON.stringify({ error: 'RATE_LIMITED', message: 'The Archive concierge is currently busy.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const resBody = await geminiRes.text();

    if (!geminiRes.ok) {
        console.error(`[gemini-chat] Gemini API failed with status ${geminiRes.status}:`, resBody);
        return new Response(JSON.stringify({ error: 'UPSTREAM_ERROR', status: geminiRes.status }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    const data = JSON.parse(resBody);
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "NO_RESPONSE";

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('[gemini-chat] Crash:', err);
    return new Response(JSON.stringify({ error: 'SERVER_CRASH', details: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
