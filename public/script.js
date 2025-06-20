document.addEventListener('DOMContentLoaded', () => {
    const chatLog = document.getElementById('chat-log');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // The URL of our Cloud Function
    const cloudFunctionUrl = 'https://chat-g5kzn6p5pq-uc.a.run.app'; // IMPORTANT: This is the 2nd Gen Function URL

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
            // Using standard fetch to call our onRequest function
            const response = await fetch(cloudFunctionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: messageText }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            addMessage('bot', data.reply);

        } catch (error) {
            console.error("Error communicating with server:", error);
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
