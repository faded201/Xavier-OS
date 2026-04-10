# Xavier OS - Enhanced Audiobook Bible System Guide

## Overview

This system provides:
1. **Infinite, consistent book generation** using comprehensive Bible structures
2. **Coisy voice integration** for emotion-aware, character-specific audio synthesis
3. **Book-specific image generation** tailored to each book's unique elements

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    XAVIER OS AUDIOBOOK SYSTEM                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐    ┌──────────────────┐    ┌───────────┐ │
│  │  Enhanced Book   │    │  Coisy Voice     │    │  Enhanced │ │
│  │  Bible Engine    │───▶│  TTS Service     │◀───│  Image    │ │
│  │                  │    │  (Port 3005)     │    │  Generator│ │
│  └────────┬─────────┘    └──────────────────┘    └─────┬─────┘ │
│           │                                             │       │
│           │  ┌─────────────────────────────────────┐   │       │
│           └─▶│     Audiobook Bible Engine          │◀──┘       │
│              │  - Character voice profiles         │           │
│              │  - Power system visuals             │           │
│              │  - Faction-specific elements        │           │
│              │  - Book-specific presets            │           │
│              └─────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
library/
├── audiobook-bible-engine.js       # Core bible system
├── cosyvoice-enhanced-service.py   # Enhanced TTS service
├── image-generation-engine-enhanced.js
├── book-bibles.js                  # Book bible database
├── book-story-templates.js         # Story templates
└── books-database.js               # 212+ book database
```

---

## 1. Enhanced Audiobook Bible System

### Usage

```javascript
import { EnhancedBookBible, createAudiobookEngine } from './audiobook-bible-engine.js';

// Create bible for any book
const bible = new EnhancedBookBible('my-vampire-system');

// Get generation prompt for AI
const prompt = bible.getGenerationPrompt({
  chapter: 1,
  context: ' Quinn discovers his vampire abilities'
});

// Create audiobook engine
const engine = createAudiobookEngine('my-vampire-system');

// Generate audio with Coisy voice
const audioBuffer = await engine.generateAudio(
  "Quinn's eyes snapped open. He could feel it—the power coursing through his veins.",
  'surprise',
  { name: 'Quinn Talen', personality: 'determined, pragmatic' }
);

// Generate book-specific images
const imageData = await engine.generateImageSequence({
  chapter: 1,
  characters: ['Quinn Talen'],
  location: 'School courtyard',
  action: 'transformation begins',
  powerDisplayed: 'vampire blood energy',
  faction: 'Ability Holders'
});
```

### Bible Components

| Component | Description |
|-----------|-------------|
| `worldState` | Setting, geography, magic system, rules |
| `characterRoster` | Protagonist, allies, antagonists with relationships |
| `powerSystem` | Magic/power mechanics, limitations, progression |
| `factionNetwork` | All factions with relationships and conflicts |
| `narrativeEngine` | Tone, perspective, themes, writing style |

---

## 2. Coisy Voice Integration

### Starting the Service

```bash
# Start enhanced Coisy voice service
python cosyvoice-enhanced-service.py --port 3005 --model-path pretrained_models/CosyVoice2-0.5B
```

### Voice Profiles

The system includes character-specific voice profiles:

| Profile | Description | Emotion Bias |
|---------|-------------|--------------|
| `hero` | Confident, clear, heroic tone | happy 30%, neutral 40% |
| `heroine` | Warm, determined, compassionate | happy 40%, neutral 30% |
| `villain` | Dark, menacing, controlled | angry 40%, neutral 30% |
| `mentor` | Wise, measured, authoritative | neutral 50%, happy 20% |
| `narrator` | Clear, neutral, engaging | neutral 60% |

### API Endpoints

```
GET  /health                 - Service health check
GET  /api/tts?text=...&emotion=...&character_type=... - Generate speech
POST /api/tts               - Generate speech (JSON body)
GET  /api/voices            - List available voices
POST /api/generate-voice    - Full control voice generation
```

### Example Request

```javascript
// Using character-specific voice
const response = await fetch('http://localhost:3005/api/tts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: "The shadows belong to me now.",
    character_type: 'villain',
    emotion: 'angry',
    genre: 'dark_fantasy'
  })
});

const audioBuffer = await response.buffer();
```

---

## 3. Enhanced Image Generation

### Book-Specific Presets

Each book has unique visual treatment:

```javascript
import { EnhancedImagePromptGenerator } from './image-generation-engine-enhanced.js';

const generator = new EnhancedImagePromptGenerator('my-vampire-system');

const { prompt, seed, style } = generator.generatePrompt({
  chapter: 1,
  characters: ['Quinn Talen', 'Orde'],
  location: 'School courtyard',
  action: 'confrontation',
  powerDisplayed: 'vampire energy',
  mood: 'tense'
});

// Output:
// "My Vampire System - Chapter 1. Characters: Quinn Talen: pale skin with crimson eyes...
//  Style: gothic horror with modern urban elements. Atmosphere: dark, predatory..."
```

### Visual Elements by Book

| Book | Primary Colors | Visual Style | Key Imagery |
|------|---------------|--------------|-------------|
| My Vampire System | Crimson, Black | Gothic horror urban | Blood moon, fangs, system windows |
| Shadow Monarch | Black, Purple | Shadow realm | Shadow soldiers, gates, darkness |
| Dragonic System | Orange, Gold | High fantasy | Dragon scales, wings, temples |
| Demonic Sword | Red, Black | Dark medieval | Cursed sword, souls, forge |
| Beast Tamer | Green, Brown | Adventure fantasy | Legendary beasts, bonds |

### Image Categories

The system generates 90+ images per episode across these categories:

1. **Character Focus** - Protagonist close-ups, transformations
2. **Action Scenes** - Combat, movement, power usage
3. **Location Shots** - Establishing shots, environments
4. **Faction Representation** - Group dynamics, symbols
5. **Power Displays** - Magic, abilities, transformations

---

## 4. Complete Workflow Example

```javascript
import { EnhancedBookBible, CharacterVoiceProfile } from './audiobook-bible-engine.js';
import { EnhancedImagePromptGenerator } from './image-generation-engine-enhanced.js';

async function generateEpisode(bookId, chapterData) {
  // 1. Initialize bible
  const bible = new EnhancedBookBible(bookId);
  
  // 2. Generate story content
  const storyPrompt = bible.getGenerationPrompt(chapterData);
  const storyContent = await generateStory(storyPrompt);
  
  // 3. Split into audio chunks with emotion detection
  const chunks = splitIntoChunks(storyContent);
  
  for (const chunk of chunks) {
    // Detect emotion from text
    const emotion = detectEmotion(chunk.text);
    
    // Determine speaking character
    const character = determineSpeaker(chunk, bible);
    
    // 4. Generate audio with Coisy voice
    const audioBuffer = await fetch('http://localhost:3005/api/tts', {
      method: 'POST',
      body: JSON.stringify({
        text: chunk.text,
        emotion: emotion,
        character_type: character.type,
        genre: bible.worldState.genre.toLowerCase().replace(' ', '_')
      })
    }).then(r => r.buffer());
    
    // 5. Generate matching image
    const imageGen = new EnhancedImagePromptGenerator(bookId);
    const { prompt, seed } = imageGen.generatePrompt({
      chapter: chapterData.chapter,
      characters: chunk.characters,
      location: chunk.location,
      action: chunk.action,
      powerDisplayed: chunk.power,
      faction: chunk.faction
    });
    
    const image = await fetch(
      `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1920&height=1080&seed=${seed}`
    ).then(r => r.buffer());
    
    // 6. Store synchronized audio + image
    await storeEpisodeChunk(chapterData.chapter, chunk.index, audioBuffer, image);
  }
}
```

---

## 5. Configuration Options

### Voice Settings

```javascript
const voiceConfig = {
  // Emotion mappings
  emotions: {
    neutral: { speed: 1.0, pitch: 0 },
    happy: { speed: 1.1, pitch: 2 },
    sad: { speed: 0.9, pitch: -2 },
    angry: { speed: 0.95, pitch: 1 },
    fearful: { speed: 0.85, pitch: 1.5 },
    surprise: { speed: 1.15, pitch: 3 }
  },
  
  // Character type defaults
  characterDefaults: {
    hero: { emotion: 'neutral', pitch: 1, speed: 1.05 },
    villain: { emotion: 'angry', pitch: -2, speed: 0.9 },
    mentor: { emotion: 'neutral', pitch: -1, speed: 0.85 }
  }
};
```

### Image Generation Settings

```javascript
const imageConfig = {
  resolution: { width: 1920, height: 1080 },
  batchSize: 5,
  parallelLimit: 3,
  retryAttempts: 2,
  styleModifiers: ['cinematic lighting', 'ultra detailed', '4K quality']
};
```

---

## 6. Troubleshooting

### Audio Issues

| Problem | Solution |
|---------|----------|
| No audio output | Check Coisy service is running on port 3005 |
| Wrong emotion | Verify emotion mapping in `cosyvoice-enhanced-service.py` |
| Slow generation | Reduce batch size or increase parallel limit |

### Image Issues

| Problem | Solution |
|---------|----------|
| Generic images | Ensure book preset exists in `BOOK_VISUAL_PRESETS` |
| Inconsistent characters | Use character-specific prompts with appearance details |
| Wrong style | Check genre detection in `buildStyleModifiers()` |

---

## 7. Performance Optimization

### Recommended Settings

```python
# cosyvoice-enhanced-service.py
app.run(host='0.0.0.0', port=3005, threaded=True, processes=4)
```

### Caching Strategy

```javascript
// Cache generated audio and images
const cache = new Map();

async function getCached(key, generator) {
  if (cache.has(key)) return cache.get(key);
  const result = await generator();
  cache.set(key, result);
  return result;
}
```

---

## Summary

This enhanced system provides:

1. **Infinite consistent content** via comprehensive Bible structures
2. **Character-aware voices** using Coisy with emotion profiles
3. **Book-specific visuals** with unique presets per title
4. **Seamless integration** between audio, text, and images

The result is a professional-grade audiobook generation system that produces unique, consistent, and engaging content for any of the 212+ supported books.