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
          model: "llama3-70b-8192",
          messages,
          stream: true,
        }),
      }
    );

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ reply: "Erro na IA." }),
      { status: 500 }
    );
  }
}
