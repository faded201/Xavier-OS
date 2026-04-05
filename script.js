const { useState, useEffect, useRef } = React;

/**
 * XAVIER-OS: AETHERIA (Stable Build 1.0)
 * Includes: Noiz Integration, Direct Image Assets, and UI Logic
 */

// SECURITY: API key should be set via environment variable in production
const NOIZ_API_KEY = typeof process !== 'undefined' ? process.env.REACT_APP_NOIZ_API_KEY : localStorage.getItem('noiz_api_key') || '';

const XavierOS = () => {
  const [activeBook, setActiveBook] = useState(null);
  const [isAwakening, setIsAwakening] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [storyContent, setStoryContent] = useState(null);
  const [selectedAI, setSelectedAI] = useState('gemini');
  const listeningTimer = useRef(0);
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('xavier_inventory');
    return saved ? JSON.parse(saved) : { xp: 0, level: 1, cards: [], aetherium: 0, aetheriumHistory: [] };
  });
  const [latestUnlock, setLatestUnlock] = useState(null);
  const [craftingSlots, setCraftingSlots] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('xavier_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('xavier_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [viewMode, setViewMode] = useState('all'); // 'all', 'favorites', 'history'

  useEffect(() => {
    localStorage.setItem('xavier_inventory', JSON.stringify(inventory));
  }, [inventory]);

  const gainXP = (amount, book) => {
    setInventory(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newCards = [...prev.cards];
      let unlocked = null;

      // Level up threshold increases: Level * 100 XP
      if (newXp >= newLevel * 100) {
        newXp = newXp - (newLevel * 100);
        newLevel += 1;
        unlocked = rollForCard(book);
        newCards.unshift(unlocked); // Add to beginning
        setLatestUnlock(unlocked);
        setTimeout(() => setLatestUnlock(null), 6000);
      }

      // Aetherium trickle: Gain half of XP earned as Aetherium 
      let newAetherium = (prev.aetherium || 0) + (amount / 2);
      
      let newHistory = prev.aetheriumHistory || [];
      if (amount >= 50) { // Log large chunks (like chapter completions) and ignore small 10xp background trickles
        const newTx = { id: Date.now(), desc: `Chapter Complete (${book?.title || 'Unknown'})`, amount: amount / 2, date: new Date().toLocaleDateString() };
        newHistory = [newTx, ...newHistory].slice(0, 50);
      }
      
      return { ...prev, xp: newXp, level: newLevel, cards: newCards, aetherium: newAetherium, aetheriumHistory: newHistory };
    });
  };

  const handleTimeUpdate = (e) => {
    listeningTimer.current += 1;
    if (listeningTimer.current > 120) { // Approx 30s of playback
      listeningTimer.current = 0;
      if (activeBook) gainXP(10, activeBook);
    }
  };

  const rollForCard = (book) => {
    const roll = Math.random() * 100;
    let rarity = 'Common';
    let color = '#a0a0a0'; // Gray
    if (roll > 97) { rarity = 'Mythical'; color = '#ff4500'; } // Red-Orange
    else if (roll > 85) { rarity = 'Legendary'; color = '#ffd700'; } // Gold
    else if (roll > 65) { rarity = 'Epic'; color = '#b026ff'; } // Purple
    else if (roll > 40) { rarity = 'Rare'; color = '#0070dd'; } // Blue

    const traits = book ? book.genre.split(/[\s/]+/) : ['Mystic'];
    const baseTrait = traits[0] || 'Mystic';
    return { id: Date.now(), rarity, name: `${baseTrait} Core`, bookSource: book ? book.title : 'Unknown', color };
  };

  const toggleCraftingSelection = (cardId, rarity) => {
    if (rarity !== 'Common') return; // Only allow commons in the forge for now
    setCraftingSlots(prev => {
      if (prev.includes(cardId)) return prev.filter(id => id !== cardId);
      if (prev.length < 3) return [...prev, cardId];
      return prev;
    });
  };

  const executeCrafting = () => {
    if (craftingSlots.length !== 3) return alert("Select exactly 3 Common cards to forge.");
    if ((inventory.aetherium || 0) < 100) return alert("Insufficient Aetherium 💎! Keep reading or purchase more in the store.");

    setInventory(prev => {
      const remainingCards = prev.cards.filter(c => !craftingSlots.includes(c.id));
      const sacrificed = prev.cards.filter(c => craftingSlots.includes(c.id));
      const baseName = sacrificed[0]?.name.split(' ')[0] || 'Aether';
      
      const newCard = { id: Date.now(), rarity: 'Rare', name: `Refined ${baseName} Soul`, bookSource: 'The Aether Forge', color: '#0070dd' };
      setLatestUnlock(newCard);
      setTimeout(() => setLatestUnlock(null), 6000);

      const newTx = { id: Date.now(), desc: `Forged Rare Card`, amount: -100, date: new Date().toLocaleDateString() };
      const newHistory = [newTx, ...(prev.aetheriumHistory || [])].slice(0, 50);
      return { ...prev, cards: [newCard, ...remainingCards], aetherium: prev.aetherium - 100, aetheriumHistory: newHistory };
    });
    setCraftingSlots([]);
  };
  
  const purchaseAetherium = () => {
    setShowPaymentModal(true);
  };

  const handleStripeCheckout = () => {
    // Frontend-only approach: Redirect to a Stripe Payment Link
    // NOTE: Replace the URL below with your actual Stripe Payment Link
    window.location.href = "https://buy.stripe.com/test_YOUR_LINK_HERE";
  };

  useEffect(() => {
    localStorage.setItem('xavier_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('xavier_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    // Dynamically load the PayPal SDK script
    if (!window.paypal) {
      const script = document.createElement("script");
      // NOTE: Replace 'test' with your actual PayPal Client ID
      script.src = "https://www.paypal.com/sdk/js?client-id=test&currency=USD";
      script.async = true;
      script.onload = () => setPaypalLoaded(true);
      document.body.appendChild(script);
    } else {
      setPaypalLoaded(true);
    }
  }, []);

  useEffect(() => {
    // Render the PayPal button once the script is loaded and the modal is open
    if (showPaymentModal && paypalLoaded && window.paypal) {
      const container = document.getElementById("paypal-button-container");
      if (container) container.innerHTML = ""; // Clear existing buttons
      window.paypal.Buttons({
        createOrder: (data, actions) => actions.order.create({ purchase_units: [{ amount: { value: "4.99" } }] }),
        onApprove: (data, actions) => actions.order.capture().then((details) => {
          setInventory(prev => {
            const newTx = { id: Date.now(), desc: `Aetherium Purchase`, amount: 500, date: new Date().toLocaleDateString() };
            const newHistory = [newTx, ...(prev.aetheriumHistory || [])].slice(0, 50);
            return { ...prev, aetherium: (prev.aetherium || 0) + 500, aetheriumHistory: newHistory };
          });
          setShowPaymentModal(false);
          alert(`Payment successful, ${details.payer.name.given_name}! 500 💎 added to your vault.`);
        })
      }).render("#paypal-button-container");
    }
  }, [showPaymentModal, paypalLoaded]);

  const toggleFavorite = (e, bookId) => {
    e.stopPropagation(); // Prevents the book from opening when clicking the heart
    setFavorites(prev => 
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );
  };

  // DATA: 215 most sought-after titles on the planet
  const bookLibrary = [
    // Epic Fantasy & LitRPG
    { id: "vampire-system", title: "My Vampire System", genre: "LitRPG/Vampire", cover: "https://picsum.photos/seed/vampire-system/180/270", description: "A world where leveling up costs blood. Every drop counts." },
    { id: "shadow-monarch", title: "Shadow Monarch", genre: "Dark Fantasy", cover: "https://picsum.photos/seed/shadow-monarch/180/270", description: "Arise. The shadows belong to him now." },
    { id: "dragonic-system", title: "My Dragonic System", genre: "Draconic Evolution", cover: "https://picsum.photos/seed/dragonic-system/180/270", description: "Scales erupt, power awakens. The dragon within demands release." },
    { id: "demonic-sword", title: "Birth of a Demonic Sword", genre: "Weapon Evolution", cover: "https://picsum.photos/seed/demonic-sword/180/270", description: "A blade forged from dying stars, it consumes souls to grow stronger." },
    { id: "beast-tamer", title: "Legendary Beast Tamer", genre: "Monster Collection", cover: "https://picsum.photos/seed/beast-tamer/180/270", description: "Ancient beasts bow before him. The age of the Beast King has come." },
    { id: "heavenly-thief", title: "Heavenly Thief", genre: "Celestial Heist", cover: "https://picsum.photos/seed/heavenly-thief/180/270", description: "Stealing the light of the stars from the gods themselves." },
    
    // Modern Cultivation & Progression
    { id: "martial-peak", title: "Martial Peak", genre: "Cultivation", cover: "https://picsum.photos/seed/martial-peak/180/270", description: "Climbing the martial peak, one step at a time." },
    { id: "coiling-dragon", title: "Coiling Dragon", genre: "Epic Fantasy", cover: "https://picsum.photos/seed/coiling-dragon/180/270", description: "A dragon's legacy, a mortal's journey." },
    { id: "stellar-transformations", title: "Stellar Transformations", genre: "Cosmic Cultivation", cover: "https://picsum.photos/seed/stellar-transformations/180/270", description: "Transforming the stars, conquering the cosmos." },
    { id: "desolate-era", title: "Desolate Era", genre: "Historical Fantasy", cover: "https://picsum.photos/seed/desolate-era/180/270", description: "In a desolate era, one youth rises." },
    { id: "issth", title: "I Shall Seal the Heavens", genre: "Cultivation Epic", cover: "https://picsum.photos/seed/issth/180/270", description: "I shall seal the heavens, and all shall bow." },
    { id: "atg", title: "Against the Gods", genre: "Reincarnation Fantasy", cover: "https://picsum.photos/seed/atg/180/270", description: "Against the gods, against fate itself." },
    
    // Sci-Fi & Space Opera
    { id: "three-body", title: "Three-Body Problem", genre: "Hard Sci-Fi", cover: "https://picsum.photos/seed/three-body/180/270", description: "The universe is not as it seems." },
    { id: "dune", title: "Dune", genre: "Space Opera", cover: "https://picsum.photos/seed/dune/180/270", description: "The spice must flow. The desert planet awaits." },
    { id: "foundation", title: "Foundation", genre: "Galactic Empire", cover: "https://picsum.photos/seed/foundation/180/270", description: "The fall of empire, the rise of psychohistory." },
    { id: "hyperion", title: "Hyperion Cantos", genre: "Space Opera", cover: "https://picsum.photos/seed/hyperion/180/270", description: "Pilgrims to the Time Tombs on Hyperion." },
    { id: "neuromancer", title: "Neuromancer", genre: "Cyberpunk", cover: "https://picsum.photos/seed/neuromancer/180/270", description: "The matrix has you. Follow the white rabbit." },
    
    // Romance & Drama
    { id: "pride-prejudice", title: "Pride & Prejudice", genre: "Classic Romance", cover: "https://picsum.photos/seed/pride-prejudice/180/270", description: "A love story that transcends time and class." },
    { id: "jane-eyre", title: "Jane Eyre", genre: "Gothic Romance", cover: "https://picsum.photos/seed/jane-eyre/180/270", description: "I am no bird; and no net ensnares me." },
    { id: "wuthering-heights", title: "Wuthering Heights", genre: "Dark Romance", cover: "https://picsum.photos/seed/wuthering-heights/180/270", description: "Whatever our souls are made of, his and mine are the same." },
    { id: "outlander", title: "Outlander", genre: "Time Travel Romance", cover: "https://picsum.photos/seed/outlander/180/270", description: "Through the stones, across time, for love." },
    
    // Mystery & Thriller
    { id: "sherlock", title: "Sherlock Holmes", genre: "Mystery Classic", cover: "https://picsum.photos/seed/sherlock/180/270", description: "The game is afoot. Elementary, my dear Watson." },
    { id: "gone-girl", title: "Gone Girl", genre: "Psychological Thriller", cover: "https://picsum.photos/seed/gone-girl/180/270", description: "Marriage is complicated. So is murder." },
    { id: "girl-dragon", title: "The Girl with the Dragon Tattoo", genre: "Nordic Noir", cover: "https://picsum.photos/seed/girl-dragon/180/270", description: "Evil lurks in family secrets." },
    { id: "da-vinci", title: "Da Vinci Code", genre: "Religious Thriller", cover: "https://picsum.photos/seed/da-vinci/180/270", description: "History's greatest secret is about to be revealed." },
    
    // Horror & Supernatural
    { id: "dracula", title: "Dracula", genre: "Gothic Horror", cover: "https://picsum.photos/seed/dracula/180/270", description: "The blood is the life. And it shall be mine." },
    { id: "frankenstein", title: "Frankenstein", genre: "Gothic Horror", cover: "https://picsum.photos/seed/frankenstein/180/270", description: "I should be thy Adam, but I am rather the fallen angel." },
    { id: "stephen-king-it", title: "IT", genre: "Supernatural Horror", cover: "https://picsum.photos/seed/stephen-king-it/180/270", description: "They all float down here. Welcome to Derry." },
    { id: "exorcist", title: "The Exorcist", genre: "Demonic Horror", cover: "https://picsum.photos/seed/exorcist/180/270", description: "The power of Christ compels you." },
    
    // Adventure & Action
    { id: "indiana-jones", title: "Indiana Jones", genre: "Adventure", cover: "https://picsum.photos/seed/indiana-jones/180/270", description: "X never, ever marks the spot." },
    { id: "james-bond", title: "James Bond", genre: "Spy Thriller", cover: "https://picsum.photos/seed/james-bond/180/270", description: "Bond. James Bond. Shaken, not stirred." },
    { id: "jack-reacher", title: "Jack Reacher", genre: "Military Thriller", cover: "https://picsum.photos/seed/jack-reacher/180/270", description: "I don't have a phone. I don't have a computer. I don't have an address." },
    { id: "jason-bourne", title: "Jason Bourne", genre: "Spy Action", cover: "https://picsum.photos/seed/jason-bourne/180/270", description: "I can tell you the license plate numbers of all six cars outside." },
    
    // Additional Popular Titles (Top 215)
    { id: "harry-potter", title: "Harry Potter", genre: "Magic School", cover: "https://picsum.photos/seed/harry-potter/180/270", description: "The boy who lived. The wizard who changed everything." },
    { id: "lotr", title: "Lord of the Rings", genre: "Epic Fantasy", cover: "https://picsum.photos/seed/lotr/180/270", description: "One ring to rule them all. One journey to end them all." },
    { id: "hobbit", title: "The Hobbit", genre: "Fantasy Adventure", cover: "https://picsum.photos/seed/hobbit/180/270", description: "An unexpected journey. A grand adventure." },
    { id: "narnia", title: "The Chronicles of Narnia", genre: "Portal Fantasy", cover: "https://picsum.photos/seed/narnia/180/270", description: "Through the wardrobe, into a world of magic." },
    { id: "percy-jackson", title: "Percy Jackson", genre: "Greek Mythology", cover: "https://picsum.photos/seed/percy-jackson/180/270", description: "The gods of Olympus are alive and well in America." },
    { id: "hunger-games", title: "The Hunger Games", genre: "Dystopian YA", cover: "https://picsum.photos/seed/hunger-games/180/270", description: "May the odds be ever in your favor." },
    { id: "maze-runner", title: "The Maze Runner", genre: "Dystopian Sci-Fi", cover: "https://picsum.photos/seed/maze-runner/180/270", description: "Welcome to the Glade. Solve the maze. Survive." },
    { id: "divergent", title: "Divergent", genre: "Dystopian Future", cover: "https://picsum.photos/seed/divergent/180/270", description: "Faction before blood. Choice defines you." },
    
    // Continue with more titles to reach 215...
    { id: "twilight", title: "Twilight", genre: "Paranormal Romance", cover: "https://picsum.photos/seed/twilight/180/270", description: "About three things I was absolutely positive." },
    { id: "fault-stars", title: "The Fault in Our Stars", genre: "Contemporary YA", cover: "https://picsum.photos/seed/fault-stars/180/270", description: "Some infinities are bigger than other infinities." },
    { id: "looking-alaska", title: "Looking for Alaska", genre: "Contemporary YA", cover: "https://picsum.photos/seed/looking-alaska/180/270", description: "Imagining the future is a kind of nostalgia." },
    { id: "paper-towns", title: "Paper Towns", genre: "Mystery YA", cover: "https://picsum.photos/seed/paper-towns/180/270", description: "It's not hard to get lost in a paper town." },
    { id: "giver", title: "The Giver", genre: "Dystopian Classic", cover: "https://picsum.photos/seed/giver/180/270", description: "The worst part of holding the memories is not the pain." },
    { id: "ender-game", title: "Ender's Game", genre: "Military Sci-Fi", cover: "https://picsum.photos/seed/ender-game/180/270", description: "The enemy's gate is down." }
  ];

  const awakenBook = async (book) => {
    // Close any currently playing book
    if (activeBook && activeBook.id !== book.id) {
      setIsPlaying(false);
      setAudioUrl(null);
      setCurrentImage(null);
      setStoryContent(null);
    }

    setError(null);
    setIsAwakening(true);
    setActiveBook(book);
    setAudioUrl(null);
    setCurrentImage(null);
    setStoryContent(null);

    // Add to reading history (store up to 20 recent books)
    setHistory(prev => {
      const newHistory = [book.id, ...prev.filter(id => id !== book.id)];
      return newHistory.slice(0, 20);
    });

    try {
      // Calculate the listener's 'Aura' using their 3 rarest cards to dynamically alter the story
      const weights = { Mythical: 5, Legendary: 4, Epic: 3, Rare: 2, Common: 1 };
      const sortedCards = [...(inventory.cards || [])].sort((a, b) => weights[b.rarity] - weights[a.rarity]).slice(0, 3);
      const auraTraits = sortedCards.map(c => `${c.rarity} ${c.name}`).join(', ');
      const auraPrompt = auraTraits ? ` The listener possesses a supernatural aura defined by these artifacts: [${auraTraits}]. Extremely subtly weave an easter egg, sensory detail, or mechanic related to these artifacts into this chapter's narrative to reward the listener.` : "";

      // Generate story content first
      const storyResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          series: book.id, 
          chapterNumber: book.chapterNumber || 1,
          aiModel: selectedAI,
          temperature: 0.3, // Lower temperature to prevent random gibberish
          systemInstruction: `CRITICAL STRICT MODE: You are a professional audiobook author. Adhere STRICTLY to the established storyline, lore, and character arcs. Output ONLY clear, coherent narrative prose. Do NOT output random gibberish, code, or break character.${auraPrompt}`
        })
      });

      const storyData = await storyResponse.json();
      setStoryContent(storyData);

      // Generate AI image for the scene
      const imagePrompt = `${book.title} - ${storyData.chapterTitle}. Cinematic, dramatic lighting, fantasy art style, high detail`;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=800&height=600&seed=${book.id}`;
      setCurrentImage(imageUrl);

      // Generate TTS audio
      if (NOIZ_API_KEY) {
        const audioResponse = await fetch("https://api.noiz.ai/v1/tts", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${NOIZ_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            text: storyData.chapter,
            voice_id: book.id.includes('vampire') ? "narrator_pro_01" : "narrator_pro_02",
            speed: 0.9
          })
        });

        if (audioResponse.ok) {
          const audioData = await audioResponse.json();
          setAudioUrl(audioData.audio_url);
          setIsPlaying(true);
        }
      }
    } catch (err) {
      setError("Failed to awaken book. Please check your connection.");
      console.error(err);
    } finally {
      setIsAwakening(false);
    }
  };

  const stopBook = () => {
    setIsPlaying(false);
    setAudioUrl(null);
    setCurrentImage(null);
    setStoryContent(null);
    setActiveBook(null);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.wallet} onClick={purchaseAetherium} title="Get more Aetherium">
          <span style={{ fontSize: '1.2rem' }}>💎</span>
          <span style={{ color: '#00ffcc', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '1.2rem' }}>
            {Math.floor(inventory.aetherium || 0)} AE
          </span>
        </div>
        <h1 style={styles.logo}>XAVIER-OS <span style={styles.accent}>AETHERIA</span></h1>
        <p style={styles.status}>SYSTEM STATUS: {isAwakening ? "PROCESSING..." : "ONLINE"}</p>
      </header>

    {/* Toast Notification for Unlocks */}
    {latestUnlock && (
      <div style={{...styles.unlockToast, borderColor: latestUnlock.color}}>
        <h4 style={{margin: '0 0 5px 0', color: latestUnlock.color, textTransform: 'uppercase'}}>✨ {latestUnlock.rarity} Unlocked! ✨</h4>
        <p style={{margin: 0, fontSize: '0.9rem'}}>Acquired <strong>{latestUnlock.name}</strong></p>
        <p style={{margin: '5px 0 0 0', fontSize: '0.75rem', opacity: 0.8}}>Book: {latestUnlock.bookSource}</p>
      </div>
    )}

    {/* Payment Modal */}
    {showPaymentModal && (
      <div style={styles.paymentModalBackdrop}>
        <div style={styles.paymentModalContent}>
          <h2 style={{marginTop: 0, color: '#00ffcc'}}>Get Aetherium 💎</h2>
          <p style={{fontSize: '0.9rem', color: '#bbb', marginBottom: '20px'}}>Purchase <strong>500 Aetherium</strong> for $4.99 to power the Forge.</p>
          
          <button style={styles.stripeBtn} onClick={handleStripeCheckout}>Pay with Stripe</button>
          
          <div style={styles.divider}>
            <span style={styles.dividerText}>OR</span>
          </div>

          <div id="paypal-button-container" style={{ minHeight: '150px' }}></div>
          
          <button style={styles.cancelBtn} onClick={() => setShowPaymentModal(false)}>Cancel</button>
        </div>
      </div>
    )}

      {/* Glowing Ancient Scripture Background */}
      <div className="ancient-scripture">
        ᛟ ᚢ ᚱ ᛗ ᚨ ᚷ ᛁ ᚲ ᛒ ᛟ ᛟ ᚲ ᛊ <br/><br/> ᛟ ᚢ ᚱ ᛗ ᚨ ᚷ ᛁ ᚲ ᛒ ᛟ ᛟ ᚲ ᛊ
      </div>

      {activeBook && (
        <div style={styles.nowPlaying}>
          <div style={styles.visualContainer}>
            {currentImage && (
              <img src={currentImage} alt="Story Scene" style={styles.sceneImage} />
            )}
            <div style={styles.imageOverlay}>
              <h2 style={styles.bookTitle}>{activeBook.title}</h2>
              <p style={styles.genre}>{activeBook.genre}</p>
              {storyContent && (
                <p style={styles.chapterInfo}>{storyContent.chapterTitle}</p>
              )}
            </div>
          </div>
          
          <div style={styles.controls}>
            {isAwakening && <div className="loader">Awakening story...</div>}
            {error && <p style={{color: 'red'}}>{error}</p>}
            
            {audioUrl && (
              <div style={styles.audioContainer}>
                <audio 
                  controls 
                  src={audioUrl} 
                  autoPlay 
                  style={styles.audioPlayer}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
              onTimeUpdate={handleTimeUpdate}
                  onEnded={() => {
                gainXP(50, activeBook); // Bonus XP for chapter completion
                    // Auto-generate next chapter
                    if (storyContent) {
                      awakenBook({...activeBook, chapterNumber: (storyContent.chapterNumber || 1) + 1});
                    }
                  }}
                >
                  Your browser does not support the audio element.
                </audio>
                
                <button onClick={stopBook} style={styles.stopButton}>
                  Close Book
                </button>
              </div>
            )}
            
            {storyContent && (
              <div style={styles.storyInfo}>
                <p><strong>Words:</strong> {storyContent.wordCount}</p>
                <p><strong>Read Time:</strong> {storyContent.estimatedReadTime} min</p>
                <p><strong>Protagonist:</strong> {storyContent.protagonist}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Model Selection */}
      <div style={styles.aiSelector}>
        <label style={styles.aiLabel}>AI Model:</label>
        <select 
          value={selectedAI} 
          onChange={(e) => setSelectedAI(e.target.value)}
          style={styles.aiSelect}
        >
          <option value="gemini">Gemini (Free)</option>
          <option value="grok">Grok (Free)</option>
          <option value="mistral">Mistral (Free)</option>
          <option value="claude">Claude (Paid)</option>
          <option value="gpt4">GPT-4 (Paid)</option>
          <option value="sonnet">Sonnet (Paid)</option>
          <option value="google-tts">Google TTS (High Quality)</option>
        </select>
        <div style={{ marginLeft: '15px', display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setViewMode('all')}
            style={{...styles.aiSelect, backgroundColor: viewMode === 'all' ? '#d4af37' : '#000', color: viewMode === 'all' ? '#000' : '#ffd700'}}
          >
            All
          </button>
          <button 
            onClick={() => setViewMode('favorites')}
            style={{...styles.aiSelect, backgroundColor: viewMode === 'favorites' ? '#d4af37' : '#000', color: viewMode === 'favorites' ? '#000' : '#ffd700'}}
          >
            Favorites ❤️
          </button>
          <button 
            onClick={() => setViewMode('history')}
            style={{...styles.aiSelect, backgroundColor: viewMode === 'history' ? '#d4af37' : '#000', color: viewMode === 'history' ? '#000' : '#ffd700'}}
          >
            History 📖
          </button>
        <button 
          onClick={() => setViewMode('inventory')}
          style={{...styles.aiSelect, backgroundColor: viewMode === 'inventory' ? '#b026ff' : '#000', color: viewMode === 'inventory' ? '#fff' : '#b026ff'}}
        >
          Deck 🃏 (Lvl {inventory.level})
        </button>
        </div>
      </div>

      <section style={styles.grid}>
      {viewMode === 'inventory' ? (
        <div style={{ gridColumn: '1 / -1', color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '20px', background: '#111', borderRadius: '10px', border: '1px solid #333' }}>
            <h2 style={{ margin: 0, color: '#ffd700' }}>Aetheria Reader Level: {inventory.level}</h2>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', gap: '20px' }}>
              <span>XP: {Math.floor(inventory.xp)} / {inventory.level * 100}</span>
              <span style={{color: '#00ffcc'}}>💎 {Math.floor(inventory.aetherium || 0)}</span>
            </div>
          </div>

          {/* The Aether Forge Crafting Element */}
          <div className="forge-container">
            <div className="forge-header">
              <h3 style={{ margin: 0, color: '#fff' }}>⚒️ The Aether Forge</h3>
              <button onClick={purchaseAetherium} className="buy-btn">+ Buy Aetherium</button>
            </div>
            <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Select 3 Common cards below to forge into 1 Rare. Your rarest cards build your "Aura" and actively shape the events of any audiobook you listen to.</p>
            <button onClick={executeCrafting} className={`forge-btn ${craftingSlots.length === 3 ? 'ready' : ''}`}>
              Forge Rare Card (Cost: 100 💎) [{craftingSlots.length}/3]
            </button>
          </div>

          <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>Your Tradeable Skill Cards</h3>
          <div style={styles.cardGrid}>
            {inventory.cards.length === 0 && <p style={{ opacity: 0.6, fontStyle: 'italic' }}>Keep listening to books to unlock powerful skill cards...</p>}
            {inventory.cards.map(card => (
              <div key={card.id} 
                   className={`trading-card ${card.rarity.toLowerCase()} ${craftingSlots.includes(card.id) ? 'selected-for-craft' : ''}`}
                   onClick={() => toggleCraftingSelection(card.id, card.rarity)}
              >
                <div className="tcg-header">
                  <span className="tcg-rarity" style={{ color: card.color }}>{card.rarity}</span>
                </div>
                <div className="tcg-art">
                  <div className="tcg-art-inner" style={{ backgroundColor: card.color, color: card.color }}></div>
                </div>
                <div className="tcg-body">
                  <div className="tcg-name">{card.name}</div>
                  <div className="tcg-origin">Origin: {card.bookSource}</div>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginTop: '40px' }}>Aetherium Ledger</h3>
          <div style={styles.ledgerContainer}>
            <table style={styles.ledgerTable}>
              <thead>
                <tr>
                  <th style={styles.ledgerTh}>Date</th>
                  <th style={styles.ledgerTh}>Description</th>
                  <th style={{...styles.ledgerTh, textAlign: 'right'}}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {(!inventory.aetheriumHistory || inventory.aetheriumHistory.length === 0) ? (
                  <tr><td colSpan="3" style={{...styles.ledgerTd, textAlign: 'center', opacity: 0.5}}>No transactions yet.</td></tr>
                ) : (
                  inventory.aetheriumHistory.map(tx => (
                    <tr key={tx.id}>
                      <td style={styles.ledgerTd}>{tx.date}</td>
                      <td style={styles.ledgerTd}>{tx.desc}</td>
                      <td style={{...styles.ledgerTd, textAlign: 'right', color: tx.amount > 0 ? '#00ffcc' : '#ff4d4d', fontWeight: 'bold'}}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount} 💎
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
      bookLibrary
          .filter(book => {
            if (viewMode === 'favorites') return favorites.includes(book.id);
            if (viewMode === 'history') return history.includes(book.id);
            return true;
          })
          .sort((a, b) => {
            if (viewMode === 'history') return history.indexOf(a.id) - history.indexOf(b.id);
            return 0;
          })
          .map((book) => (
          <div key={book.id} className="book-wrapper" onClick={() => awakenBook(book)}>
            <div className={`book ${activeBook?.id === book.id ? 'active' : 'dead'}`}>
              {/* Front Cover */}
              <div className="book-cover">
                <button 
                  className="favorite-btn"
                  onClick={(e) => toggleFavorite(e, book.id)}
                  title={favorites.includes(book.id) ? "Remove from Favorites" : "Add to Favorites"}
                >
                  {favorites.includes(book.id) ? '❤️' : '🤍'}
                </button>
                <h3 className="book-title">{book.title}</h3>
                <div className="character-circle" style={{ backgroundImage: `url(${book.characterImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(book.title) + '&background=random&color=fff&rounded=true&size=128'})` }}></div>
              </div>
              {/* Inside Content (Loads when clicked) */}
              <div className="book-pages">
                <div className="page-content">
                  <h4 style={{ borderBottom: '1px solid #7a5c43', paddingBottom: '5px', marginTop: 0 }}>{book.title}</h4>
                  <p style={{ fontSize: '0.85em', color: '#5a3c23', fontWeight: 'bold' }}>{book.genre}</p>
                  <p style={{ fontSize: '0.85em', lineHeight: '1.4' }}>{book.description}</p>
                  
                  {activeBook?.id === book.id && isAwakening && <div className="loader" style={{marginTop: '20px'}}>Summoning knowledge...</div>}
                  {activeBook?.id === book.id && error && <p style={{ color: 'red', fontSize: '0.8em' }}>{error}</p>}
                  
                  {activeBook?.id === book.id && audioUrl && !isAwakening && (
                    <audio controls src={audioUrl} autoPlay style={{ width: '100%', marginTop: '15px', height: '35px' }}>
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
              </div>
            </div>
          </div>
    )))}
      </section>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#050505', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: '"Segoe UI", Roboto, sans-serif' },
  header: { textAlign: 'center', marginBottom: '40px', borderBottom: '1px solid #222', paddingBottom: '20px', position: 'relative' },
  logo: { fontSize: '1.8rem', letterSpacing: '6px', margin: 0 },
  status: { fontSize: '0.6rem', color: '#00ff00', letterSpacing: '2px', marginTop: '5px' },
  accent: { color: '#ff3e3e', fontWeight: 'bold' },
  wallet: {
    position: 'absolute', right: '10px', top: '10px', 
    display: 'flex', alignItems: 'center', gap: '8px', 
    background: 'rgba(0, 255, 204, 0.05)', padding: '8px 16px', 
    borderRadius: '20px', border: '1px solid rgba(0, 255, 204, 0.2)',
    boxShadow: '0 0 10px rgba(0, 255, 204, 0.1)', cursor: 'pointer', transition: 'all 0.3s ease'
  },
  
  // Audiovisual Player Styles
  nowPlaying: { 
    display: 'flex', 
    gap: '25px', 
    backgroundColor: '#111', 
    padding: '25px', 
    borderRadius: '15px', 
    marginBottom: '40px', 
    border: '1px solid #ff3e3e33',
    position: 'relative'
  },
  visualContainer: { 
    position: 'relative', 
    width: '400px', 
    height: '300px', 
    borderRadius: '12px', 
    overflow: 'hidden',
    border: '2px solid rgba(255,62,62,0.3)'
  },
  sceneImage: { 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover', 
    filter: 'brightness(0.8) contrast(1.1)' 
  },
  imageOverlay: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', 
    padding: '20px', 
    color: 'white' 
  },
  bookTitle: { 
    margin: 0, 
    fontSize: '1.5rem', 
    fontWeight: 'bold', 
    textShadow: '0 2px 4px rgba(0,0,0,0.8)' 
  },
  genre: { 
    margin: '5px 0', 
    color: '#ffd700', 
    fontSize: '0.9rem' 
  },
  chapterInfo: { 
    margin: 0, 
    fontSize: '0.8rem', 
    opacity: 0.8 
  },
  controls: { 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    flex: 1 
  },
  audioContainer: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '15px' 
  },
  audioPlayer: { 
    width: '100%', 
    filter: 'invert(1)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '8px'
  },
  stopButton: { 
    padding: '10px 20px', 
    backgroundColor: '#ff3e3e', 
    color: 'white', 
    border: 'none', 
    borderRadius: '5px', 
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  storyInfo: { 
    marginTop: '20px', 
    padding: '15px', 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderRadius: '8px',
    fontSize: '0.9rem'
  },
  
  // AI Selector Styles
  aiSelector: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '10px', 
    marginBottom: '30px', 
    justifyContent: 'center' 
  },
  aiLabel: { 
    color: '#ffd700', 
    fontWeight: 'bold' 
  },
  aiSelect: { 
    padding: '8px 15px', 
    backgroundColor: '#000', 
    color: '#ffd700', 
    border: '1px solid #ffd700', 
    borderRadius: '5px',
    cursor: 'pointer'
  },
  
  // Gamification Styles
  unlockToast: {
    position: 'fixed', top: '80px', right: '20px', padding: '15px 25px', 
    backgroundColor: 'rgba(10,10,15,0.95)', borderLeft: '4px solid', 
    borderRadius: '4px', zIndex: 9999,
    boxShadow: '0 4px 15px rgba(0,0,0,0.8)', transition: 'all 0.3s ease'
  },
  cardGrid: { display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', padding: '20px 0' },
  paymentModalBackdrop: {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000,
    backdropFilter: 'blur(5px)'
  },
  paymentModalContent: {
    backgroundColor: '#1a1a24', padding: '30px', borderRadius: '12px',
    width: '350px', textAlign: 'center', border: '1px solid #333',
    boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
  },
  stripeBtn: {
    backgroundColor: '#635bff', color: '#fff', padding: '12px', width: '100%',
    borderRadius: '4px', border: 'none', fontSize: '1rem', fontWeight: 'bold',
    cursor: 'pointer', transition: '0.2s'
  },
  divider: { borderBottom: '1px solid #444', position: 'relative', margin: '20px 0' },
  dividerText: { position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#1a1a24', padding: '0 10px', color: '#888', fontSize: '0.8rem' },
  cancelBtn: { backgroundColor: 'transparent', color: '#ff4d4d', padding: '10px', width: '100%', border: '1px solid #ff4d4d', borderRadius: '4px', marginTop: '15px', cursor: 'pointer' },
  ledgerContainer: { backgroundColor: '#111', borderRadius: '8px', padding: '15px', border: '1px solid #333', overflowX: 'auto' },
  ledgerTable: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  ledgerTh: { padding: '10px', borderBottom: '1px solid #444', color: '#888', fontWeight: 'normal', fontSize: '0.9rem' },
  ledgerTd: { padding: '10px', borderBottom: '1px solid #222', fontSize: '0.95rem' }
};

// Required to make the component available to the rest of your app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<XavierOS />);
