import express from 'express';
import cors from 'cors';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Import the API handler (we'll need to compile the TS first)
const generateHandler = async (req, res) => {
  try {
    // For now, return a response with chunks for proper playback
    const chapterText = "The story begins with a mysterious awakening. Quinn Talen stood in the ancient chamber, feeling the surge of dormant power within. Shadows clung to the stone walls as glowing runes flared to life. This was the moment foretold in the forgotten archives. 'It is time,' a voice echoed from the abyss. The ground trembled, and a blinding light erupted from the artifact on the pedestal. Everything Quinn knew was about to change. The true journey, filled with unimaginable perils and god-like adversaries, had finally begun.";

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
      chapterTitle: "Chapter 1: The Awakening",
      wordCount: chapterText.split(" ").length,
      estimatedReadTime: Math.ceil(chapterText.split(" ").length / 200),
      protagonist: "Quinn Talen",
      series: "My Vampire System",
      chunks: chunks, // Add chunks for proper playback
      characterMemory: {
        traits: {
          personality: "determined, resourceful, evolving",
          appearance: "pale skin, sharp features, red eyes",
          goals: "power, survival, dominance"
        },
        relationships: {},
        events: ["Awakened with vampire powers"],
        worldState: { timeOfDay: "Night", location: "Modern Earth" }
      },
      aiModelUsed: "fallback"
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// API Routes
app.post('/api/generate', generateHandler);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});