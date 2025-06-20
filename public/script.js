document.addEventListener('DOMContentLoaded', () => {
    const chatLog = document.getElementById('chat-log');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // The correct URL for our 2nd Gen Cloud Function
    const cloudFunctionUrl = 'https://chat-uduwuioy5q-uc.a.run.app';

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
            const response = await fetch(cloudFunctionUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageText }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Server error: ${response.status}`);
            }

            const data = await response.json();
            addMessage('bot', data.reply);

        } catch (error) {
            console.error("Error communicating with server:", error.message);
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

    // --- VISIBLE CHANGE FOR VERIFICATION ---
    addMessage('bot', 'שלום! (גרסה 2) מערכת האבחון הרפואי מוכנה.');
    setChatState(true);
});
