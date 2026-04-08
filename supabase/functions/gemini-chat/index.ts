import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') ?? '';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

Deno.serve(async (req: Request) => {
  // CORS pre-flight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const { systemPrompt, userMessage, history } = await req.json();

    if (!systemPrompt || !userMessage) {
      return new Response(JSON.stringify({ error: 'Missing systemPrompt or userMessage' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: 'Gemini API key not configured on server.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // Build conversation history
    const rawContents: any[] = [];
    for (const msg of (history || [])) {
      rawContents.push({ role: msg.role, parts: [{ text: msg.text }] });
    }
    rawContents.push({ role: 'user', parts: [{ text: userMessage }] });

    // Merge consecutive same-role messages (Gemini requirement)
    const contents: any[] = [];
    for (const msg of rawContents) {
      if (contents.length > 0 && contents[contents.length - 1].role === msg.role) {
        contents[contents.length - 1].parts[0].text += `\n\n${msg.parts[0].text}`;
      } else {
        contents.push({ role: msg.role, parts: [...msg.parts] });
      }
    }

    // Ensure first turn is 'user'
    if (contents.length > 0 && contents[0].role === 'model') {
      contents.unshift({ role: 'user', parts: [{ text: '(conversation started)' }] });
    }

    const geminiRes = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { temperature: 0.9, topP: 0.95 },
        safetySettings: [
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
        ],
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('[gemini-chat] Gemini error:', geminiRes.status, errText);
      return new Response(JSON.stringify({ error: `Gemini API error: ${geminiRes.status}` }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const data = await geminiRes.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
    if (text) text = text.replace(/^["']|["']$/g, '').trim();

    return new Response(JSON.stringify({ text }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err: any) {
    console.error('[gemini-chat] Unexpected error:', err);
    return new Response(JSON.stringify({ error: err.message ?? 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
});
