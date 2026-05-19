async function generateVideo() {
    const prompt = document.getElementById('prompt-input').value.trim();
    if (!prompt) return;

    const generateBtn = document.getElementById('generateBtn');
    const status = document.getElementById('status');
    const output = document.getElementById('video-output');

    generateBtn.disabled = true;
    status.textContent = 'Generating video...';
    output.innerHTML = '';
    status.className = '';

    try {
        const video = await puter.ai.txt2vid({
            prompt,
            model: 'wan-ai/wan2.7-t2v',
        });
        output.appendChild(video);
        status.textContent = '';
    } catch (error) {
        console.error('Error:', error);
        status.className = 'error';
        status.textContent = `Error: ${error.message || 'Video generation failed'}`;
    } finally {
        generateBtn.disabled = false;
    }
}
