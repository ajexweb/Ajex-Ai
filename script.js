async function askQuestion() {
    const question = document.getElementById('question').value.trim();
    const answerDiv = document.getElementById('answer');
    
    // Gemini API key (for testing only; do not use in production)
    const GEMINI_API_KEY = 'AIzaSyCZnAaLldDO0EoI5c_uRIKBFavSWg0VZ5s';

    if (!question) {
        answerDiv.innerHTML = '<p style="color: red;">Please enter a question.</p>';
        return;
    }

    answerDiv.innerHTML = '<p>Loading...</p>';

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
            answerDiv.innerHTML = `<p style="color: red;">Error: ${data.error.message}</p>`;
        } else if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            const generatedText = data.candidates[0].content.parts[0].text;
            answerDiv.innerHTML = `<p>${generatedText}</p>`;
        } else {
            answerDiv.innerHTML = '<p style="color: red;">Unexpected API response structure.</p>';
        }
    } catch (error) {
        answerDiv.innerHTML = '<p style="color: red;">Failed to fetch response: ' + error.message + '. Please try again later.</p>';
        console.error('Error:', error);
    }
}