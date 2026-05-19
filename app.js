function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function setupFileInput(inputId, previewId, maxFiles) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    let files = [];

    input.addEventListener('change', async () => {
        const newFiles = Array.from(input.files).slice(0, maxFiles || Infinity);
        for (const f of newFiles) {
            const data = await readFileAsBase64(f);
            files.push(data);
        }
        preview.innerHTML = files.map((_, i) =>
            `<span class="chip">Image ${i + 1} <button onclick="(function(){
                const p = document.getElementById('${previewId}');
                const ch = p.children[${i}];
                if(ch) ch.remove();
            })()">×</button></span>`
        ).join('');
        input.value = '';
    });

    return () => {
        const result = [...files];
        files = [];
        preview.innerHTML = '';
        return result;
    };
}

const getFirstFrame = setupFileInput('first-frame', 'first-frame-preview', 1);
const getRefImages = setupFileInput('ref-images', 'ref-images-preview', 3);
const getLastFrame = setupFileInput('last-frame', 'last-frame-preview', 1);

async function generateVideo() {
    const prompt = document.getElementById('prompt-input').value.trim();
    if (!prompt) return;

    const generateBtn = document.getElementById('generateBtn');
    const status = document.getElementById('status');
    const output = document.getElementById('video-output');

    generateBtn.disabled = true;
    status.textContent = 'Generating video...';
    status.className = '';
    output.innerHTML = '<div class="spinner"></div>';

    const options = {
        prompt,
        model: 'veo-3.1-generate-preview',
        seconds: parseInt(document.getElementById('duration').value),
        size: document.getElementById('resolution').value,
    };

    const neg = document.getElementById('negative-prompt').value.trim();
    if (neg) options.negative_prompt = neg;

    const firstFrame = getFirstFrame();
    if (firstFrame.length > 0) options.input_reference = firstFrame[0];

    const refImages = getRefImages();
    if (refImages.length > 0) options.reference_images = refImages;

    const lastFrame = getLastFrame();
    if (lastFrame.length > 0) options.last_frame = lastFrame[0];

    if (document.getElementById('test-mode').checked) {
        options.test_mode = true;
    }

    try {
        const video = await puter.ai.txt2vid(options);
        output.innerHTML = '';
        output.appendChild(video);
        status.textContent = '';
    } catch (error) {
        output.innerHTML = '';
        status.className = 'error';
        status.textContent = `Error: ${error.message || 'Video generation failed'}`;
    } finally {
        generateBtn.disabled = false;
    }
}

document.getElementById('generateBtn').addEventListener('click', generateVideo);
document.getElementById('prompt-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.shiftKey) return;
    if (e.key === 'Enter') { e.preventDefault(); generateVideo(); }
});
