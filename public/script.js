document.addEventListener('DOMContentLoaded', () => {
    const chatLog = document.getElementById('chat-log');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // !!! FONTOS !!! A Cloud Function URL-je
    const cloudFunctionUrl = 'https://us-central1-medical-bot-project-3f141.cloudfunctions.net/chat';

    /**
     * Appends a message to the chat log
     * @param {string} sender - 'user' or 'bot'
     * @param {string} text - The message content
     */
    function addMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.textContent = text;
        chatLog.appendChild(messageElement);
        // Auto-scroll to the bottom
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    /**
     * Handles sending the user's message
     */
    async function handleSendMessage() {
        const messageText = userInput.value.trim();
        if (!messageText) return;

        addMessage('user', messageText);
        userInput.value = '';
        setChatState(false); // Disable input while bot replies

        try {
            const response = await fetch(cloudFunctionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: messageText }),
            });

            if (!response.ok) {
                throw new Error(`שגיאת שרת: ${response.status}`);
            }

            const data = await response.json();
            addMessage('bot', data.reply);

        } catch (error) {
            console.error("שגיאה בתקשורת עם השרת:", error);
            addMessage('bot', 'אופס, התרחשה שגיאה. אנא נסה שוב מאוחר יותר.');
        } finally {
            setChatState(true); // Re-enable input
        }
    }

    /**
     * Enables or disables the chat input controls
     * @param {boolean} isEnabled - True to enable, false to disable
     */
    function setChatState(isEnabled) {
        userInput.disabled = !isEnabled;
        sendButton.disabled = !isEnabled;
        if (isEnabled) {
            userInput.focus();
        }
    }

    // Event Listeners
    sendButton.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    });

    // Initial state
    addMessage('bot', 'שלום! מערכת האבחון הרפואי מוכנה. אנא הצג את עצמך והתחל לתאר את המקרה.');
    setChatState(true);
});
