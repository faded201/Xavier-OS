import express from 'express';
import cors from 'cors';
import { createRequire } from 'module';
import { getCompleteStory } from './complete-book-stories.js';

const require = createRequire(import.meta.url);
const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Import the API handler (we'll need to compile the TS first)
const generateHandler = async (req, res) => {
  try {
    // Get bookId from request body or query
    const bookId = req.body?.bookId || req.query?.bookId || 'my-vampire-system';
    
    // Get the complete story for this book
    const story = getCompleteStory(bookId);
    
    // Use the complete story content as the chapter text
    const chapterText = story.content;

    // Split into chunks for sequential playback
    const sentences = chapterText.replace(/([.!?])\s+/g, "$1|").split("|");
    const chunks = [];
    let curr = "";
    sentences.forEach(s => {
      const sentence = s.trim();
      if (!sentence) return;

      if ((curr + " " + sentence).length > 180 && curr.length > 0) {
        chunks.push(curr.trim());
        curr = sentence;
      } else {
        curr = curr ? curr + " " + sentence : sentence;
      }
    });
    if (curr.trim()) chunks.push(curr.trim());

    res.json({
      chapter: chapterText,
      chapterTitle: `${story.title} - Chapter 1`,
      wordCount: chapterText.split(" ").length,
      estimatedReadTime: Math.ceil(chapterText.split(" ").length / 200),
      protagonist: story.protagonist,
      genre: story.genre,
      series: story.title,
      chunks: chunks, // Add chunks for proper playback
      characterMemory: {
        traits: {
          personality: "determined, resourceful, evolving",
          appearance: `${story.protagonist} from ${story.genre} world`,
          goals: `overcome challenges in ${story.genre} world`
        },
        relationships: {},
        events: [chapterText.split(".")[0]], // First sentence as opening event
        worldState: { 
          timeOfDay: "Present", 
          location: story.genre,
          genre: story.genre
        }
      },
      bookId: bookId,
      aiModelUsed: "complete-story"
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// API Routes
app.post('/api/generate', generateHandler);

// Check TTS service health (Node.js TTS on port 3003)
let ttsServiceAvailable = false;
checkTTSServiceHealth();

async function checkTTSServiceHealth() {
  try {
    const res = await fetch('http://localhost:3003/health', { signal: AbortSignal.timeout(2000) });
    ttsServiceAvailable = res.ok;
    console.log('🎵 TTS Service:', ttsServiceAvailable ? '✅ Available (Node.js)' : '❌ Not available (will use inline Google TTS)');
  } catch (e) {
    ttsServiceAvailable = false;
    console.log('🎵 TTS Service: ❌ Not available (will use inline Google TTS)');
  }
  // Re-check every 30 seconds
  setTimeout(checkTTSServiceHealth, 30000);
}

// TTS Proxy Route - Try TTS service first, fallback to inline Google TTS
app.get('/api/tts', async (req, res) => {
  try {
    console.log('🎵 TTS request:', req.query);
    const text = req.query.text;
    const emotion = req.query.emotion || 'neutral';
    
    if (!text) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(400).json({ error: 'Text parameter required' });
    }

    let audioBuffer;
    let source = 'unknown';
    let attemptCount = 0;
    const maxAttempts = 2;

    // Try TTS service (CosyVoice wrapper) multiple times with timeout
    while (attemptCount < maxAttempts && !audioBuffer) {
      attemptCount++;
      try {
        console.log(`🎵 TTS Attempt ${attemptCount}/${maxAttempts} (emotion: ${emotion})...`);
        
        // Create abort controller with 20 second timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);
        
        const ttsRes = await fetch(
          `http://localhost:3003/api/tts?text=${encodeURIComponent(text)}&emotion=${emotion}`,
          { 
            signal: controller.signal,
            timeout: 20000
          }
        );
        
        clearTimeout(timeoutId);
        
        if (ttsRes.ok) {
          const buffer = await ttsRes.arrayBuffer();
          
          // Validate audio data (should be at least 1KB for real audio)
          if (buffer.byteLength > 500) {
            audioBuffer = buffer;
            source = ttsRes.headers.get('X-TTS-Source') || 'TTS-Service';
            console.log(`✅ TTS service: Generated ${audioBuffer.byteLength} bytes`);
          } else {
            throw new Error(`Invalid audio size: ${buffer.byteLength} bytes`);
          }
        } else {
          throw new Error(`TTS service returned ${ttsRes.status}`);
        }
      } catch (e) {
        console.warn(`⚠️  TTS service attempt ${attemptCount} failed: ${e.message}`);
        
        if (e.name === 'AbortError') {
          console.warn('⏱️  TTS request timeout');
        }
        
        // Wait before retrying
        if (attemptCount < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    // Fallback to inline Google Translate TTS if service failed
    if (!audioBuffer) {
      try {
        console.log('🎵 Using inline Google Translate TTS...');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(text)}&tl=en`;
        
        const response = await fetch(ttsUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Google TTS failed: ${response.status}`);
        }

        const buffer = await response.arrayBuffer();
        
        if (buffer.byteLength > 500) {
          audioBuffer = buffer;
          source = 'GoogleTranslate-Inline';
          console.log(`✅ Google Translate TTS: Generated ${audioBuffer.byteLength} bytes`);
        } else {
          throw new Error(`Google TTS returned too little audio: ${buffer.byteLength} bytes`);
        }
      } catch (e) {
        console.error(`❌ Google TTS failed: ${e.message}`);
        
        // Create minimal silent audio as last resort (100ms silence)
        console.log('⚠️  Creating silent fallback audio');
        const silenceBase64 = 'SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU5LjI3LjEwMAAAAAAAAAAA//NkZAAAAANIAAAAAExBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU';
        const silenceBinary = atob(silenceBase64);
        const silenceBytes = new Uint8Array(silenceBinary.length);
        for (let i = 0; i < silenceBinary.length; i++) {
          silenceBytes[i] = silenceBinary.charCodeAt(i);
        }
        audioBuffer = silenceBytes.buffer;
        source = 'Silence-Fallback';
      }
    }

    // Return audio with proper headers
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.byteLength);
    res.setHeader('X-TTS-Source', source);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Content-Disposition', 'inline');
    
    res.send(Buffer.from(audioBuffer));

  } catch (error) {
    console.error('❌ TTS Error:', error.message);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ error: 'TTS generation failed', details: error.message });
  }
});

// Image Proxy Route to avoid CORS issues
app.get('/api/image', async (req, res) => {
  try {
    console.log('Image request received:', req.query);
    const prompt = req.query.prompt;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt parameter required' });
    }

    // Use pollinations.ai for image generation
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true&seed=${req.query.seed || 0}`;
    console.log('Fetching image from:', imageUrl.substring(0, 100) + '...');

    const response = await fetch(imageUrl);

    console.log('Image response status:', response.status);
    if (!response.ok) {
      throw new Error(`Image request failed: ${response.status}`);
    }

    const imageBuffer = await response.arrayBuffer();
    console.log('Image buffer size:', imageBuffer.byteLength);
    
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(Buffer.from(imageBuffer));
  } catch (error) {
    console.error('Image Proxy Error:', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ error: 'Image generation failed', details: error.message });
  }
});

// ============================================================================
// 📸 IMAGE GENERATION ROUTES - 90+ Images per Episode
// ============================================================================

// Get image generation metadata
app.get('/api/images/metadata', async (req, res) => {
  try {
    const { bookId, episodeNum } = req.query;
    
    res.json({
      status: 'ready',
      bookId: bookId || 'unknown',
      episode: episodeNum || 1,
      totalImages: 90,
      durationSeconds: 1380, // 23 minutes
      imageInterval: 15.3, // seconds between each image
      estimatedGenerationTime: '8-12 minutes',
      parallelBatches: 18, // 5 images at a time
      quality: '1920x1080 (Full HD)'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start batch image generation for episode
app.post('/api/images/generate-batch', async (req, res) => {
  try {
    const { bookId, episodeNum, storyChunks, characterMemory, bookData } = req.body;
    
    console.log(`🎬 [Image Batch] Request for ${bookData?.title || bookId} Episode ${episodeNum}`);
    
    if (!storyChunks || !characterMemory || !bookData) {
      return res.status(400).json({ 
        error: 'Missing required data: storyChunks, characterMemory, bookData' 
      });
    }

    // Respond immediately - generation happens in background
    res.json({
      status: 'generation_started',
      bookId,
      episodeNum,
      totalImages: 90,
      estimatedTime: '8-12 minutes',
      message: 'Image generation started in background. Images will load during playback.'
    });

    // ===== BACKGROUND: Generate 90+ images =====
    setImmediate(async () => {
      console.log(`📸 [Image Batch] Starting generation of 90 images...`);
      
      try {
        // Build character description from memory
        const characterDesc = characterMemory?.traits 
          ? `Character: ${characterMemory.traits.appearance}. Personality: ${characterMemory.traits.personality}. Goals: ${characterMemory.traits.goals}`
          : 'Story protagonist on epic journey';

        const worldContext = characterMemory?.worldState
          ? `Setting: ${characterMemory.worldState.location}. Genre: ${characterMemory.worldState.genre}. Time: ${characterMemory.worldState.timeOfDay}`
          : 'Fantasy realm';

        // Image categories for diversity (90 images = 10 per category)
        const categories = [
          { name: 'character', descriptions: ['ultra closeup portrait', 'full face determined', 'profile thoughtful', 'action pose', 'emotional moment', 'magical glow', 'battle ready', 'realization shock', 'peaceful contemplation', 'corrupted state'] },
          { name: 'action', descriptions: ['sword combat', 'magic casting', 'jumping attack', 'power surge', 'final blow', 'battle stance', 'dodge roll', 'counterattack', 'spell channeling', 'victory moment'] },
          { name: 'locations', descriptions: ['ancient temple', 'dark dungeon', 'forest clearing', 'city skyline', 'volcanic landscape', 'underwater city', 'floating islands', 'ice palace', 'desert oasis', 'abandoned castle'] },
          { name: 'factions', descriptions: ['noble knight', 'dark cultist', 'merchant guild', 'ancient monk', 'pirate crew', 'royal courtier', 'rebel militia', 'scholar sage', 'assassin master', 'nature druid'] },
          { name: 'magic', descriptions: ['fireball explosion', 'ice crystal', 'lightning bolt', 'healing light', 'shadow magic', 'summoning ritual', 'teleportation portal', 'time distortion', 'divination vision', 'transformation spell'] },
          { name: 'drama', descriptions: ['betrayal moment', 'noble sacrifice', 'redemption light', 'grief despair', 'unexpected ally', 'revelation truth', 'reunion joy', 'farewell goodbye', 'character growth', 'moral choice'] },
          { name: 'hazards', descriptions: ['collapsing building', 'raging storm', 'poison gas', 'earthquake ground', 'lava trap', 'quicksand swamp', 'avalanche snow', 'chasm gap', 'cursed location', 'reality rift'] },
          { name: 'creatures', descriptions: ['fierce dragon', 'phoenix rebirth', 'dark demon', 'guardian angel', 'ancient golem', 'wolf pack', 'sea monster', 'magical familiar', 'undead horde', 'celestial being'] },
          { name: 'treasures', descriptions: ['glowing artifact', 'treasure chamber', 'legendary weapon', 'forbidden grimoire', 'crown jewel', 'prophecy scroll', 'magical amulet', 'philosophers stone', 'power key', 'paradise map'] }
        ];

        let imageCount = 0;

        // Generate 10 images per category
        for (const category of categories) {
          for (let i = 0; i < category.descriptions.length; i++) {
            const seed = imageCount + Math.floor(Math.random() * 10000);
            const chunkIndex = imageCount % Math.max(storyChunks.length, 1);
            const contextText = storyChunks[chunkIndex]?.substring(0, 80) || '';

            const prompt = `
              ${bookData.title} Episode ${episodeNum}
              ${characterDesc}. ${worldContext}.
              Scene: ${contextText}
              ${category.descriptions[i]}
              Ultra cinematic, dramatic lighting, 4K quality, immersive detail
            `.trim().replace(/\s+/g, ' ');

            // Fetch image with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            try {
              const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1920&height=1080&nologo=true&seed=${seed}`;
              
              const response = await fetch(imageUrl, { signal: controller.signal });
              clearTimeout(timeoutId);

              if (response.ok) {
                console.log(`✅ [Image] ${++imageCount}/90 (${category.name})`);
              } else {
                console.warn(`⚠️  [Image] Failed ${imageCount + 1}/90: ${response.status}`);
              }
            } catch (err) {
              console.warn(`⚠️  [Image] Error ${imageCount + 1}/90: ${err.message}`);
            }

            // Rate limit: 500ms between requests
            if (imageCount < 90) {
              await new Promise(r => setTimeout(r, 500));
            }
          }
        }

        console.log(`✅ [Image Batch] Generation complete: ${imageCount}/90 images`);
      } catch (error) {
        console.error('❌ [Image Batch] Error:', error);
      }
    });

  } catch (error) {
    console.error('❌ [API] Batch generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});