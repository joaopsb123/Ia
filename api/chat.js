export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ reply: "Method not allowed" });
    }

    const { messages } = req.body || {};

    if (!messages) {
      return res.status(400).json({ reply: "Mensagens vazias." });
    }

    const groqRes = await fetch(
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
          temperature: 0.7
        }),
      }
    );

    const data = await groqRes.json();

    if (!groqRes.ok) {
      console.error("Groq error:", data);
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
