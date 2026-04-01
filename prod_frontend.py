<!DOCTYPE html>
<html>
<head>
  <title>Xavier OS ∞ Quinn Talen</title>
  <style>
    body { font-family: Arial; max-width: 800px; margin: auto; padding: 20px; }
    button { background: #8B0000; color: white; padding: 15px; font-size: 18px; border: none; border-radius: 8px; cursor: pointer; }
    button:hover { background: #B22222; }
    .chapter { background: #1a1a1a; color: #ccc; padding: 20px; margin: 20px 0; border-radius: 8px; }
  </style>
</head>
<body>
  <h1>🧛‍♂️ QUINN TALEN ∞ AUDIOBOOK LIVE</h1>
  <p>Voidbreaker Arc - Never-Ending God-Slaying Saga</p>
  
  <div id="progress">
    <h3>Quinn Level: <span id="level">1</span> | XP: <span id="xp">0</span></h3>
    <button onclick="generateChapter()">🎧 Next Quinn Chapter ∞</button>
    <button onclick="playVoice()">🔊 Quinn Voice (alloy)</button>
  </div>
  
  <div id="chapter"></div>
  <audio id="audio" controls style="width:100%; margin:20px 0;"></audio>
  
  <script>
    let chapterNum = 47;
    let level = 1, xp = 0;
    
    async function generateChapter() {
      const res = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({series: 'My Vampire System', chapter: chapterNum, character: 'Quinn Talen'})
      });
      const data = await res.json();
      document.getElementById('chapter').innerHTML = 
        `<div class="chapter">
          <h2>${data.title}</h2>
          <p>${data.body.substring(0, 2000)}...</p>
          <button onclick="playVoice('${data.body}')">Play Full Chapter</button>
        </div>`;
      chapterNum++; xp += 23; level = Math.floor(xp/100)+1;
      document.getElementById('level').textContent = level;
      document.getElementById('xp').textContent = xp;
    }
    
    async function playVoice(text) {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({text: text.substring(0, 1000)})
      });
      const data = await res.json();
      document.getElementById('audio').src = data.audio_url;
      document.getElementById('audio').play();
    }
  </script>
</body>
</html>
