import React, { useState, useEffect } from 'react';

/**
 * XAVIER-OS: AETHERIA 
 * Core index.js for the "Never-Ending" Audiobook PWA
 */

const NOIZ_API_KEY = "YTE0MjViMjgtNjVmMy00NzlhLWE5MmYtNTE4ZTU4YjU5MTE3JGphbWVzaGFwdXJvbmFAZ21haWwuY29t";

const XavierOS = () => {
  const [activeBook, setActiveBook] = useState(null);
  const [isAwakening, setIsAwakening] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  // 1. DATA: Direct referencing for Titles and Specific Images
  const bookLibrary = [
    {
      id: "vampire-system",
      title: "Vampire System",
      genre: "Grit / Progression",
      // Reference to the direct specific artwork we discussed
      cover: "/assets/images/covers/vampire-system.webp",
      description: "A world where leveling up costs blood."
    },
    {
      id: "heavenly-thief",
      title: "Heavenly Thief",
      genre: "Celestial Heist",
      cover: "/assets/images/covers/heavenly-thief.webp",
      description: "Stealing the light of the stars from the gods themselves."
    },
    {
      id: "shadow-monarch",
      title: "Shadow Monarch",
      genre: "Dark Fantasy",
      cover: "/assets/images/covers/shadow-monarch.webp",
      description: "Arise. The shadows belong to him now."
    }
  ];

  // 2. NOIZ API HANDLER: The "Awaken" Function
  const awakenBook = async (book) => {
    setIsAwakening(true);
    setActiveBook(book);

    try {
      // Calling the Noiz API to generate the AI voice narration
      const response = await fetch("https://api.noiz.ai/v1/tts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${NOIZ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: `Now Awakening: ${book.title}. ${book.description}`,
          voice_id: "narrator_pro_01", // High-end AI voice
          quality: "high"
        })
      });

      const data = await response.json();
      setAudioUrl(data.audio_url);
    } catch (error) {
      console.error("Awakening failed:", error);
    } finally {
      setIsAwakening(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>XAVIER-OS <span style={styles.accent}>AETHERIA</span></h1>
      </header>

      {/* Hero Section for Active Book */}
      {activeBook && (
        <div style={styles.nowPlaying}>
          <img src={activeBook.cover} alt="Active Cover" style={styles.heroImage} />
          <div style={styles.controls}>
            <h2>{activeBook.title}</h2>
            <p>{isAwakening ? "Awakening AI Voice..." : "System Active"}</p>
            {audioUrl && <audio controls src={audioUrl} autoPlay style={styles.audioPlayer} />}
          </div>
        </div>
      )}

      {/* The Library Grid */}
      <section style={styles.grid}>
        {bookLibrary.map((book) => (
          <div 
            key={book.id} 
            style={styles.card} 
            onClick={() => awakenBook(book)}
          >
            <div style={styles.imageWrapper}>
              <img src={book.cover} alt={book.title} style={styles.coverImage} />
              <div style={styles.overlay}>
                <span>AWAKEN</span>
              </div>
            </div>
            <h3 style={styles.bookTitle}>{book.title}</h3>
            <p style={styles.genreTag}>{book.genre}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

// 3. STYLES: Keeping it sleek and "OS" like
const styles = {
  container: { backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'Inter, sans-serif' },
  header: { textAlign: 'center', marginBottom: '40px' },
  logo: { fontSize: '1.5rem', letterSpacing: '4px' },
  accent: { color: '#ff3e3e' }, // Blood red accent for Vampire System vibes
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' },
  card: { cursor: 'pointer', textAlign: 'center', transition: 'transform 0.2s' },
  imageWrapper: { position: 'relative', overflow: 'hidden', borderRadius: '12px' },
  coverImage: { width: '100%', aspectRatio: '2/3', objectFit: 'cover' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,62,62,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.3s', hover: { opacity: 1 } },
  bookTitle: { marginTop: '10px', fontSize: '0.9rem' },
  genreTag: { fontSize: '0.7rem', color: '#888' },
  nowPlaying: { display: 'flex', gap: '20px', backgroundColor: '#151515', padding: '20px', borderRadius: '20px', marginBottom: '40px', border: '1px solid #333' },
  heroImage: { width: '120px', borderRadius: '10px' },
  audioPlayer: { width: '100%', marginTop: '15px' }
};

export default XavierOS;
