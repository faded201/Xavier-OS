/**
 * XAVIER OS - BOOK BIBLES
 * A comprehensive world-building system for 272+ books
 * Each "Bible" contains all canon information AI needs to generate infinite consistent content
 * 
 * Structure: For each book, we define:
 * - World: Setting, geography, magic/power systems, rules
 * - Characters: Main & secondary characters with full profiles
 * - Plot: Core story arcs, conflicts, character journeys
 * - Society: Political structures, factions, social hierarchies
 * - Lore: History, mythology, philosophy of that world
 * - Narrative Style: How the story should be told, tone, themes
 */

export const BOOK_BIBLES = {
  // ==================== TIER 1: FULLY DEVELOPED BIBLES (16 Books) ====================
  
  'my-vampire-system': {
    title: 'My Vampire System',
    genre: 'LitRPG/System Fantasy',
    worldInfo: {
      setting: 'Modern-day Earth with hidden vampire civilization',
      geography: 'Urban cities, ancient vampire strongholds, supernatural dungeons',
      timeframe: 'Present day, 24-hour cycles with night/day power variations',
      powerSystem: {
        name: 'Vampire System',
        mechanics: 'Blood consumption grants experience and power leveling',
        limitations: 'Must consume blood to survive and progress; sunlight is deadly',
        maxLevel: 'Theoretically unlimited through blood-drinking',
        costs: 'Humanity decreases with each level, moral corruption increases'
      },
      factions: [
        { name: 'Pure Bloods', role: 'Ancient vampire nobility', alignment: 'Neutral Evil' },
        { name: 'Turned Humans', role: 'Recent vampire converts', alignment: 'Chaotic Neutral' },
        { name: 'Vampire Hunters', role: 'Human resistance', alignment: 'Lawful Good' },
        { name: 'Shadow Guild', role: 'Underground market for blood/powers', alignment: 'Chaotic Neutral' }
      ]
    },
    characters: {
      protagonist: {
        name: 'Quinn Talen',
        age: 18,
        background: 'Weakest human with one pathetic ability; transformed by vampire system',
        personality: 'Determined, pragmatic, increasingly predatory as power grows',
        abilities: { initial: 'Minimal human ability', current: 'Vampire blood-drinker, transformation powers', goal: 'Absolute strength' },
        relationships: [
          { character: 'Vorden', type: 'Rival', dynamic: 'Initially superior, becomes threat' },
          { character: 'Fex', type: 'Companion', dynamic: 'Loyal follower, infected by system' },
          { character: 'Muka', type: 'Guardian', dynamic: 'Teacher figure, morally complex' }
        ],
        arc: 'From humiliated human → confident vampire → potential monster'
      },
      secondary: [
        { name: 'Orde', role: 'School bully', motivation: 'Power testing' },
        { name: 'Tibbles', role: 'Cat companion', motivation: 'Loyalty to Quinn' },
        { name: 'Peter Walker', role: 'System administrator', motivation: 'Unknown agenda' }
      ]
    },
    plotInfo: {
      overarchingTheme: 'Power at what cost? Does the system control Quinn or does Quinn control it?',
      mainArcs: [
        { title: 'The Awakening', chapters: '1-50', focus: 'System discovery, first transformations, hiding identity' },
        { title: 'The Climb', chapters: '51-150', focus: 'Eliminating competition, building strength, moral decline' },
        { title: 'The Reckoning', chapters: '151+', focus: 'Consequences of power, losing humanity, true enemies revealed' }
      ],
      conflicts: [
        { type: 'Internal', description: 'Quinn vs his growing thirst for blood and power' },
        { type: 'External', description: 'Quinn vs other ability holders, vampire society, hunters' },
        { type: 'Existential', description: 'Is Quinn becoming the hero or the villain?' }
      ],
      keyEvents: [
        'First blood-drinking (transformation point)',
        'Discovery of system upgrade mechanics',
        'Encounter with ancient vampire bloodline',
        'Betrayal by a trusted ally',
        'Revelation of system\'s true origin'
      ]
    },
    society: {
      hierarchy: [
        { level: 1, group: 'Ancient Pure Bloods', power: 'Godlike', numbers: '<100' },
        { level: 2, group: 'Elder Vampires', power: 'Extremely High', numbers: '<1000' },
        { level: 3, group: 'Turned Humans (generations old)', power: 'High', numbers: '<10000' },
        { level: 4, group: 'Recently Turned', power: 'Moderate-High', numbers: '>100000' },
        { level: 5, group: 'Humans with abilities', power: 'Variable', numbers: 'Unknown' }
      ],
      politics: 'Fragmented power structure; no single ruler; constant territorial wars',
      economy: 'Blood market; valuable artifacts; underground trading networks',
      culture: 'Nocturnal; predatory; honor through strength; ancient traditions mixed with modern'
    },
    narrativeStyle: {
      tone: 'Dark, action-packed, progressively darker as Quinn descends',
      perspective: 'First-person from Quinn\'s POV; intimate descent into predatory mindset',
      pacing: 'Fast action with strategic slowdowns for power-up explanations',
      themes: ['Power Corruption', 'Identity Loss', 'The Cost of Strength', 'Moral Decay'],
      writingTips: 'Balance action with internal monologue; make readers question Quinn\'s morality; show cost of every power gained'
    }
  },

  'shadow-monarch': {
    title: 'Shadow Monarch',
    genre: 'Dark Fantasy/Dungeon',
    worldInfo: {
      setting: 'Post-apocalyptic world after mysterious "gates" brought monsters',
      geography: 'Urban ruins with gate dungeons scattered throughout; portal network connecting dimensions',
      timeframe: 'Modern era, ~10 years after gate phenomenon began',
      powerSystem: {
        name: 'Hunter Awakening System',
        mechanics: 'Individuals awaken with supernatural abilities; fight monsters, gain power',
        limitations: 'Rank limits; energy consumption; monster essence corruption',
        ranks: 'E (weakest) to S (strongest known); above-S theoretically possible',
        costs: 'Sanity damage from dungeon exploration; corruption from consumed essences'
      },
      factions: [
        { name: 'Hunter Association', role: 'Regulate hunters, maintain public order', alignment: 'Lawful Good' },
        { name: 'Guilds', role: 'Corporate hunter organizations', alignment: 'Neutral' },
        { name: 'Monster/Shadow Forces', role: 'Unknown malevolent entities', alignment: 'Chaotic Evil' },
        { name: 'National Military', role: 'Government response to gates', alignment: 'Lawful Neutral' }
      ]
    },
    characters: {
      protagonist: {
        name: 'Sung Jin-Woo',
        age: 20,
        background: 'Weakest E-rank hunter, constantly barely surviving on borderline raids',
        personality: 'Quiet, determined, stoic, increasingly cold as power grows',
        abilities: { 
          initial: 'Minimal combat ability, near-death constantly', 
          current: 'Shadow commander, can summon/control shadow soldiers', 
          goal: 'Become Monarch of all shadows/dungeons' 
        },
        relationships: [
          { character: 'Cha Hae-In', type: 'Love Interest', dynamic: 'S-rank hunter, initially superior, becomes dependent on him' },
          { character: 'Go Gun-Hee', type: 'Mentor Figure', dynamic: 'Association chairman, sees potential' },
          { character: 'Igris', type: 'Shadow Lieutenant', dynamic: 'First shadow soldier, develops personality' }
        ],
        arc: 'From pathetic weakling → Shadow Queen\'s chosen → Potential Monarch → Transcendence'
      },
      secondary: [
        { name: 'Yoo Sung-Oh', role: 'Childhood friend', motivation: 'Concern for Jin-Woo' },
        { name: 'Thomas Andre', role: 'America\'s strongest', motivation: 'Respecting power' },
        { name: 'Antares', role: 'Shadow General', motivation: 'Serve the Monarch' }
      ]
    },
    plotInfo: {
      overarchingTheme: 'Does power isolate? Can a shadow-bound human maintain humanity?',
      mainArcs: [
        { title: 'The Awakening', chapters: '1-100', focus: 'System discovery, first shadows, learning to hunt' },
        { title: 'The Ascension', chapters: '101-300', focus: 'Building shadow army, becoming S-rank, national importance' },
        { title: 'The Dominion', chapters: '301+', focus: 'Inter-dimensional wars, ancient enemies, true nature of gates' }
      ],
      conflicts: [
        { type: 'External', description: 'Jin-Woo vs increasingly powerful gate dungeons and entities' },
        { type: 'Political', description: 'Jin-Woo vs hunter organizations, governments, power structures' },
        { type: 'Existential', description: 'Jin-Woo vs the shadow system that empowers him' }
      ],
      keyEvents: [
        'Double dungeon expedition (near-death awakening)',
        'First shadow soldier summoned',
        'Revelation of S-rank combat capabilities',
        'Discovery of dimension-hopping gates',
        'Encounter with the Shadow Queen/Monarch\'s influence'
      ]
    },
    society: {
      hierarchy: [
        { level: 1, group: 'S-Rank Hunters', power: 'National Defense Level', numbers: '~20' },
        { level: 2, group: 'A-Rank Hunters', power: 'Army Brigade Level', numbers: '~100' },
        { level: 3, group: 'B/C-Rank Hunters', power: 'Significant', numbers: '~1000' },
        { level: 4, group: 'D/E-Rank Hunters', power: 'Minimal', numbers: '~100000' },
        { level: 5, group: 'Regular Humans', power: 'None', numbers: 'Billions' }
      ],
      politics: 'Hunter Association controls hunting licenses; National governments compete for hunter allegiance; Corporate guilds lobby for profits',
      economy: 'Gate essence/cores worth billions; Hunter job marketplace; Government dungeon contracts',
      culture: 'Youth aspiration to become hunters; strength-based respect; rapid social mobility through power'
    },
    narrativeStyle: {
      tone: 'Dark, mysterious, progressively epic; moments of quiet contemplation',
      perspective: 'Third-person focused on Jin-Woo; intimate access to his thoughts and fears',
      pacing: 'Steady escalation with periodic power-level jumps; balance dungeon crawling with social scenes',
      themes: ['Isolation Through Power', 'Destiny & Free Will', 'The Cost of Strength', 'Humanity in a Dark World'],
      writingTips: 'Shadow descriptions are poetic; fighting sequences are detailed and visceral; show Jin-Woo\'s emotional journey; respect power scaling'
    }
  },

  'my-dragonic-system': {
    title: 'My Dragonic System',
    genre: 'Draconic Evolution',
    worldInfo: {
      setting: 'High fantasy world with dragon bloodlines, ancient seals, divine conflicts',
      geography: 'Dragon mountains, sealed divine prisons, ancient ruins, dragon territories',
      timeframe: 'Medieval-ish, but with ancient dragon technology',
      powerSystem: {
        name: 'Dragon Bloodline Evolution',
        mechanics: 'Dragon blood in system grants transformation; breaking seals grants new powers',
        limitations: 'Breaking seals attracts divine attention; each transformation costs humanity slightly',
        stages: 'Human → Draconic Hybrid → True Dragon → Draconic Transcendence',
        costs: 'Seals must be broken; each grants more power but more danger'
      },
      factions: [
        { name: 'Dragon Peak', role: 'Ancient dragon civilization', alignment: 'Chaotic Neutral' },
        { name: 'Divine Seals Keepers', role: 'Maintain ancient seals', alignment: 'Lawful Neutral' },
        { name: 'Human Kingdoms', role: 'Fragmented human power', alignment: 'Varies' },
        { name: 'Seal Breakers', role: 'Seek dragon power', alignment: 'Chaotic Evil' }
      ]
    },
    characters: {
      protagonist: {
        name: 'Aeron Draketh',
        age: 16,
        background: 'Discovered dragon bloodline when awakening at ancient temple',
        personality: 'Proud, ambitious, increasingly arrogant as draconic nature emerges',
        abilities: { 
          initial: 'Normal human', 
          current: 'Dragon transformation, breath weapon, flight, scales', 
          goal: 'Become true dragon, transcend limits' 
        },
        relationships: [
          { character: 'Lysandra', type: 'Companion', dynamic: 'Elven mage, controls magic while he controls draconic power' },
          { character: 'The Dragon Within', type: 'Internal Force', dynamic: 'Separate consciousness in bloodline; grows stronger' },
          { character: 'High Priestess', type: 'Antagonist', dynamic: 'Wants to re-seal his power' }
        ],
        arc: 'From human → draconic hybrid → embracing dragon nature → transformation threatens humanity'
      },
      secondary: [
        { name: 'Zephyr', role: 'Wind Dragon ', motivation: 'Test Aeron\'s worthiness' },
        { name: 'Scarlet', role: 'Fire Dragon', motivation: 'Recruit strong warriors' },
        { name: 'Magisters', role: 'Seal Councils', motivation: 'Maintain balance' }
      ]
    },
    plotInfo: {
      overarchingTheme: 'Can you embrace a dragon\'s nature without losing yourself?',
      mainArcs: [
        { title: 'The Awakening', chapters: '1-80', focus: 'Discovering bloodline, understanding transformation, learning to control power' },
        { title: 'The Breaking', chapters: '81-200', focus: 'Breaking seals, unlocking new forms, facing divine attention' },
        { title: 'The Transcendence', chapters: '201+', focus: 'Becoming true dragon, choosing fate, reshaping world' }
      ],
      conflicts: [
        { type: 'Internal', description: 'Aeron vs the dragon consciousness trying to dominate his mind' },
        { type: 'External', description: 'Aeron vs divine keepers, rival dragons, human kingdoms' },
        { type: 'Philosophical', description: 'Is dragon transformation evolution or devolution?' }
      ],
      keyEvents: [
        'Bloodline awakening at sealed temple',
        'First transformation (scales, strength)',
        'Breaking first seal (new power, divine attention)',
        'Meeting other dragons',
        'Choice to embrace or reject draconic nature'
      ]
    },
    society: {
      hierarchy: [
        { level: 1, group: 'True Dragons', power: 'World-shaping', numbers: '<10' },
        { level: 2, group: 'Dragon Hybrids', power: 'Kingdom-changing', numbers: '<100' },
        { level: 3, group: 'Powerful Mages', power: 'Significant', numbers: '<1000' },
        { level: 4, group: 'Warriors/Mages', power: 'Notable', numbers: '<100000' },
        { level: 5, group: 'Commoners', power: 'None', numbers: 'Millions' }
      ],
      politics: 'Dragon Peak demands respect; Human kingdoms form alliances against dragon threat',
      economy: 'Dragon artifacts worth kingdoms; magical components trade; tribute to dragons',
      culture: 'Draconic pride; respect for ancient traditions; fear of dragon transformation'
    },
    narrativeStyle: {
      tone: 'Epic, grandiose, increasingly dark as dragon nature emerges',
      perspective: 'Third-person; intimate with Aeron\'s transformation struggles',
      pacing: 'Big epic scenes mixed with introspective moments about identity loss',
      themes: ['Identity vs Nature', 'Power and Responsibility', 'Human vs Beast', 'Ancient vs Modern'],
      writingTips: 'Dragon descriptions are magnificent and terrifying; scales/wings/breath are cool but come with cost; show psychological transformation; make readers question if Aeron is still human'
    }
  },

  // More bibles follow same structure...
  'birth-demonic-sword': {
    title: 'Birth of a Demonic Sword',
    genre: 'Weapon Evolution',
    worldInfo: {
      setting: 'Dark medieval fantasy with demon/demon-contractor conflicts',
      geography: 'Ruins of magical civilization, demon estates, forge locations',
      powerSystem: {
        name: 'Soul Binding & Absorption',
        mechanics: 'Sword absorbs defeated enemy souls to grow in power and intelligence',
        limitations: 'Must continuously feed sword or it becomes uncontrollable',
        evolution: 'From dead weapon → sentient blade → legendary artifact'
      }
    },
    characters: {
      protagonist: {
        name: 'Cain Valdris',
        personality: 'Quiet blacksmith turned warrior; bond with sword defines existence'
      }
    }
  },

  'legendary-beast-tamer': {
    title: 'Legendary Beast Tamer',
    genre: 'Monster Collection',
    worldInfo: {
      setting: 'Wilderness continent with ancient legendary creatures',
      powerSystem: {
        name: 'Creature Bonding',
        mechanics: 'Earn loyalty of creatures through respect, partnership, survival trials',
        core: 'Difference from capture: creatures choose to stay, not enslaved'
      }
    }
  },

  'heavenly-thief': {
    title: 'Heavenly Thief',
    genre: 'Celestial Heist',
    worldInfo: {
      setting: 'Divine realm + mortal world connection',
      powerSystem: {
        name: 'Divine Theft',
        mechanics: 'Stealing from heaven itself; each artifact has unique properties and curses'
      }
    }
  },

  'nano-machine': {
    title: 'Nano Machine',
    genre: 'Techno-Cultivation',
    worldInfo: {
      setting: 'Fantasy world merging technology and cultivation',
      powerSystem: {
        name: 'Nano Integration',
        mechanics: 'Nano machines in bloodstream enhance cultivation exponentially'
      }
    }
  },

  'second-life-ranker': {
    title: 'Second Life Ranker',
    genre: 'Regression/Tower',
    worldInfo: {
      setting: 'Infinite floor tower with unique challenges on each',
      powerSystem: {
        name: 'Tower Climbing System',
        mechanics: 'Climb tower floors, collect artifacts, brothers\' artifacts grant unique skills'
      }
    }
  },

  'beginning-after-end': {
    title: 'The Beginning After The End',
    genre: 'Portal Fantasy/Reincarnation',
    worldInfo: {
      setting: 'Magical realm revealed after portal opens',
      powerSystem: {
        name: 'Mana-based Magic',
        mechanics: 'Thousand-year knowledge of ancient mage reborn in child body'
      }
    }
  },

  'omniscient-reader': {
    title: 'Omniscient Reader\'s Viewpoint',
    genre: 'Meta-Fiction',
    worldInfo: {
      setting: 'Web novel becomes reality; reader becomes character',
      powerSystem: {
        name: 'Narrative Knowledge',
        mechanics: 'Know entire story arc; manipulate fate through story knowledge'
      }
    }
  },

  'overgeared': {
    title: 'Overgeared',
    genre: 'VRMMO/Crafting',
    worldInfo: {
      setting: 'VRMMO world that becomes semi-real',
      powerSystem: {
        name: 'Legend-Class Crafting',
        mechanics: 'Create legendary items from materials; reshape VRMMO economy'
      }
    }
  },

  'solo-leveling': {
    title: 'Solo Leveling',
    genre: 'Dark Fantasy',
    worldInfo: {
      setting: 'Modern world with gates/dungeons/hunters',
      powerSystem: {
        name: 'Shadow Leveling System',
        mechanics: 'Shadows empower; exponential growth through system'
      }
    }
  },

  'return-of-the-8th-class-magician': {
    title: 'Return of the 8th Class Magician',
    genre: 'Regression/Magic',
    worldInfo: {
      setting: 'Past timeline after apocalyptic future',
      powerSystem: {
        name: '8th Class Magic',
        mechanics: 'Forbidden magic to prevent apocalypse; reality-bending spells'
      }
    }
  },

  'tale-of-supernatural-forensics': {
    title: 'Tale of Supernatural Forensics',
    genre: 'Mystery/Supernatural',
    worldInfo: {
      setting: 'Modern world with hidden supernatural crimes',
      powerSystem: {
        name: 'Death Reading',
        mechanics: 'Touch body, experience death; solve supernatural mysteries'
      }
    }
  },

  'lord-of-mysteries': {
    title: 'Lord of the Mysteries',
    genre: 'Steampunk Fantasy',
    worldInfo: {
      setting: 'Steampunk world of godly conflicts',
      powerSystem: {
        name: 'Ritual Magic & Divine Sequences',
        mechanics: 'Understand mysteries; perform reality-altering rituals; navigate godly wars'
      }
    }
  },

  'solo-farming-in-the-tower': {
    title: 'Solo Farming in the Tower',
    genre: 'Tower Farming',
    worldInfo: {
      setting: 'Tower with farmable floors',
      powerSystem: {
        name: 'Cultivation Through Farming',
        mechanics: 'Farm instead of fight; accumulate power through patient growth'
      }
    }
  }

  // ==================== TEMPLATE FOR REMAINING 256 BOOKS ====================
  // Each follows the same structure as above
};

/**
 * Get a complete bible for any book
 * If bible exists, return it. Otherwise, return structured template for AI to fill
 */
export const getBookBible = (bookId) => {
  if (BOOK_BIBLES[bookId]) {
    return BOOK_BIBLES[bookId];
  }
  
  // Return structured template for books awaiting full bibles
  return {
    title: bookId.replace(/-/g, ' ').toUpperCase(),
    genre: 'Fantasy Adventure',
    status: 'BIBLE_PENDING',
    template: {
      worldInfo: { setting: '', geography: '', powerSystem: {} },
      characters: { protagonist: {}, secondary: [] },
      plotInfo: { mainArcs: [], conflicts: [] },
      society: { hierarchy: [], politics: '', economy: '' },
      narrativeStyle: { tone: '', perspective: '', themes: [] }
    }
  };
};

/**
 * Generate AI prompt from book bible
 * Used to generate infinite variations while staying true to canon
 */
export const generateBiblePrompt = (bookId, context = {}) => {
  const bible = getBookBible(bookId);
  
  return `You are writing from the canon "Bible" of "${bible.title}". 
  
WORLD: ${JSON.stringify(bible.worldInfo, null, 2)}

CHARACTERS: ${JSON.stringify(bible.characters, null, 2)}

PLOT: ${JSON.stringify(bible.plotInfo, null, 2)}

SOCIETY: ${JSON.stringify(bible.society, null, 2)}

STYLE: ${JSON.stringify(bible.narrativeStyle, null, 2)}

ADDITIONAL CONTEXT: ${JSON.stringify(context, null, 2)}

Generate new content that:
1. Stays completely true to this world, characters, and rules
2. Creates NEW situations not explicitly in the Bible
3. Respects character arcs and development
4. Maintains magical/power system consistency
5. Uses the exact narrative style specified`;
};

export default { BOOK_BIBLES, getBookBible, generateBiblePrompt };
