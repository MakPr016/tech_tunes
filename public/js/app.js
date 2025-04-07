document.addEventListener('DOMContentLoaded', () => {
  const audioInput = document.getElementById('audio-upload');
  const promptInput = document.getElementById('prompt-input');
  const generateBtn = document.getElementById('generate-btn');

  const audioPreview = document.getElementById('audio-preview');
  const loadingBar = document.getElementById('loading-bar');
  const visualizerText = document.getElementById('visualizer-text');

  let base64Audio = '';

  const fileToBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  audioInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      audioPreview.src = URL.createObjectURL(file);
      audioPreview.classList.remove('hidden');
      base64Audio = await fileToBase64(file);
    }
  });

  generateBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      alert("Please enter a prompt.");
      return;
    }

    const payload = {
      prompt,
      audio: base64Audio || null
    };

    generateBtn.disabled = true;
    generateBtn.textContent = "Generating...";
    loadingBar.classList.remove('hidden');
    visualizerText.textContent = 'Generating music... Please wait.';

    try {
      const response = await fetch("/generate-music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      loadingBar.classList.add('hidden');
      generateBtn.disabled = false;
      generateBtn.textContent = "Generate Music";

      if (result && result.audio) {
        const audioElement = document.createElement('audio');
        audioElement.controls = true;
        audioElement.classList.add('w-full', 'mt-4');
        audioElement.src = `data:audio/mp3;base64,${result.audio}`;

        visualizerText.innerHTML = '';
        visualizerText.appendChild(audioElement);
      } else {
        visualizerText.textContent = 'No audio was returned from the server.';
      }

    } catch (err) {
      loadingBar.classList.add('hidden');
      generateBtn.disabled = false;
      generateBtn.textContent = "Generate Music";
      visualizerText.textContent = 'An error occurred while generating music.';
      console.error("Error:", err);
    }
  });
});
