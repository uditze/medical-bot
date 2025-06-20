const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { OpenAI } = require("openai");
const cors = require("cors")({ origin: true });

admin.initializeApp();

// The OpenAI API key will be set as an environment variable in Firebase
// For now, this is a placeholder.
const openai = new OpenAI({
  apiKey: functions.config().openai?.key,
});


exports.chat = functions.https.onRequest((req, res) => {
  // Handle CORS preflight requests
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: 'Message payload is required' });
    }

    try {
      // --- Placeholder Logic ---
      // In the future, we will interact with the OpenAI Assistant API here.
      // For now, we just echo the message back.
      const botReply = `זוהי תשובת דמה מהשרת. קיבלתי: "${userMessage}"`;

      res.status(200).json({ reply: botReply });

    } catch (error) {
      console.error("Error processing chat message:", error);
      res.status(500).json({ error: "Something went wrong." });
    }
  });
});
