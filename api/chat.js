export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    const { messages } = await req.json();

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages,
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return new Response(text, { status: 500 });
    }

    // 🔥 PASSA O STREAM DIRETO (CORRETO PARA VERCEL)
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    return new Response("Erro na IA", { status: 500 });
  }
}
