// Load chat history when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadChatHistory();
});

async function askQuestion() {
    const questionInput = document.getElementById('question');
    const chatArea = document.getElementById('chatArea');
    const question = questionInput.value.trim();
    
    // Gemini API key (for testing only; do not use in production)
    const GEMINI_API_KEY = 'AIzaSyCZnAaLldDO0EoI5c_uRIKBFavSWg0VZ5s';

    if (!question) {
        appendMessage('Please enter a question.', 'ai', 'red');
        return;
    }

    // Append and save user's message
    appendMessage(question, 'user');
    saveMessage(question, 'user');
    questionInput.value = ''; // Clear the input

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: question }] }],
                }),
            }
        );

        const data = await response.json();

        if (data.error) {
            appendMessage(`Error: ${data.error.message}`, 'ai', 'red');
            saveMessage(`Error: ${data.error.message}`, 'ai', 'red');
        } else if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            const generatedText = data.candidates[0].content.parts[0].text;
            appendMessage(generatedText, 'ai');
            saveMessage(generatedText, 'ai');
        } else {
            appendMessage('Unexpected API response structure.', 'ai', 'red');
            saveMessage('Unexpected API response structure.', 'ai', 'red');
        }
    } catch (error) {
        appendMessage(`Failed to fetch response: ${error.message}. Please try again later.`, 'ai', 'red');
        saveMessage(`Failed to fetch response: ${error.message}. Please try again later.`, 'ai', 'red');
        console.error('Error:', error);
    }
}

function appendMessage(text, type, color = null) {
    const chatArea = document.getElementById('chatArea');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);
    if (color) {
        messageDiv.style.color = color;
    }
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatArea.appendChild(messageDiv);
    
    // Auto-scroll to the latest message
    chatArea.scrollTop = chatArea.scrollHeight;
}

function saveMessage(text, type, color = null) {
    // Get existing chat history from localStorage or initialize an empty array
    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    
    // Add the new message to the history
    chatHistory.push({ text, type, color });
    
    // Save the updated history back to localStorage
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

function loadChatHistory() {
    // Get chat history from localStorage
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    
    // Display each message in the chat area
    chatHistory.forEach(message => {
        appendMessage(message.text, message.type, message.color);
    });
}
