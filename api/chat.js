export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ reply: "Method not allowed" });
    }

    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({ reply: "Mensagem vazia." });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("SEM API KEY");
      return res.status(500).json({ reply: "API key não configurada." });
    }

    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "Responde em português de forma amigável."
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.7
        }),
      }
    );

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      console.error("OpenAI error:", data);
      return res.status(500).json({ reply: "Erro na IA." });
    }

    return res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "Sem resposta."
    });

  } catch (err) {
    console.error("Server crash:", err);
    return res.status(500).json({ reply: "Erro na IA." });
  }
}
