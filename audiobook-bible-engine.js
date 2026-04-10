/**
 * XAVIER OS - AUDIOBOOK BIBLE ENGINE
 * Comprehensive system for infinite, consistent book generation
 * Uses Coisy voice for all audio output with emotion-aware synthesis
 * Generates book-specific, character-specific, power-specific, faction-specific content
 */

import { BOOK_BIBLES, getBookBible, generateBiblePrompt } from './book-bibles.js';
import { BOOK_STORIES, getStoryTemplate } from './book-story-templates.js';
import { booksDatabase } from './books-database.js';

// ============================================================================
// 📚 ENHANCED BIBLE SYSTEM - Core data structure for infinite generation
// ============================================================================

/**
 * Enhanced Bible structure that includes all necessary metadata
 * for consistent infinite generation
 */
export class EnhancedBookBible {
  constructor(bookId) {
    this.bookId = bookId;
    this.baseBible = getBookBible(bookId);
    this.storyTemplate = getStoryTemplate(bookId);
    this.bookData = booksDatabase.find(b => b.id === bookId) || {};
    
    // Build comprehensive context
    this.worldState = this.buildWorldState();
    this.characterRoster = this.buildCharacterRoster();
    this.powerSystem = this.buildPowerSystem();
    this.factionNetwork = this.buildFactionNetwork();
    this.narrativeEngine = this.buildNarrativeEngine();
  }

  /**
   * Build complete world state from all available sources
   */
  buildWorldState() {
    const base = this.baseBible.worldInfo || {};
    const story = this.storyTemplate;
    
    return {
      setting: base.setting || story.setting || 'A world of mystery and adventure',
      geography: base.geography || 'Varied landscapes with magical properties',
      timeframe: base.timeframe || 'Fluid timeline following protagonist journey',
      magicSystem: base.powerSystem || {},
      genre: this.baseBible.genre || 'Fantasy',
      tone: base.tone || 'Epic and immersive',
      rules: base.rules || [],
      constraints: base.constraints || []
    };
  }

  /**
   * Build character roster with relationships
   */
  buildCharacterRoster() {
    const baseChars = this.baseBible.characters || {};
    const roster = {
      protagonist: baseChars.protagonist || {
        name: this.storyTemplate.protagonist || 'The Hero',
        traits: {},
        arc: 'Growth through challenges'
      },
      allies: [],
      antagonists: [],
      neutrals: []
    };
    
    // Parse secondary characters
    if (baseChars.secondary) {
      baseChars.secondary.forEach(char => {
        if (char.alignment?.includes('Good') || char.role?.includes('ally')) {
          roster.allies.push(char);
        } else if (char.alignment?.includes('Evil') || char.role?.includes('enemy')) {
          roster.antagonists.push(char);
        } else {
          roster.neutrals.push(char);
        }
      });
    }
    
    return roster;
  }

  /**
   * Build power system details
   */
  buildPowerSystem() {
    const base = this.baseBible.worldInfo?.powerSystem || {};
    
    return {
      name: base.name || 'Mystic Power',
      mechanics: base.mechanics || 'Energy manipulation through will',
      limitations: base.limitations || 'Power requires sacrifice',
      stages: base.stages || base.ranks || 'Beginner → Advanced → Master',
      costs: base.costs || 'Mental and physical exhaustion',
      uniqueAbilities: [],
      progressionRules: []
    };
  }

  /**
   * Build faction network
   */
  buildFactionNetwork() {
    const baseFactions = this.baseBible.worldInfo?.factions || [];
    
    return {
      major: baseFactions.filter(f => f.role?.includes('major') || f.alignment?.includes('Lawful')) || [],
      minor: baseFactions.filter(f => !f.role?.includes('major')) || [],
      relationships: this.buildFactionRelationships(baseFactions),
      conflicts: this.buildFactionConflicts(baseFactions)
    };
  }

  /**
   * Build faction relationship map
   */
  buildFactionRelationships(factions) {
    const relationships = [];
    factions.forEach((f1, i) => {
      factions.slice(i + 1).forEach(f2 => {
        const alignment1 = f1.alignment || 'Neutral';
        const alignment2 = f2.alignment || 'Neutral';
        
        // Determine relationship based on alignment
        let relation = 'neutral';
        if (alignment1.includes('Good') && alignment2.includes('Evil')) {
          relation = 'hostile';
        } else if (alignment1.includes('Good') && alignment2.includes('Good')) {
          relation = 'allied';
        } else if (alignment1.includes('Evil') && alignment2.includes('Evil')) {
          relation = 'competitive';
        }
        
        relationships.push({
          faction1: f1.name,
          faction2: f2.name,
          type: relation,
          description: `${f1.name} and ${f2.name} are ${relation}`
        });
      });
    });
    
    return relationships;
  }

  /**
   * Build faction conflicts
   */
  buildFactionConflicts(factions) {
    const conflicts = [];
    factions.forEach(f => {
      if (f.alignment?.includes('Evil')) {
        conflicts.push({
          aggressor: f.name,
          target: 'Good-aligned factions',
          type: 'ideological',
          description: `${f.name} seeks to dominate or destroy good`
        });
      }
    });
    return conflicts;
  }

  /**
   * Build narrative engine for story generation
   */
  buildNarrativeEngine() {
    const style = this.baseBible.narrativeStyle || {};
    
    return {
      tone: style.tone || 'Epic and engaging',
      perspective: style.perspective || 'Third-person limited',
      pacing: style.pacing || 'Balanced action and reflection',
      themes: style.themes || ['Growth', 'Challenge', 'Discovery'],
      writingTips: style.writingTips || 'Show character growth through action',
      chapterStructure: this.generateChapterStructure(),
      arcPatterns: this.generateArcPatterns()
    };
  }

  /**
   * Generate chapter structure template
   */
  generateChapterStructure() {
    return {
      opening: {
        hook: 'Begin with action, mystery, or character moment',
        setup: 'Establish scene and current goal',
        incitingIncident: 'Introduce complication or discovery'
      },
      middle: {
        rising: 'Build tension through obstacles',
        climax: 'Peak confrontation or revelation',
        falling: 'Process consequences'
      },
      ending: {
        resolution: 'Resolve immediate conflict',
        hook: 'End with question or new direction',
        transition: 'Bridge to next chapter'
      }
    };
  }

  /**
   * Generate story arc patterns
   */
  generateArcPatterns() {
    const baseArcs = this.baseBible.plotInfo?.mainArcs || [];
    
    return baseArcs.length > 0 ? baseArcs : [
      { title: 'Awakening', chapters: '1-50', focus: 'Discovery of power/ability' },
      { title: 'Growth', chapters: '51-150', focus: 'Training and early challenges' },
      { title: 'Trials', chapters: '151-300', focus: 'Major obstacles and losses' },
      { title: 'Mastery', chapters: '301-500', focus: 'Achieving true power' },
      { title: 'Transcendence', chapters: '501+', focus: 'Beyond mortal limits' }
    ];
  }

  /**
   * Get comprehensive bible prompt for AI generation
   */
  getGenerationPrompt(context = {}) {
    return `
You are generating content for the book "${this.baseBible.title}".

WORLD CONTEXT:
- Setting: ${this.worldState.setting}
- Genre: ${this.worldState.genre}
- Tone: ${this.worldState.tone}
- Magic/Power System: ${JSON.stringify(this.powerSystem)}

CHARACTER CONTEXT:
- Protagonist: ${JSON.stringify(this.characterRoster.protagonist)}
- Allies: ${this.characterRoster.allies.map(a => a.name).join(', ') || 'None yet'}
- Antagonists: ${this.characterRoster.antagonists.map(a => a.name).join(', ') || 'None yet'}

FACTION CONTEXT:
- Major Factions: ${this.factionNetwork.major.map(f => f.name).join(', ') || 'None defined'}
- Faction Relationships: ${JSON.stringify(this.factionNetwork.relationships)}

NARRATIVE STYLE:
- Tone: ${this.narrativeEngine.tone}
- Perspective: ${this.narrativeEngine.perspective}
- Themes: ${this.narrativeEngine.themes.join(', ')}
- Writing Tips: ${this.narrativeEngine.writingTips}

ADDITIONAL CONTEXT: ${JSON.stringify(context)}

Generate content that:
1. Stays true to the established world rules
2. Maintains character consistency
3. Respects faction relationships
4. Follows the narrative style
5. Creates engaging, original content within these constraints
`;
  }
}

// ============================================================================
// 🎭 CHARACTER VOICE PROFILE SYSTEM - Unique voices for each character
// ============================================================================

export class CharacterVoiceProfile {
  constructor(character, bookBible) {
    this.character = character;
    this.bookBible = bookBible;
    this.voiceSettings = this.determineVoiceSettings();
  }

  /**
   * Determine voice settings based on character traits
   */
  determineVoiceSettings() {
    const char = this.character;
    
    // Map character traits to voice emotions
    const personality = char.personality?.toLowerCase() || '';
    const role = char.role?.toLowerCase() || '';
    
    let emotion = 'neutral';
    let pitch = 0;
    let speed = 1.0;
    
    // Personality-based voice mapping
    if (personality.includes('angry') || personality.includes('aggressive')) {
      emotion = 'angry';
      pitch = 2;
      speed = 1.1;
    } else if (personality.includes('sad') || personality.includes('melancholy')) {
      emotion = 'sad';
      pitch = -2;
      speed = 0.9;
    } else if (personality.includes('happy') || personality.includes('cheerful')) {
      emotion = 'happy';
      pitch = 3;
      speed = 1.15;
    } else if (personality.includes('fearful') || personality.includes('anxious')) {
      emotion = 'fearful';
      pitch = 1;
      speed = 0.85;
    } else if (personality.includes('surprised') || personality.includes('excited')) {
      emotion = 'surprise';
      pitch = 4;
      speed = 1.2;
    }
    
    // Role-based adjustments
    if (role.includes('villain') || role.includes('antagonist')) {
      pitch -= 1;
      speed *= 0.95;
    }
    
    if (role.includes('hero') || role.includes('protagonist')) {
      pitch += 1;
    }
    
    return { emotion, pitch, speed };
  }

  /**
   * Get Coisy voice parameters for this character
   */
  getCosyVoiceParams() {
    return {
      emotion: this.voiceSettings.emotion,
      pitch: this.voiceSettings.pitch,
      speed: this.voiceSettings.speed,
      style: this.determineStyle()
    };
  }

  /**
   * Determine speaking style
   */
  determineStyle() {
    const char = this.character;
    
    if (char.background?.includes('royal') || char.background?.includes('noble')) {
      return 'formal';
    }
    if (char.background?.includes('street') || char.background?.includes('thief')) {
      return 'casual';
    }
    if (char.personality?.includes('scholar') || char.personality?.includes('wise')) {
      return 'measured';
    }
    
    return 'neutral';
  }
}

// ============================================================================
// 🖼️ CONTEXTUAL IMAGE PROMPT GENERATOR - Book-specific image prompts
// ============================================================================

export class ContextualImagePromptGenerator {
  constructor(bookBible) {
    this.bookBible = bookBible;
    this.generatedPrompts = [];
  }

  /**
   * Generate image prompt based on current story context
   */
  generatePrompt(scene) {
    const { 
      chapter, 
      characters = [], 
      location = '', 
      action = '', 
      mood = 'neutral',
      faction = null,
      powerDisplayed = null
    } = scene;

    // Build character description
    const charDesc = this.buildCharacterDescription(characters);
    
    // Build location description
    const locDesc = this.buildLocationDescription(location);
    
    // Build action description
    const actDesc = this.buildActionDescription(action, powerDisplayed);
    
    // Build faction visual elements
    const factionDesc = this.buildFactionDescription(faction);
    
    // Build style modifiers based on book genre
    const styleMods = this.buildStyleModifiers();
    
    // Compose final prompt
    const prompt = `
${this.bookBible.baseBible.title} - Chapter ${chapter} Scene
${charDesc}
${locDesc}
${actDesc}
${factionDesc}
Style: ${styleMods.join(', ')}
Mood: ${mood}
    `.trim().replace(/\s+/g, ' ');

    return {
      prompt,
      seed: this.generateSeed(chapter, action, characters),
      style: this.bookBible.worldState.genre
    };
  }

  /**
   * Build character visual description
   */
  buildCharacterDescription(characters) {
    if (!characters || characters.length === 0) {
      return 'Protagonist in focus';
    }
    
    const descriptions = characters.map(char => {
      const bible = this.bookBible.characterRoster;
      const charData = bible?.allies?.find(c => c.name === char) || 
                       bible?.antagonists?.find(c => c.name === char) ||
                       { name: char, appearance: 'mysterious figure' };
      
      return `${char}: ${charData.appearance || 'unknown appearance'}`;
    });
    
    return `Characters: ${descriptions.join(', ')}`;
  }

  /**
   * Build location visual description
   */
  buildLocationDescription(location) {
    if (!location) {
      return 'Setting: mystical environment';
    }
    
    const world = this.bookBible.worldState;
    return `Location: ${location}, within ${world.setting}`;
  }

  /**
   * Build action description with power effects
   */
  buildActionDescription(action, powerDisplayed) {
    if (!action) {
      return 'Action: contemplative moment';
    }
    
    const powerSystem = this.bookBible.powerSystem;
    let powerDesc = '';
    
    if (powerDisplayed) {
      powerDesc = ` displaying ${powerSystem.name} abilities: ${powerDisplayed}`;
    }
    
    return `Action: ${action}${powerDesc}`;
  }

  /**
   * Build faction visual elements
   */
  buildFactionDescription(faction) {
    if (!faction) {
      return 'Faction: none specified';
    }
    
    const factionData = this.bookBible.factionNetwork.major.find(f => f.name === faction) ||
                        this.bookBible.factionNetwork.minor.find(f => f.name === faction);
    
    if (!factionData) {
      return `Faction: ${faction}`;
    }
    
    return `Faction: ${faction} (${factionData.role || 'unknown role'}), alignment: ${factionData.alignment || 'neutral'}`;
  }

  /**
   * Build style modifiers based on genre
   */
  buildStyleModifiers() {
    const genre = this.bookBible.worldState.genre?.toLowerCase() || '';
    
    const styleMap = {
      'litrpg': 'game UI elements, stat windows, level indicators, digital effects',
      'cultivation': 'ethereal qi energy, golden light, floating runes, ancient chinese aesthetics',
      'dark fantasy': 'gothic atmosphere, shadows, muted colors, dramatic lighting',
      'epic fantasy': 'grandiose scale, sweeping vistas, dramatic composition, heroic proportions',
      'sci-fi': 'futuristic technology, neon accents, sleek surfaces, holographic elements',
      'wuxia': 'flowing robes, martial arts poses, traditional chinese architecture, misty mountains',
      'xianxia': 'celestial clouds, divine light, immortal aesthetics, floating islands',
      'urban fantasy': 'modern city with magical elements, contemporary meets supernatural'
    };
    
    const found = Object.entries(styleMap).find(([key]) => genre.includes(key));
    return found 
      ? [found[1], 'cinematic lighting', 'high detail', '4K quality']
      : ['cinematic lighting', 'high detail', '4K quality', 'professional composition'];
  }

  /**
   * Generate deterministic seed for consistency
   */
  generateSeed(chapter, action, characters) {
    const base = `${this.bookBible.bookId}-${chapter}-${action}-${characters.join('-')}`;
    let hash = 0;
    for (let i = 0; i < base.length; i++) {
      hash = ((hash << 5) - hash) + base.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }
}

// ============================================================================
// 🎙️ AUDIOBOOK GENERATION ENGINE - Coisy voice integration
// ============================================================================

export class AudiobookGenerationEngine {
  constructor(bookId) {
    this.bookId = bookId;
    this.enhancedBible = new EnhancedBookBible(bookId);
    this.imagePromptGenerator = new ContextualImagePromptGenerator(this.enhancedBible);
    this.cosyVoiceEndpoint = 'http://localhost:3003/api/tts';
    this.cosyBridgeEndpoint = 'http://localhost:3004/api/audio';
  }

  /**
   * Generate audio using Coisy voice with emotion
   */
  async generateAudio(text, emotion = 'neutral', character = null) {
    let voiceParams = { emotion, speed: 1.0, pitch: 0 };
    
    // If character specified, use their voice profile
    if (character) {
      const profile = new CharacterVoiceProfile(character, this.enhancedBible);
      voiceParams = profile.getCosyVoiceParams();
    }
    
    // Try Coisy bridge first (local CosyVoice)
    try {
      const url = `${this.cosyBridgeEndpoint}?text=${encodeURIComponent(text)}&emotion=${voiceParams.emotion}`;
      const response = await fetch(url, { timeout: 30000 });
      
      if (response.ok) {
        return await response.buffer();
      }
    } catch (err) {
      console.warn('Coisy bridge failed, falling back to TTS service');
    }
    
    // Fallback to TTS service
    try {
      const url = `${this.cosyVoiceEndpoint}?text=${encodeURIComponent(text)}&emotion=${voiceParams.emotion}`;
      const response = await fetch(url, { timeout: 30000 });
      
      if (response.ok) {
        return await response.buffer();
      }
    } catch (err) {
      console.error('All TTS services failed');
    }
    
    throw new Error('Audio generation failed');
  }

  /**
   * Generate image sequence for current scene
   */
  async generateImageSequence(scene) {
    const imageData = this.imagePromptGenerator.generatePrompt(scene);
    
    try {
      const url = `http://localhost:3004/api/images?prompt=${encodeURIComponent(imageData.prompt)}&count=5`;
      const response = await fetch(url, { timeout: 60000 });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.error('Image generation failed:', err);
    }
    
    throw new Error('Image generation failed');
  }

  /**
   * Generate complete scene with audio and images
   */
  async generateScene(audioText, scene, emotion = 'neutral') {
    const [audioBuffer, imageData] = await Promise.all([
      this.generateAudio(audioText, emotion),
      this.generateImageSequence(scene)
    ]);
    
    return {
      audio: audioBuffer,
      images: imageData.images,
      scene: scene,
      emotion: emotion
    };
  }
}

// Export factory function
export function createAudiobookEngine(bookId) {
  return new AudiobookGenerationEngine(bookId);
}

export default {
  EnhancedBookBible,
  CharacterVoiceProfile,
  ContextualImagePromptGenerator,
  AudiobookGenerationEngine,
  createAudiobookEngine
};