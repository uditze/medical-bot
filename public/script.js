// Your personal Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBaAiwpk32a_2GFTxEN-m2JUKvSYBQezE4",
  authDomain: "medical-bot-project-3f141.firebaseapp.com",
  projectId: "medical-bot-project-3f141",
  storageBucket: "medical-bot-project-3f141.firebasestorage.app",
  messagingSenderId: "994123999450",
  appId: "1:994123999450:web:4d5d67866b7482e8649de3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const functions = firebase.functions();
const callChatFunction = functions.httpsCallable('chat');

// App logic
document.addEventListener('DOMContentLoaded', () => {
    const chatLog = document.getElementById('chat-log');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    function addMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.textContent = text;
        chatLog.appendChild(messageElement);
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    async function handleSendMessage() {
        const messageText = userInput.value.trim();
        if (!messageText) return;

        addMessage('user', messageText);
        userInput.value = '';
        setChatState(false);

        try {
            // Calling the new 'onCall' function
            const result = await callChatFunction({ message: messageText });
            addMessage('bot', result.data.reply);
        } catch (error) {
            console.error("Error calling function:", error);
            addMessage('bot', 'אופס, התרחשה שגיאה בתקשורת עם השרת.');
        } finally {
            setChatState(true);
        }
    }

    function setChatState(isEnabled) {
        userInput.disabled = !isEnabled;
        sendButton.disabled = !isEnabled;
        if (isEnabled) {
            userInput.focus();
        }
    }

    sendButton.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    });

    addMessage('bot', 'שלום! מערכת האבחון הרפואי מוכנה. אנא הצג את עצמך והתחל לתאר את המקרה.');
    setChatState(true);
});
