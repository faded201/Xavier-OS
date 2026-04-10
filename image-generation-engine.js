/**
 * IMAGE GENERATION ENGINE
 * Generates 90+ cinematic images per episode
 * Uses character memory to maintain consistency
 * Displays one image every ~15 seconds for 23-minute audiobook
 */

import fetch from 'node-fetch';

// ============================================================================
// 📸 PROMPT GENERATOR - Creates story-specific, memory-aware prompts
// ============================================================================

class ImagePromptGenerator {
  constructor(characterMemory, bookData, storyChunks) {
    this.characterMemory = characterMemory;
    this.bookData = bookData;
    this.storyChunks = storyChunks;
    this.generatedPrompts = [];
  }

  // Build character description from memory
  getCharacterDescription() {
    if (!this.characterMemory) return '';
    const traits = this.characterMemory.traits || {};
    return `Character: ${traits.appearance || 'protagonist'}. Personality: ${traits.personality || 'determined'}. Current status: ${traits.goals || 'on a quest'}`;
  }

  // Build faction/world context from memory
  getWorldContext() {
    if (!this.characterMemory?.worldState) return '';
    const world = this.characterMemory.worldState;
    return `Setting: ${world.location || 'mystical realm'}. Time: ${world.timeOfDay || 'unknown'}. Genre: ${world.genre || 'fantasy'}.`;
  }

  // Build event history for narrative continuity
  getEventContext() {
    if (!this.characterMemory?.events) return '';
    const recentEvents = this.characterMemory.events.slice(-3).join('. ');
    return `Recent events: ${recentEvents}`;
  }

  // Get relationships and factions
  getRelationshipContext() {
    if (!this.characterMemory?.relationships) return '';
    const relations = Object.entries(this.characterMemory.relationships)
      .map(([name, rel]) => `${name} (${rel.status || 'unknown'}): ${rel.description || ''}`)
      .join('. ');
    return relations ? `Key relationships: ${relations}` : '';
  }

  // ========================================================================
  // 🎬 GENERATE 90+ DIVERSE PROMPTS - No two images are the same
  // ========================================================================

  generatePrompts() {
    const prompts = [];
    const characterDesc = this.getCharacterDescription();
    const worldContext = this.getWorldContext();
    const eventContext = this.getEventContext();
    const relationshipContext = this.getRelationshipContext();

    // Define 9 visual categories to cycle through (10 images each = 90 total)
    const visualStyles = [
      // 1. CHARACTER CLOSEUPS - Focus on protagonist
      {
        name: 'character',
        variations: [
          'ultra close-up portrait, intense expression, dramatic lighting, detailed facial features',
          'full face portrait, determined expression, glowing eyes, cinematic light',
          'side profile, thoughtful expression, wind blowing hair, atmospheric effects',
          'front-facing, action pose, mid-stride, dynamic energy',
          'emotional closeup, tears or intense focus, deep psychological moment',
          'mystical glow around character, magical aura, ethereal lighting',
          'battle-ready pose, weapon equipped, fierce expression, combat stance',
          'moment of realization, shocked expression, dramatic reveal lighting',
          'peaceful contemplation, serene expression, soft golden light',
          'corrupted state, dark aura, evil expression, dangerous energy'
        ]
      },

      // 2. ACTION SCENES - Dynamic motion and combat
      {
        name: 'action',
        variations: [
          'protagonist fighting multiple enemies, sword clash, magical explosions',
          'mid-jump combat move, sword swing, sparks flying, slow-motion effect',
          'casting a spell, magical energy waves, glowing runes, power surge',
          'evading attack, dodge roll, danger avoided, split-second timing',
          'counterattack, blade hitting shield, impact effects, particle explosions',
          'launching ultimate attack, massive energy buildup, dramatic climax',
          'in combat with boss, trading blows, equal match, intense struggle',
          'surrounded by enemies, fighting back-to-back, overwhelming odds',
          'using special ability, transformation effects, body glowing with power',
          'defeating enemy, final blow, enemy falling, victory moment'
        ]
      },

      // 3. LOCATION EXPLORATION - Diverse environments
      {
        name: 'locations',
        variations: [
          'ancient temple interior, stone pillars, mystical symbols, torchlight',
          'dark dungeon, chains, damp stone, eerie atmosphere, danger ahead',
          'forest clearing, moonlight filtering through trees, serene beauty',
          'sprawling city skyline, rooftops, distant mountains, epic scale',
          'volcanic landscape, lava flows, red sky, extreme danger',
          'underwater city, aurora lights, bioluminescent creatures, alien beauty',
          'floating islands, gravity-defying landscape, clouds everywhere',
          'ice palace, crystalline structures, blue light, frozen beauty',
          'desert oasis, palm trees, clear water, sanctuary in wasteland',
          'abandoned castle, stone ruins, overgrown vegetation, mystery'
        ]
      },

      // 4. FACTION REPRESENTATIVES - Different groups/organizations
      {
        name: 'factions',
        variations: [
          'noble knight in shining armor, royal insignia, proud stance, leadership aura',
          'dark cult robes, mysterious symbols, sinister energy, evil purpose',
          'merchant guild members, fine clothing, wealth indicators, trading signs',
          'ancient monks, meditation pose, spiritual energy, wisdom radiating',
          'pirate crew on ship, weathered appearance, freedom seekers, chaos',
          'royal court nobleman, expensive clothes, power symbol, political intrigue',
          'rebel militia, everyday clothes, weapons, fighting for freedom',
          'scholar sage, books surrounding, knowledge glow, ancient wisdom',
          'assassin guild member, dark leather, concealed weapons, deadly elegance',
          'nature druids, connected to earth, plant aura, environmental magic'
        ]
      },

      // 5. MAGICAL ELEMENTS - Spells, powers, supernatural
      {
        name: 'magic',
        variations: [
          'fireball explosion, orange and red energy, intense heat waves',
          'ice magic, crystalline formations, blue glowing runes, frozen effects',
          'lightning bolt, electric energy path, multiple branches, power overwhelming',
          'healing light, golden glow, restoration effects, life energy',
          'shadow magic, dark tendrils, mysterious power, corruption spreading',
          'summoning ritual, glowing summoning circle, creature appearing, reality bending',
          'teleportation portal, swirling vortex, magical crossroads, space folding',
          'time magic, clock imagery, temporal distortion, reality warping',
          'divination vision, mystical symbols, future glimpsed, knowledge revealed',
          'transformation spell, body morphing, magical transition, power unleashing'
        ]
      },

      // 6. DRAMATIC STORY MOMENTS - Emotional beats
      {
        name: 'drama',
        variations: [
          'betrayal moment, heartbreak visible, conflicted emotions, tears flowing',
          'character sacrifice, heroic pose, accepting fate, noble death',
          'redemption arc, light breaking through darkness, hope returning',
          'loss and grief, kneeling figure, mourning pose, despair visible',
          'unexpected ally, two enemies deciding to work together, trust forming',
          'revelation moment, truth exposed, shocked expression, world shifting',
          'reunion scene, loved ones meeting again, joy and relief, emotional peak',
          'farewell moment, goodbye embrace, bittersweet emotion, lasting memory',
          'character growth, before and after, transformation visible, evolution clear',
          'moral dilemma choice, standing between two paths, uncertain future'
        ]
      },

      // 7. ENVIRONMENTAL HAZARDS - Dangers and obstacles
      {
        name: 'hazards',
        variations: [
          'collapsing building, falling debris, escaping danger, split-second escape',
          'raging storm, lightning and wind, nature\'s fury, survival struggle',
          'poisonous gas cloud, purple/green mist, characters avoiding, toxicity evident',
          'sudden earthquake, ground cracking, instability everywhere, danger imminent',
          'trapped in cave with lava approaching, heat waves visible, time running out',
          'quicksand or swamp, sinking slowly, struggling to escape, desperate',
          'avalanche approaching, snow wall, running downhill, speed critical',
          'chasm to cross, wide gap, cliff edge danger, one wrong step fatal',
          'cursed location, eerie atmosphere, magical hazards, supernatural danger',
          'dimensional rift, reality breaking, impossible geometry, sanity-threatening'
        ]
      },

      // 8. CREATURE ENCOUNTERS - Monsters, allies, companions
      {
        name: 'creatures',
        variations: [
          'fierce dragon, massive wings, scales glowing, fire breathing ready',
          'mythical phoenix, rising from flame, rebirth imagery, eternal cycle',
          'dark demon form, menacing presence, supernatural evil, nightmare fuel',
          'guardian angel, heavenly glow, protective aura, divine presence',
          'ancient golem, stone body, magical runes, elemental guardian',
          'wolf pack, eyes glowing, primal energy, pack hunting together',
          'sea monster emerging, tentacles visible, water spraying, vast size',
          'magical familiar, bonded companion, glowing connection, mutual trust',
          'undead horde, shambling masses, overwhelming numbers, apocalyptic vision',
          'celestial being, star-like form, cosmic energy, godlike presence'
        ]
      },

      // 9. TREASURES & DISCOVERIES - Goals and rewards
      {
        name: 'treasures',
        variations: [
          'ancient artifact glowing, intricate design, power radiating, goal found',
          'treasure chamber filled with gold, jewels sparkling, wealth overwhelming',
          'legendary weapon revealed, special metal, glowing runes, power evident',
          'forbidden grimoire, mystical text, tome pulsing with energy, knowledge locked',
          'crown jewel, precious gem, light refracting, ultimate prize',
          'scroll of prophecy, ancient text unrolling, future revealing, destiny shown',
          'magical amulet, dangling, glowing, protective power, significance clear',
          'philosopher\'s stone, small object, immense power, transformation possible',
          'key to power, ornate and unique, unlocks something important, solution found',
          'map to paradise, ancient document, location marked, journey\'s end visible'
        ]
      }
    ];

    let promptIndex = 0;

    // Generate prompts: 10 per style = 90 total
    for (const style of visualStyles) {
      for (const variation of style.variations) {
        const seed = promptIndex + Math.floor(Math.random() * 10000);
        
        // Dynamic text injection based on story chunks
        const chunkIndex = promptIndex % Math.max(this.storyChunks.length, 1);
        const contextualText = this.storyChunks[chunkIndex]
          ? this.storyChunks[chunkIndex].substring(0, 100)
          : '';

        const prompt = `
          ${this.bookData.title} - Episode Art
          ${characterDesc}. ${worldContext}. ${eventContext}. ${relationshipContext}
          
          Scene: ${contextualText}
          Visual: ${variation}
          
          Style: Ultra cinematic, high detail, dramatic lighting, story-accurate, 4K quality
          Mood: ${style.name}, compelling, immersive, unforgettable
        `.trim().replace(/\s+/g, ' ');

        prompts.push({
          index: promptIndex,
          style: style.name,
          variation: variation,
          prompt: prompt,
          seed: seed,
          timestamp: promptIndex * 15.3 // ~15.3 seconds per image (1380 sec / 90 images)
        });

        promptIndex++;
      }
    }

    this.generatedPrompts = prompts;
    return prompts;
  }
}

// ============================================================================
// 🖼️ IMAGE BATCH GENERATOR - Parallel generation of all 90 images
// ============================================================================

class ImageBatchGenerator {
  constructor() {
    this.pollUrl = 'https://image.pollinations.ai/prompt';
    this.generatedImages = [];
  }

  async generateImage(promptData) {
    try {
      const imageUrl = `${this.pollUrl}/${encodeURIComponent(promptData.prompt)}?width=1920&height=1080&nologo=true&seed=${promptData.seed}`;
      
      console.log(`📸 [Image] Generating ${promptData.index + 1}/90: ${promptData.style}...`);
      
      const response = await fetch(imageUrl, { timeout: 30000 });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const imageBuffer = await response.buffer();
      
      if (imageBuffer.length < 1000) {
        throw new Error(`Image too small: ${imageBuffer.length} bytes`);
      }

      const base64 = imageBuffer.toString('base64');
      
      console.log(`✅ [Image] Generated ${promptData.index + 1}/90: ${imageBuffer.length} bytes`);
      
      return {
        ...promptData,
        dataUri: `data:image/jpeg;base64,${base64}`,
        size: imageBuffer.length,
        generated: Date.now()
      };
    } catch (error) {
      console.warn(`⚠️  [Image] Failed ${promptData.index + 1}/90: ${error.message}`);
      return null; // Failed image, skip
    }
  }

  async generateBatch(prompts) {
    console.log(`🎬 [Batch] Starting generation of ${prompts.length} images...`);
    
    // Generate in batches of 5 parallel (don't hammer the API)
    const batches = [];
    for (let i = 0; i < prompts.length; i += 5) {
      const batch = prompts.slice(i, i + 5);
      const batchResults = await Promise.all(
        batch.map(p => this.generateImage(p))
      );
      
      const validImages = batchResults.filter(img => img !== null);
      batches.push(...validImages);
      
      console.log(`📊 [Batch] Completed batch ${Math.floor(i / 5) + 1}/${Math.ceil(prompts.length / 5)}: ${validImages.length}/${batch.length} successful`);
      
      // Rate limit: wait 2 seconds between batches
      if (i + 5 < prompts.length) {
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    
    this.generatedImages = batches;
    console.log(`🎬 [Batch] Complete! Generated ${batches.length}/${prompts.length} images`);
    
    return batches;
  }
}

// ============================================================================
// 🎥 EXPRESS ROUTES - Backend API endpoints
// ============================================================================

export function setupImageRoutes(app) {
  
  // Get image generation metadata for a book/episode
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

  // Start batch image generation
  app.post('/api/images/generate-batch', async (req, res) => {
    try {
      const { bookId, episodeNum, storyChunks, characterMemory, bookData } = req.body;
      
      console.log(`🎬 [API] Image batch request for ${bookData?.title || bookId}`);
      
      if (!storyChunks || !characterMemory || !bookData) {
        return res.status(400).json({ error: 'Missing required data: storyChunks, characterMemory, bookData' });
      }
      
      // Generate prompts
      const promptGenerator = new ImagePromptGenerator(characterMemory, bookData, storyChunks);
      const prompts = promptGenerator.generatePrompts();
      
      console.log(`📝 [API] Generated ${prompts.length} prompts`);
      
      // START async batch generation (don't wait for completion)
      // This runs in background so API responds quickly
      setImmediate(async () => {
        const batchGenerator = new ImageBatchGenerator();
        const images = await batchGenerator.generateBatch(prompts);
        
        // Here you could store in cache, database, or file system
        // For now, we'll just log completion
        console.log(`✅ [API] Batch generation complete: ${images.length} images ready for playback`);
      });
      
      // Return immediately with promise of images coming
      res.json({
        status: 'generation_started',
        bookId,
        episodeNum,
        totalImages: prompts.length,
        estimatedTime: '8-12 minutes',
        message: 'Image generation started in background. They will load as available during playback.'
      });
      
    } catch (error) {
      console.error('❌ [API] Batch generation error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get individual image by index (for progressive loading)
  app.get('/api/images/fetch/:index', async (req, res) => {
    try {
      const { index } = req.params;
      const { bookId, episodeNum } = req.query;
      
      // This would fetch from cache/database
      // For now, return placeholder
      res.json({
        status: 'fetching',
        index: parseInt(index),
        bookId,
        episodeNum,
        message: 'Image loading...'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}

// ============================================================================
// EXPORT FOR USE IN APPLICATION
// ============================================================================

export { ImagePromptGenerator, ImageBatchGenerator };
