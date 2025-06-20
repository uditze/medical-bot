const functions = require("firebase-functions/v2"); // Using v2 for 2nd Gen
const admin = require("firebase-admin");
const { OpenAI } = require("openai");

admin.initializeApp();

const openai = new OpenAI({
  apiKey: functions.config().openai?.key,
});

// This is a 2nd Gen onRequest function with CORS enabled
exports.chat = functions.https.onRequest(
  { cors: true }, // This line enables CORS automatically
  async (req, res) => {
    // We expect a POST request with a JSON body
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: 'Payload must include a "message" field.' });
    }

    try {
      // --- Placeholder Logic ---
      const botReply = `זוהי תשובת דמה מהשרת. קיבלתי: "${userMessage}"`;
      res.status(200).json({ reply: botReply });

    } catch (error) {
      console.error("Error processing chat message:", error);
      res.status(500).json({ error: "An unexpected error occurred." });
    }
  }
);
