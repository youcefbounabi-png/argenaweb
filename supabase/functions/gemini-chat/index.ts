import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') ?? '';
// Verified model and version
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

Deno.serve(async (req: Request) => {
  // Always include CORS headers in responses
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
      console.error('[gemini-chat] CRITICAL: GEMINI_API_KEY is missing from environment.');
      return new Response(JSON.stringify({ error: 'SERVER_CONFIG_ERROR', details: 'API Key missing' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build ultra-safe contents
    const contents: any[] = [];
    
    // Fallback: if history/system prompt causes issues, we can try to skip them
    // but for now, let's keep it simple
    if (systemPrompt) {
      contents.push({ role: 'user', parts: [{ text: `INSTRUCTION: ${systemPrompt}` }] });
      contents.push({ role: 'model', parts: [{ text: "ACKNOWLEDGED." }] });
    }

    if (history && Array.isArray(history)) {
      history.forEach(msg => {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        });
      });
    }

    contents.push({ role: 'user', parts: [{ text: userMessage || 'Hello' }] });

    // Debug log the count of contents
    console.log(`[gemini-chat] Sending request with ${contents.length} turns.`);

    const geminiRes = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    });

    const resBody = await geminiRes.text();

    if (!geminiRes.ok) {
        console.error(`[gemini-chat] Gemini API failed with status ${geminiRes.status}:`, resBody);
        return new Response(JSON.stringify({ 
            error: `GEMINI_UPSTREAM_ERROR_${geminiRes.status}`, 
            details: resBody 
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    const data = JSON.parse(resBody);
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "NO_RESPONSE_TEXT";

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('[gemini-chat] Crash:', err);
    return new Response(JSON.stringify({ error: 'FUNCTION_CRASH', details: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
