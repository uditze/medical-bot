const functions = require("firebase-functions/v2");
const admin = require("firebase-admin");
const { OpenAI } = require("openai");

admin.initializeApp();

// NOTE: We have removed the OpenAI client initialization from the global scope.

exports.chat = functions.https.onRequest(
  { cors: true }, // Enable CORS for all origins
  async (req, res) => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
      }

      const userMessage = req.body.message;
      if (!userMessage) {
        return res.status(400).json({ error: 'Payload must include a "message" field.' });
      }

      // Initialize OpenAI client here, inside the request, after configs are loaded.
      const openai = new OpenAI({
        apiKey: functions.config().openai.key,
      });

      // --- Placeholder Logic ---
      const botReply = `זוהי תשובת דמה מהשרת. קיבלתי: "${userMessage}"`;

      res.status(200).json({ reply: botReply });

    } catch (error) {
      console.error("Error in chat function:", error);
      res.status(500).json({ error: "An internal server error occurred." });
    }
  }
);
