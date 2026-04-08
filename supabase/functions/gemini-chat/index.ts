import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') ?? '';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // ALWAYS return 200 so the Supabase client can read our JSON body
  // Use `status` field in the body to signal errors to the frontend
  const ok = (body: object) => new Response(JSON.stringify(body), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

  try {
    const { systemPrompt, userMessage, history } = await req.json();

    if (!GEMINI_API_KEY) {
      return ok({ status: 'error', code: 'CONFIG_ERROR', message: 'API key not configured on server.' });
    }

    const contents: any[] = [];

    if (systemPrompt) {
      contents.push({ role: 'user', parts: [{ text: `INSTRUCTION: ${systemPrompt}` }] });
      contents.push({ role: 'model', parts: [{ text: 'Understood. I am ARGENA.' }] });
    }

    const recentHistory = (history || []).slice(-6);
    recentHistory.forEach((msg: any) => {
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
      return ok({ status: 'error', code: 'RATE_LIMITED', message: 'ARGENA is processing high demand. Please wait a moment and try again.' });
    }

    if (geminiRes.status === 503) {
      return ok({ status: 'error', code: 'OVERLOADED', message: 'The AI model is temporarily overloaded. Please try again in a few seconds.' });
    }

    const resBody = await geminiRes.text();

    if (!geminiRes.ok) {
      console.error(`[gemini-chat] Gemini error ${geminiRes.status}:`, resBody);
      return ok({ status: 'error', code: `UPSTREAM_${geminiRes.status}`, message: 'The archive encountered an issue. Please try again.' });
    }

    const data = JSON.parse(resBody);
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return ok({ status: 'error', code: 'NO_RESPONSE', message: 'No response generated. Please try again.' });
    }

    return ok({ status: 'ok', text });

  } catch (err: any) {
    console.error('[gemini-chat] Crash:', err);
    return ok({ status: 'error', code: 'SERVER_CRASH', message: err.message || 'An unexpected error occurred.' });
  }
});
