const functions = require("firebase-functions/v2");
const admin = require("firebase-admin");
const { OpenAI } = require("openai");

admin.initializeApp();

exports.chat = functions.https.onRequest({ cors: true }, async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: 'Payload must include a "message" field.' });
    }

    const openAIKey = functions.config().openai?.key;
    if (!openAIKey) {
      console.error("OpenAI API key is not configured.");
      throw new Error("The service is not configured correctly.");
    }

    const openai = new OpenAI({ apiKey: openAIKey });

    const botReply = `This is a dummy response from the server. I received: "${userMessage}"`;

    res.status(200).json({ reply: botReply });

  } catch (error) {
    console.error("Error in chat function:", error.message);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});
