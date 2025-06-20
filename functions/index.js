const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { OpenAI } = require("openai");

admin.initializeApp();

const openai = new OpenAI({
  apiKey: functions.config().openai?.key,
});

// This is now a 2nd Gen 'onCall' function.
// It's simpler and more secure for client-to-server communication.
exports.chat = functions.https.onCall(async (data, context) => {
  // The user's message is in data.message
  const userMessage = data.message;

  if (!userMessage || typeof userMessage !== 'string') {
    // Throwing an HttpsError is the recommended way to handle errors.
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with one argument "message" that is a string.');
  }

  // --- Placeholder Logic ---
  // In the future, we will interact with the OpenAI Assistant API here.
  // For now, we just echo the message back.
  try {
    const botReply = `זוהי תשובת דמה מהשרת. קיבלתי: "${userMessage}"`;
    // Return data to the client
    return { reply: botReply };

  } catch (error) {
    console.error("Error processing chat message:", error);
    // Throw a generic error to the client
    throw new functions.https.HttpsError('internal', 'An unexpected error occurred.');
  }
});
