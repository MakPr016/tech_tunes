const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' }));

app.get('/', (req, res) => res.render('index'));

app.post('/generate-music', (req, res) => {
  const { prompt, audio } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const audioPath = path.join(__dirname, 'public', 'dummy.mp3');
  const audioBuffer = fs.readFileSync(audioPath);
  const base64Audio = audioBuffer.toString('base64');

  res.json({ audio: base64Audio });
});

app.post('/upload-music', (req, res) => {
  const { audio } = req.body;

  if (!audio) {
    return res.status(400).json({ error: 'No audio provided' });
  }

  const buffer = Buffer.from(audio, 'base64');
  const outputPath = path.join(__dirname, 'public', 'uploaded.mp3');

  fs.writeFileSync(outputPath, buffer);

  res.json({ message: 'Audio received and saved', file: '/uploaded.mp3' });
});

app.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}/`);
  console.log("Ctrl+C to exit");
});
