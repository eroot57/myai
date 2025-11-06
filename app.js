async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    const fileInput = document.getElementById('file-upload').files[0];

    if (userInput || fileInput) {
        const chatBox = document.getElementById('chat-box');
        const userMessage = document.createElement('div');
        userMessage.className = 'user-message';
        userMessage.textContent = userInput;
        chatBox.appendChild(userMessage);

        const response = await fetch('https://api.puter.com/v1/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_API_KEY'  // Replace with your actual API key
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-5',
                messages: [{ role: 'user', content: userInput }],
                files: fileInput ? [fileInput] : []
            })
        });

        const data = await response.json();
        const assistantMessage = document.createElement('div');
        assistantMessage.className = 'assistant-message';
        assistantMessage.textContent = data.choices[0].message.content;
        chatBox.appendChild(assistantMessage);

        document.getElementById('user-input').value = '';
        document.getElementById('file-upload').value = '';
    }
}
